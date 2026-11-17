export type AgendaRow = {
  kegiatan: string;
  topic: string;
  date: string; // dd/mm/yyyy
  jam: string;
  link: string;
};

export const MIN_ROWS = 40;

export const emptyRow = (): AgendaRow => ({ kegiatan: "", topic: "", date: "", jam: "", link: "" });

// Data contoh. Ganti dengan API/database nanti.
export const INITIAL_ROWS: AgendaRow[] = [
  { kegiatan: "Rapat Human Resource dan Kapten: Persiapan Magang", topic: "HR", date: "07/11/2026", jam: "15:00 s.d 15:30", link: "" },
  { kegiatan: "Presentasi Akhir Magang dan PKL: Laporan Akhir", topic: "HR", date: "13/11/2026", jam: "", link: "" },
  { kegiatan: "On Boarding PKL & Internship", topic: "HR", date: "09/11/2026", jam: "", link: "" },
  { kegiatan: "Kunjungan Bimbingan Konseling BPVP Surabaya", topic: "General", date: "12/11/2026", jam: "", link: "" },
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
  return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
}
