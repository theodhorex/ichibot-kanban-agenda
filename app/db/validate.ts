import { dmyToIso, isoToDmy, safeHref, type AgendaRow, type Attachment } from "../lib/agenda-data";
import type { agenda } from "./schema";

type DbRow = typeof agenda.$inferSelect;

export const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
export const COLOR_RE = /^#[0-9a-fA-F]{6}$/;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** Validasi body dari klien; mengembalikan baris bersih atau pesan galat. */
export function parseRow(input: unknown, id: string): { row: AgendaRow } | { error: string } {
  if (!isObj(input)) return { error: "Body harus berupa objek" };
  const str = (k: string, max: number) => {
    const v = input[k] ?? "";
    return typeof v === "string" && v.length <= max ? v : null;
  };
  const kegiatan = str("kegiatan", 500);
  const topic = str("topic", 100);
  const date = str("date", 10);
  const jam = str("jam", 40);
  if (kegiatan === null) return { error: "kegiatan tidak valid (maks 500 karakter)" };
  if (topic === null) return { error: "topic tidak valid (maks 100 karakter)" };
  if (jam === null) return { error: "jam tidak valid (maks 40 karakter)" };
  if (date === null || (date !== "" && !dmyToIso(date))) return { error: "date harus dd/mm/yyyy" };

  const raw = input.lampiran ?? [];
  if (!Array.isArray(raw) || raw.length > 20) return { error: "lampiran maksimal 20 item" };
  const lampiran: Attachment[] = [];
  for (const a of raw) {
    if (!isObj(a) || typeof a.type !== "string" || typeof a.url !== "string" || a.type.length > 40 || a.url.length > 2000)
      return { error: "lampiran tidak valid" };
    const href = safeHref(a.url);
    if (!href) return { error: "lampiran hanya boleh alamat http/https" };
    lampiran.push({ type: a.type, url: href });
  }
  return { row: { id, kegiatan, topic: topic.trim(), date, jam, lampiran } };
}

export const toDb = (r: AgendaRow) => ({
  id: r.id,
  kegiatan: r.kegiatan,
  topic: r.topic,
  tanggal: dmyToIso(r.date),
  jam: r.jam,
  lampiran: JSON.stringify(r.lampiran),
});

export function fromDb(r: DbRow): AgendaRow {
  let lampiran: Attachment[] = [];
  try {
    const v = JSON.parse(r.lampiran);
    if (Array.isArray(v)) lampiran = v;
  } catch {}
  return {
    id: r.id,
    kegiatan: r.kegiatan,
    topic: r.topic,
    date: r.tanggal ? isoToDmy(r.tanggal) : "",
    jam: r.jam,
    lampiran,
  };
}
