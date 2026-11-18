export type Preset = "lengkap" | "kalender";
export type Density = "rapat" | "nyaman";
export type Zoom = "kecil" | "sedang" | "besar";
export type Prefs = { preset: Preset; density: Density; zoom: Zoom };

export const DEFAULT_PREFS: Prefs = { preset: "lengkap", density: "rapat", zoom: "sedang" };
export const PREFS_KEY = "ichibot-layout-v1";

export const ROW_H: Record<Density, number> = { rapat: 21, nyaman: 30 };
export const DAY_W: Record<Zoom, number> = { kecil: 16, sedang: 23, besar: 34 };

export type ColKey = "no" | "kegiatan" | "topic" | "date" | "jam" | "link";
export const COL_W: Record<ColKey, number> = { no: 52, kegiatan: 290, topic: 132, date: 134, jam: 133, link: 150 };
export const COL_LABEL: Record<ColKey, string> = {
  no: "A",
  kegiatan: "KEGIATAN",
  topic: "Topics",
  date: "DATE",
  jam: "JAM",
  link: "LAMPIRAN",
};

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
