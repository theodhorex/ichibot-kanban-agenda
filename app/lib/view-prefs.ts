export type Preset = "lengkap" | "kalender";
export type Density = "rapat" | "nyaman";
export type Zoom = "kecil" | "sedang" | "besar";
export type Prefs = { preset: Preset; density: Density; zoom: Zoom };

export const DEFAULT_PREFS: Prefs = { preset: "lengkap", density: "nyaman", zoom: "sedang" };
export const PREFS_KEY = "ichibot-layout-v1";

export const ROW_H: Record<Density, number> = { rapat: 28, nyaman: 38 };
export const DAY_W: Record<Zoom, number> = { kecil: 20, sedang: 28, besar: 38 };

export type ColKey = "no" | "kegiatan" | "topic" | "date" | "jam" | "link";
export const COL_W: Record<ColKey, number> = { no: 56, kegiatan: 300, topic: 140, date: 124, jam: 150, link: 132 };
export const COL_LABEL: Record<ColKey, string> = {
  no: "No",
  kegiatan: "Kegiatan",
  topic: "Topik",
  date: "Tanggal",
  jam: "Jam",
  link: "Lampiran",
};

/** Tinggi tiga baris header kalender (bulan 28 + hari 18 + tanggal 26). */
export const HEAD_H = 72;

export const PRESET_COLS: Record<Preset, ColKey[]> = {
  lengkap: ["no", "kegiatan", "topic", "date", "jam", "link"],
  kalender: [],
};

export const PRESETS: { key: Preset; label: string; desc: string }[] = [
  { key: "lengkap", label: "Lengkap", desc: "Semua kolom agenda + kalender" },
  { key: "kalender", label: "Kalender penuh", desc: "Agenda disembunyikan, kalender saja" },
];

export function leftOffsets(cols: ColKey[]) {
  let x = 0;
  const lefts = cols.map((c) => {
    const l = x;
    x += COL_W[c];
    return l;
  });
  return { lefts, total: x };
}

export function parsePrefs(raw: unknown): Prefs {
  const r = (raw ?? {}) as Partial<Prefs>;
  return {
    preset: r.preset && r.preset in PRESET_COLS ? r.preset : DEFAULT_PREFS.preset,
    density: r.density && r.density in ROW_H ? r.density : DEFAULT_PREFS.density,
    zoom: r.zoom && r.zoom in DAY_W ? r.zoom : DEFAULT_PREFS.zoom,
  };
}
