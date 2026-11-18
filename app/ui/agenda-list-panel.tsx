"use client";

import { useMemo, useState } from "react";
import { MONTHS_TITLE, dmyToIso, type AgendaRow } from "../lib/agenda-data";
import { IconClose, IconPaperclip, IconPlus, IconSearch } from "./icons";

/** Daftar seluruh agenda, dipakai saat layout "Kalender penuh" menyembunyikan kolom agenda. Klik = lihat detail. */
export default function AgendaListPanel({
  rows,
  colorOf,
  onPick,
  onAdd,
  onClose,
}: {
  rows: AgendaRow[]; // sudah terurut
  colorOf: (t: string) => string;
  onPick: (id: string) => void;
  onAdd: () => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const groups = useMemo(() => {
    const out: { key: string; title: string; items: AgendaRow[] }[] = [];
    for (const r of rows) {
      if (needle && ![r.kegiatan, r.topic, r.date].some((v) => v.toLowerCase().includes(needle))) continue;
      const iso = dmyToIso(r.date);
      const key = iso ? iso.slice(0, 7) : "none";
      let g = out.find((x) => x.key === key);
      if (!g) {
        g = { key, title: iso ? `${MONTHS_TITLE[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}` : "Tanpa tanggal", items: [] };
        out.push(g);
      }
      g.items.push(r);
    }
    return out;
  }, [rows, needle]);
  const shown = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <aside
      aria-label="Daftar agenda"
      className="drawer-in absolute bottom-0 right-0 top-0 z-[20] flex w-[400px] max-w-full flex-col border-l border-line bg-surface shadow-float"
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <h2 className="flex-1 text-[17px] font-bold">
          Daftar agenda <span className="font-medium text-muted">({rows.length})</span>
        </h2>
        <button type="button" onClick={onAdd} className="btn btn-primary btn-sm">
          <IconPlus size={14} /> Tambah
        </button>
        <button type="button" onClick={onClose} aria-label="Tutup daftar agenda" className="btn btn-ghost btn-icon btn-sm">
          <IconClose />
        </button>
      </div>
      <div className="border-b border-line px-4 py-2.5">
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari kegiatan, topik, tanggal"
            aria-label="Cari di daftar agenda"
            className="field pl-8"
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {shown === 0 ? (
          <p role="status" className="px-3 py-10 text-center text-[13.5px] text-muted">
            {rows.length === 0 ? "Belum ada agenda. Pilih Tambah untuk membuat yang pertama." : "Tidak ada agenda yang cocok dengan pencarian."}
          </p>
        ) : (
          groups.map((g) => (
            <section key={g.key} className="mb-3">
              <h3 className="sticky top-0 z-[1] bg-surface px-2 py-1.5 text-[12.5px] font-bold text-ink-2">
                {g.title} <span className="font-medium text-muted">({g.items.length})</span>
              </h3>
              <ul>
                {g.items.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => onPick(r.id)}
                      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-surface-3"
                    >
                      <i className="block h-2.5 w-2.5 flex-none rounded-full" style={{ background: colorOf(r.topic.trim()) }} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold">{r.kegiatan || "(tanpa nama kegiatan)"}</span>
                        <span className="block truncate text-[12.5px] text-muted">
                          {r.date || "Tanpa tanggal"}
                          {r.jam ? `, ${r.jam}` : ""}
                          {r.topic ? `, ${r.topic}` : ""}
                        </span>
                      </span>
                      {r.lampiran.length > 0 && (
                        <span className="inline-flex flex-none items-center gap-1 text-[12.5px] font-semibold text-primary-ink">
                          <IconPaperclip size={14} />
                          {r.lampiran.length}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </aside>
  );
}
