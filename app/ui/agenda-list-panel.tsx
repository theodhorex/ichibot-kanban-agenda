"use client";

import { useMemo, useState } from "react";
import { MONTHS_TITLE, dmyToIso, type AgendaRow } from "../lib/agenda-data";

/** Daftar seluruh agenda, dipakai saat layout "Kalender penuh" menyembunyikan kolom agenda. */
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
      className="drawer-in fixed right-0 top-0 z-[80] flex h-full w-[380px] max-w-full flex-col bg-white text-black shadow-[-8px_0_30px_rgba(0,0,0,.18)]"
    >
      <div className="flex items-center justify-between border-b border-black/10 px-5 py-3">
        <h2 className="text-[16px] font-bold">
          Daftar agenda <span className="text-[13px] font-normal text-black/50">({rows.length})</span>
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup daftar agenda"
          className="rounded-md px-2 text-[22px] leading-none text-black/50 hover:bg-black/5 hover:text-black"
        >
          ×
        </button>
      </div>
      <div className="flex gap-2 border-b border-black/10 px-5 py-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari di daftar…"
          aria-label="Cari di daftar agenda"
          className="min-w-0 flex-1 rounded-md border border-black/15 px-2.5 py-1 text-[13px] outline-none focus:border-black/40"
        />
        <button
          type="button"
          onClick={onAdd}
          className="rounded-md bg-[#44808f] px-3 py-1 text-[13px] font-semibold text-white hover:opacity-90"
        >
          + Tambah
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
        {shown === 0 && <p className="py-6 text-center text-[13px] text-black/50">Belum ada agenda.</p>}
        {groups.map((g) => (
          <section key={g.key} className="mb-4">
            <h3 className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-black/50">{g.title}</h3>
            <ul className="flex flex-col gap-1.5">
              {g.items.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => onPick(r.id)}
                    className="flex w-full items-start gap-2 rounded-lg border border-black/10 px-3 py-2 text-left hover:bg-black/[.03]"
                  >
                    <span className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full" style={{ background: colorOf(r.topic.trim()) }} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold leading-snug">{r.kegiatan || "(tanpa nama)"}</span>
                      <span className="block text-[12px] text-black/55">
                        {r.date || "tanpa tanggal"}
                        {r.jam ? ` · ${r.jam}` : ""}
                        {r.topic ? ` · ${r.topic}` : ""}
                        {r.lampiran.length ? ` · ${r.lampiran.length} lampiran` : ""}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  );
}
