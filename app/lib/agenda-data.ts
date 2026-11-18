export type Attachment = { type: string; url: string };

export type AgendaRow = {
  id: string;
  kegiatan: string;
  topic: string;
  date: string; // dd/mm/yyyy
  jam: string; // "HH:MM" atau "HH:MM s.d HH:MM"
  lampiran: Attachment[];
};

export const ATTACHMENT_TYPES = ["Undangan", "Link Meeting", "Surat Tugas", "Lainnya"];

// Data lama (versi sebelum popup) memakai satu string `link`.
export function normalizeRow(r: Partial<AgendaRow> & { link?: string }): AgendaRow {
  const lampiran = Array.isArray(r.lampiran)
    ? r.lampiran
    : r.link && r.link.trim()
      ? [{ type: "Lainnya", url: r.link.trim() }]
      : [];
  return {
    id: r.id ?? newId(),
    kegiatan: r.kegiatan ?? "",
    topic: r.topic ?? "",
    date: r.date ?? "",
    jam: r.jam ?? "",
    lampiran,
  };
}

// Hanya izinkan http(s) agar tautan tidak bisa menjalankan skrip.
export function safeHref(url: string): string | null {
  const u = url.trim();
  if (!u) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(u) ? u : `https://${u}`;
  return /^https?:\/\//i.test(withScheme) ? withScheme : null;
}

// Jumlah baris minimum yang ditampilkan (baris kosong = "kanvas" untuk diklik).
export const MIN_DISPLAY_ROWS = 40;

export const newId = () =>
  `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const isBlankRow = (r: AgendaRow) =>
  !r.kegiatan.trim() && !r.topic.trim() && !r.date.trim() && !r.jam.trim() && r.lampiran.length === 0;

// Urut berdasarkan tanggal lalu jam; yang tak bertanggal di bawah.
export function sortRows(rows: AgendaRow[]): AgendaRow[] {
  const key = (r: AgendaRow) => dmyToIso(r.date) ?? "9999-99-99";
  return [...rows].sort((a, b) => key(a).localeCompare(key(b)) || a.jam.localeCompare(b.jam));
}

export const emptyRow = (): AgendaRow => ({ id: newId(), kegiatan: "", topic: "", date: "", jam: "", lampiran: [] });

// Data contoh. Ganti dengan API/database nanti.
export const INITIAL_ROWS: AgendaRow[] = [
  { id: "seed-1", kegiatan: "Rapat Human Resource dan Kapten: Persiapan Magang", topic: "HR", date: "07/11/2026", jam: "15:00 s.d 15:30", lampiran: [] },
  { id: "seed-2", kegiatan: "Presentasi Akhir Magang dan PKL: Laporan Akhir", topic: "HR", date: "13/11/2026", jam: "", lampiran: [] },
  { id: "seed-3", kegiatan: "On Boarding PKL & Internship", topic: "HR", date: "09/11/2026", jam: "", lampiran: [] },
  { id: "seed-4", kegiatan: "Kunjungan Bimbingan Konseling BPVP Surabaya", topic: "General", date: "12/11/2026", jam: "", lampiran: [] },
];

// Warna penanda di timeline per topik.
export const TOPIC_COLORS: Record<string, string> = {
  HR: "#e69138",
  General: "#3d85c6",
};
export const DEFAULT_TOPIC_COLOR = "#6aa84f";

export const MONTHS = [
  "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
  "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER",
];

// getDay(): 0 = Minggu ... 6 = Sabtu
export const DAY_LETTERS = ["M", "S", "S", "R", "K", "J", "S"];

export type Day = { iso: string; day: number; letter: string; weekend: boolean; first: boolean };

export function buildYear(year: number) {
  return MONTHS.map((name, m) => {
    const n = new Date(year, m + 1, 0).getDate();
    const days: Day[] = Array.from({ length: n }, (_, i) => {
      const d = new Date(year, m, i + 1);
      const wd = d.getDay();
      return {
        iso: `${year}-${String(m + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`,
        day: i + 1,
        letter: DAY_LETTERS[wd],
        weekend: wd === 0 || wd === 6,
        first: i === 0,
      };
    });
    return { name, days };
  });
}

// "07/11/2026" -> "2026-11-07" (null bila tidak valid)
export function dmyToIso(s: string): string | null {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s.trim());
  if (!m) return null;
  const [, d, mo, y] = m;
  // tolak tanggal yang tidak ada di kalender (mis. 31/02/2026)
  const dt = new Date(Number(y), Number(mo) - 1, Number(d));
  if (dt.getFullYear() !== Number(y) || dt.getMonth() !== Number(mo) - 1 || dt.getDate() !== Number(d)) return null;
  return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const isoToDmy = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

export const MONTHS_TITLE = MONTHS.map((m) => m[0] + m.slice(1).toLowerCase());

// Minggu Senin-Minggu, dipotong di batas bulan. Minggu ke-1 = minggu yang memuat tanggal 1.
export function weekOfMonth(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dim = new Date(y, m, 0).getDate();
  const offsetFirst = (new Date(y, m - 1, 1).getDay() + 6) % 7; // Senin = 0
  const dowMon = (new Date(y, m - 1, d).getDay() + 6) % 7;
  const start = Math.max(1, d - dowMon);
  const end = Math.min(dim, d - dowMon + 6);
  const mk = (day: number) => `${y}-${pad2(m)}-${pad2(day)}`;
  return {
    no: Math.floor((d - 1 + offsetFirst) / 7) + 1,
    startIso: mk(start),
    endIso: mk(end),
    start,
    end,
    monthPrefix: `${y}-${pad2(m)}-`,
    year: y,
    month: m,
  };
}
