import { connection } from "next/server";
import { getDb } from "../../db";
import { fromDb } from "../../db/validate";
import { agenda, topicColors } from "../../db/schema";
import { fail } from "../_util";

// Semua agenda + warna topik.
export async function GET() {
  await connection(); // selalu dijalankan saat request (bukan di-prerender)
  try {
    const db = await getDb();
    const [rows, colors] = await Promise.all([db.select().from(agenda), db.select().from(topicColors)]);
    return Response.json({
      rows: rows.map(fromDb),
      colors: Object.fromEntries(colors.map((c) => [c.topic, c.color])),
    });
  } catch (e) {
    return fail(e);
  }
}
