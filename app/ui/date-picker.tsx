"use client";

import { useState } from "react";
import { MONTHS_TITLE, dmyToIso, isoToDmy, pad2 } from "../lib/agenda-data";

const DOW = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export default function DatePicker({
  value,
  onPick,
  onClear,
}: {
  value: string; // dd/mm/yyyy
  onPick: (dmy: string) => void;
  onClear: () => void;
}) {
  const selected = dmyToIso(value);
  const [view, setView] = useState(() => {
    const base = selected ? new Date(`${selected}T00:00:00`) : new Date();
    return { y: base.getFullYear(), m: base.getMonth() };
  });
  const [todayIso] = useState(() => {
    const n = new Date();
    return `${n.getFullYear()}-${pad2(n.getMonth() + 1)}-${pad2(n.getDate())}`;
  });

  const shift = (delta: number) =>
    setView(({ y, m }) => {
      const d = new Date(y, m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  const lead = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(view.y, view.m, 1 - lead + i);
    return {
      iso: `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`,
      day: d.getDate(),
      other: d.getMonth() !== view.m,
      weekend: d.getDay() === 0 || d.getDay() === 6,
    };
  });

  const nav = "flex h-7 w-7 items-center justify-center rounded-md text-[16px] hover:bg-black/5";

  return (
    <div className="w-[252px]">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" className={nav} onClick={() => shift(-12)} aria-label="Tahun sebelumnya">«</button>
        <button type="button" className={nav} onClick={() => shift(-1)} aria-label="Bulan sebelumnya">‹</button>
        <span className="flex-1 text-center text-[14px] font-bold">
          {MONTHS_TITLE[view.m]} {view.y}
        </span>
        <button type="button" className={nav} onClick={() => shift(1)} aria-label="Bulan berikutnya">›</button>
        <button type="button" className={nav} onClick={() => shift(12)} aria-label="Tahun berikutnya">»</button>
      </div>
      <div className="grid grid-cols-7 text-center">
        {DOW.map((d, i) => (
          <span key={d} className={`py-1 text-[11px] font-semibold ${i >= 5 ? "text-red-500" : "text-black/50"}`}>
            {d}
          </span>
        ))}
        {cells.map((c) => {
          const isSel = c.iso === selected;
          return (
            <button
              key={c.iso}
              type="button"
              onClick={() => onPick(isoToDmy(c.iso))}
              aria-label={isoToDmy(c.iso)}
              aria-pressed={isSel}
              className={`m-px h-8 rounded-md text-[13px] ${
                isSel
                  ? "bg-[#44808f] font-bold text-white"
                  : `hover:bg-[#d9ead3] ${c.other ? "text-black/30" : c.weekend ? "text-red-500" : ""} ${
                      c.iso === todayIso ? "ring-1 ring-[#44808f]" : ""
                    }`
              }`}
            >
              {c.day}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between border-t border-black/10 pt-2">
        <button
          type="button"
          className="rounded-md px-2 py-1 text-[12px] text-red-600 hover:bg-red-50"
          onClick={onClear}
        >
          Hapus
        </button>
        <button
          type="button"
          className="rounded-md px-2 py-1 text-[12px] font-medium text-[#44808f] hover:bg-black/5"
          onClick={() => onPick(isoToDmy(todayIso))}
        >
          Hari ini
        </button>
      </div>
    </div>
  );
}
