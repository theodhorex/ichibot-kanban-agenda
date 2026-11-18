import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import * as schema from "./schema";

// Hanya dipakai dari route handler (server). Koneksi: DATABASE_URL di .env.local
// contoh: mysql://user:password@127.0.0.1:3306/ichibot_kanban
type Db = MySql2Database<typeof schema>;
const g = globalThis as unknown as { __ichibotDb?: { db: Db; ready: Promise<void> } };

export class DbConfigError extends Error {}

function create() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new DbConfigError("DATABASE_URL belum diisi di .env.local");
  const pool = mysql.createPool({ uri: url, connectionLimit: 5, charset: "utf8mb4", dateStrings: true });
  const db = drizzle(pool, { schema, mode: "default" });
  // Tabel dibuat/diperbarui otomatis dari folder ./drizzle (idempoten).
  const ready = migrate(db, { migrationsFolder: "drizzle" });
  ready.catch(() => {
    g.__ichibotDb = undefined; // coba lagi pada permintaan berikutnya
  });
  return { db, ready };
}

export async function getDb(): Promise<Db> {
  const cur = (g.__ichibotDb ??= create());
  await cur.ready;
  return cur.db;
}
