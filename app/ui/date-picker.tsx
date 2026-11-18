"use client";

import { useState } from "react";
import { MONTHS_TITLE, dmyToIso, isoToDmy, pad2 } from "../lib/agenda-data";
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from "./icons";

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

  return (
    <div className="w-[276px]">
      <div className="mb-2 flex items-center gap-0.5">
        <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => shift(-12)} aria-label="Tahun sebelumnya">
          <IconChevronsLeft />
        </button>
        <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => shift(-1)} aria-label="Bulan sebelumnya">
          <IconChevronLeft />
        </button>
        <span className="flex-1 text-center text-[14px] font-bold" aria-live="polite">
          {MONTHS_TITLE[view.m]} {view.y}
        </span>
        <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => shift(1)} aria-label="Bulan berikutnya">
          <IconChevronRight />
        </button>
        <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => shift(12)} aria-label="Tahun berikutnya">
          <IconChevronsRight />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center">
        {DOW.map((d, i) => (
          <span key={d} className={`py-1 text-[11.5px] font-semibold ${i >= 5 ? "text-weekend-ink" : "text-muted"}`}>
            {d}
          </span>
        ))}
        {cells.map((c) => {
          const isSel = c.iso === selected;
          const isToday = c.iso === todayIso;
          return (
            <button
              key={c.iso}
              type="button"
              onClick={() => onPick(isoToDmy(c.iso))}
              aria-label={isoToDmy(c.iso)}
              aria-pressed={isSel}
              className={`m-px h-9 rounded-sm text-[13.5px] tabular-nums ${
                isSel
                  ? "bg-primary font-bold text-white"
                  : `hover:bg-primary-tint ${c.other ? "text-faint" : c.weekend ? "text-weekend-ink" : "text-ink"} ${
                      isToday ? "font-bold shadow-[inset_0_0_0_2px_var(--color-today)]" : ""
                    }`
              }`}
            >
              {c.day}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between border-t border-line pt-2">
        <button type="button" className="btn btn-ghost btn-danger btn-sm" onClick={onClear}>
          Hapus tanggal
        </button>
        <button type="button" className="btn btn-ghost btn-sm text-primary" onClick={() => onPick(isoToDmy(todayIso))}>
          Hari ini
        </button>
      </div>
    </div>
  );
}
