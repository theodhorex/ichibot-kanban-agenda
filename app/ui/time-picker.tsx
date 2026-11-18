"use client";

import { useState } from "react";
import { pad2 } from "../lib/agenda-data";

type T = { h: number; m: number };
const toMin = (t: T) => t.h * 60 + t.m;

function parse(value: string): { start: T; end: T | null } {
  const m = /^(\d{1,2}):(\d{2})(?:\s*s\.d\s*(\d{1,2}):(\d{2}))?$/i.exec(value.trim());
  if (!m) return { start: { h: 9, m: 0 }, end: null };
  return {
    start: { h: Math.min(23, +m[1]), m: Math.min(59, +m[2]) },
    end: m[3] !== undefined ? { h: Math.min(23, +m[3]), m: Math.min(59, +m[4]) } : null,
  };
}

const fmt = (t: T) => `${pad2(t.h)}:${pad2(t.m)}`;
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function Column({
  items,
  selected,
  label,
  onSelect,
}: {
  items: number[];
  selected: number;
  label: string;
  onSelect: (n: number) => void;
}) {
  return (
    <div className="h-[168px] w-12 overflow-y-auto rounded-md border border-black/10 p-0.5" role="listbox" aria-label={label}>
      {items.map((n) => (
        <button
          key={n}
          type="button"
          role="option"
          aria-selected={n === selected}
          ref={(el) => {
            if (el && n === selected) el.scrollIntoView({ block: "nearest" });
          }}
          onClick={() => onSelect(n)}
          className={`block h-7 w-full rounded text-center text-[13px] ${
            n === selected ? "bg-[#44808f] font-bold text-white" : "hover:bg-[#d9ead3]"
          }`}
        >
          {pad2(n)}
        </button>
      ))}
    </div>
  );
}

export default function TimePicker({
  value,
  onApply,
  onClear,
}: {
  value: string;
  onApply: (jam: string) => void;
  onClear: () => void;
}) {
  const init = parse(value);
  const [start, setStart] = useState<T>(init.start);
  const [end, setEnd] = useState<T | null>(init.end);

  const minutes = (cur: number) =>
    Array.from(new Set([...Array.from({ length: 12 }, (_, i) => i * 5), cur])).sort((a, b) => a - b);

  const invalid = end !== null && toMin(end) <= toMin(start);
  const preview = end ? `${fmt(start)} s.d ${fmt(end)}` : fmt(start);

  const setStartKeepingEnd = (next: T) => {
    setStart(next);
    if (end && toMin(end) <= toMin(next)) {
      const t = Math.min(23 * 60 + 55, toMin(next) + 30);
      setEnd({ h: Math.floor(t / 60), m: t % 60 });
    }
  };

  return (
    <div className="w-[252px]">
      <div className="flex justify-around">
        <div>
          <p className="mb-1 text-center text-[12px] font-semibold text-black/60">Mulai</p>
          <div className="flex gap-1">
            <Column items={HOURS} selected={start.h} label="Jam mulai" onSelect={(h) => setStartKeepingEnd({ ...start, h })} />
            <Column items={minutes(start.m)} selected={start.m} label="Menit mulai" onSelect={(m) => setStartKeepingEnd({ ...start, m })} />
          </div>
        </div>
        <div>
          <label className="mb-1 flex items-center justify-center gap-1 text-[12px] font-semibold text-black/60">
            <input
              type="checkbox"
              checked={end !== null}
              onChange={(e) => {
                if (!e.target.checked) return setEnd(null);
                const t = Math.min(23 * 60 + 55, toMin(start) + 30);
                setEnd({ h: Math.floor(t / 60), m: t % 60 });
              }}
            />
            Selesai
          </label>
          <div className={`flex gap-1 ${end ? "" : "pointer-events-none opacity-30"}`}>
            <Column items={HOURS} selected={end?.h ?? -1} label="Jam selesai" onSelect={(h) => setEnd({ h, m: end?.m ?? 0 })} />
            <Column items={minutes(end?.m ?? 0)} selected={end?.m ?? -1} label="Menit selesai" onSelect={(m) => setEnd({ h: end?.h ?? start.h, m })} />
          </div>
        </div>
      </div>
      <p className={`mt-2 text-center text-[13px] font-semibold ${invalid ? "text-red-600" : ""}`}>
        {invalid ? "Jam selesai harus setelah jam mulai" : preview}
      </p>
      <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-2">
        <button type="button" className="rounded-md px-2 py-1 text-[12px] text-red-600 hover:bg-red-50" onClick={onClear}>
          Hapus
        </button>
        <button
          type="button"
          disabled={invalid}
          onClick={() => onApply(preview)}
          className="rounded-md bg-[#44808f] px-3 py-1 text-[12px] font-semibold text-white hover:opacity-90 disabled:opacity-40"
        >
          Terapkan
        </button>
      </div>
    </div>
  );
}
