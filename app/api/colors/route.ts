import { getDb } from "../../db";
import { topicColors } from "../../db/schema";
import { COLOR_RE } from "../../db/validate";
import { bad, fail } from "../_util";

// Simpan warna satu topik.
export async function PUT(req: Request) {
  let b: { topic?: unknown; color?: unknown };
  try {
    b = await req.json();
  } catch {
    return bad("JSON tidak valid");
  }
  if (typeof b.topic !== "string" || !b.topic.trim() || b.topic.length > 100) return bad("topic tidak valid");
  if (typeof b.color !== "string" || !COLOR_RE.test(b.color)) return bad("color harus #rrggbb");
  try {
    const db = await getDb();
    await db
      .insert(topicColors)
      .values({ topic: b.topic.trim(), color: b.color.toLowerCase() })
      .onDuplicateKeyUpdate({ set: { color: b.color.toLowerCase() } });
    return Response.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
