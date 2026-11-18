import { getDb } from "../../db";
import { agenda, topicColors } from "../../db/schema";
import { COLOR_RE, ID_RE, parseRow, toDb } from "../../db/validate";
import { bad, fail } from "../_util";

// Impor sekali jalan dari data lama di localStorage browser (hanya bila database masih kosong).
export async function POST(req: Request) {
  let b: { rows?: unknown; colors?: unknown };
  try {
    b = await req.json();
  } catch {
    return bad("JSON tidak valid");
  }
  if (!Array.isArray(b.rows) || b.rows.length > 2000) return bad("rows tidak valid");
  const rows = [];
  for (const r of b.rows) {
    const id = (r as { id?: unknown })?.id;
    if (typeof id !== "string" || !ID_RE.test(id)) return bad("id tidak valid");
    const p = parseRow(r, id);
    if ("error" in p) return bad(p.error);
    rows.push(toDb(p.row));
  }
  const colors = Object.entries((b.colors ?? {}) as Record<string, unknown>).filter(
    ([t, c]) => t.trim() && t.length <= 100 && typeof c === "string" && COLOR_RE.test(c),
  ) as [string, string][];
  try {
    const db = await getDb();
    const existing = await db.select({ id: agenda.id }).from(agenda).limit(1);
    if (existing.length) return Response.json({ ok: true, imported: 0, reason: "database tidak kosong" });
    if (rows.length) await db.insert(agenda).values(rows);
    if (colors.length)
      await db.insert(topicColors).values(colors.map(([topic, color]) => ({ topic: topic.trim(), color: color.toLowerCase() })));
    return Response.json({ ok: true, imported: rows.length });
  } catch (e) {
    return fail(e);
  }
}
