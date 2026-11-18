import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { agenda } from "../../../db/schema";
import { ID_RE, parseRow, toDb } from "../../../db/validate";
import { bad, fail } from "../../_util";

// Simpan (buat atau perbarui) satu agenda.
export async function PUT(req: Request, ctx: RouteContext<"/api/agenda/[id]">) {
  const { id } = await ctx.params;
  if (!ID_RE.test(id)) return bad("id tidak valid");
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bad("JSON tidak valid");
  }
  const parsed = parseRow(body, id);
  if ("error" in parsed) return bad(parsed.error);
  try {
    const db = await getDb();
    const values = toDb(parsed.row);
    await db
      .insert(agenda)
      .values(values)
      .onDuplicateKeyUpdate({
        set: { kegiatan: values.kegiatan, topic: values.topic, tanggal: values.tanggal, jam: values.jam, lampiran: values.lampiran },
      });
    return Response.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/agenda/[id]">) {
  const { id } = await ctx.params;
  if (!ID_RE.test(id)) return bad("id tidak valid");
  try {
    const db = await getDb();
    await db.delete(agenda).where(eq(agenda.id, id));
    return Response.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
