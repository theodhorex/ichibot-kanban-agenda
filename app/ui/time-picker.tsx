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
    <div className="h-[176px] w-[52px] overflow-y-auto rounded-sm border border-line bg-surface-2 p-0.5" role="listbox" aria-label={label}>
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
          className={`block h-8 w-full rounded-sm text-center text-[13.5px] tabular-nums ${
            n === selected ? "bg-primary font-bold text-white" : "hover:bg-primary-tint"
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
    <div className="w-[268px]">
      <div className="flex justify-around">
        <div>
          <p className="mb-1.5 text-center text-[12.5px] font-semibold text-ink-2">Mulai</p>
          <div className="flex gap-1">
            <Column items={HOURS} selected={start.h} label="Jam mulai" onSelect={(h) => setStartKeepingEnd({ ...start, h })} />
            <Column items={minutes(start.m)} selected={start.m} label="Menit mulai" onSelect={(m) => setStartKeepingEnd({ ...start, m })} />
          </div>
        </div>
        <div>
          <label className="mb-1.5 flex cursor-pointer items-center justify-center gap-1.5 text-[12.5px] font-semibold text-ink-2">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 accent-primary"
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
      <p className={`mt-2.5 text-center text-[13.5px] font-bold tabular-nums ${invalid ? "text-danger" : ""}`} role={invalid ? "alert" : undefined}>
        {invalid ? "Jam selesai harus setelah jam mulai" : preview}
      </p>
      <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
        <button type="button" className="btn btn-ghost btn-danger btn-sm" onClick={onClear}>
          Hapus jam
        </button>
        <button
          type="button"
          disabled={invalid}
          onClick={() => onApply(preview)}
          className="btn btn-primary btn-sm"
        >
          Terapkan
        </button>
      </div>
    </div>
  );
}
