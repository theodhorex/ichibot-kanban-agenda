import { sql } from "drizzle-orm";
import { index, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// Satu baris = satu agenda. `lampiran` disimpan sebagai teks JSON (kompatibel MySQL dan MariaDB).
export const agenda = mysqlTable(
  "agenda",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    kegiatan: varchar("kegiatan", { length: 500 }).notNull().default(""),
    topic: varchar("topic", { length: 100 }).notNull().default(""),
    tanggal: varchar("tanggal", { length: 10 }), // YYYY-MM-DD; null = belum bertanggal
    jam: varchar("jam", { length: 40 }).notNull().default(""),
    lampiran: text("lampiran").notNull(),
    createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  },
  (t) => [index("agenda_tanggal_idx").on(t.tanggal)],
);

export const topicColors = mysqlTable("topic_colors", {
  topic: varchar("topic", { length: 100 }).primaryKey(),
  color: varchar("color", { length: 7 }).notNull(),
});
