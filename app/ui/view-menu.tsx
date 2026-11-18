"use client";

import { useState } from "react";
import type { Preset } from "../lib/view-prefs";
import { DAY_W, DEFAULT_PREFS, PRESETS, type Density, type Prefs, type Zoom } from "../lib/view-prefs";

/** Gambar mini tata letak: blok kiri = kolom agenda, kotak-kotak = kalender. */
function Thumb({ kind }: { kind: Preset }) {
  const leftW = kind === "lengkap" ? 26 : 0;
  const x0 = 4 + leftW + (leftW ? 2 : 0);
  const cols = Math.floor((68 - (x0 - 4)) / 5);
  const marks = new Set(["1-3", "3-6", "5-2", "2-8"]);
  return (
    <svg viewBox="0 0 72 46" width="72" height="46" aria-hidden className="flex-none rounded border border-black/15 bg-white">
      <rect x="4" y="4" width="64" height="5" rx="1.5" fill="#d9ead3" />
      {leftW > 0 && <rect x="4" y="4" width={leftW} height="5" rx="1.5" fill="#44808f" />}
      {Array.from({ length: 6 }, (_, r) => (
        <g key={r}>
          {leftW > 0 && (
            <>
              <rect x="4" y={12 + r * 5.5} width={leftW} height="4" rx="1" fill="#44808f" opacity=".3" />
              {[8, 15, 21].map((x) => <rect key={x} x={x} y={12 + r * 5.5} width=".8" height="4" fill="#fff" />)}
            </>
          )}
          {Array.from({ length: cols }, (_, c) => (
            <rect
              key={c}
              x={x0 + c * 5}
              y={12 + r * 5.5}
              width="4"
              height="4"
              rx=".6"
              fill={marks.has(`${r}-${c}`) ? (r % 2 ? "#3d85c6" : "#e69138") : "#eceff1"}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

function Seg<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { key: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="mt-3">
      <p className="mb-1 text-[12px] font-semibold text-black/55">{label}</p>
      <div className="flex gap-1" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            aria-pressed={value === o.key}
            onClick={() => onChange(o.key)}
            className={`flex-1 rounded-md border px-2 py-1 text-[13px] ${
              value === o.key ? "border-[#44808f] bg-[#44808f] font-semibold text-white" : "border-black/15 hover:bg-black/5"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ViewMenu({ prefs, onChange }: { prefs: Prefs; onChange: (p: Prefs) => void }) {
  const [open, setOpen] = useState(false);
  const btn =
    "rounded-md border border-black/15 bg-white px-2.5 py-1 text-[13px] font-medium hover:bg-black/5 active:bg-black/10";

  return (
    <div className="relative">
      <button className={btn} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        Tampilan ▾
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            role="group"
            aria-label="Pengaturan tampilan"
            className="absolute right-0 top-full z-50 mt-1 w-[320px] rounded-xl border border-black/10 bg-white p-3 shadow-lg"
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          >
            <p className="mb-1 text-[12px] font-semibold text-black/55">Tata letak</p>
            <div className="flex flex-col gap-1">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  aria-pressed={prefs.preset === p.key}
                  onClick={() => onChange({ ...prefs, preset: p.key })}
                  className={`flex items-center gap-3 rounded-lg border px-2.5 py-2 text-left ${
                    prefs.preset === p.key ? "border-[#44808f] bg-[#44808f]/10" : "border-black/15 hover:bg-black/5"
                  }`}
                >
                  <Thumb kind={p.key} />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold">{p.label}</span>
                    <span className="block text-[12px] leading-snug text-black/55">{p.desc}</span>
                  </span>
                </button>
              ))}
            </div>
            <Seg<Density>
              label="Kepadatan baris"
              value={prefs.density}
              options={[
                { key: "rapat", label: "Rapat" },
                { key: "nyaman", label: "Nyaman" },
              ]}
              onChange={(density) => onChange({ ...prefs, density })}
            />
            <Seg<Zoom>
              label={`Lebar kolom hari (${DAY_W[prefs.zoom]}px)`}
              value={prefs.zoom}
              options={[
                { key: "kecil", label: "Kecil" },
                { key: "sedang", label: "Sedang" },
                { key: "besar", label: "Besar" },
              ]}
              onChange={(zoom) => onChange({ ...prefs, zoom })}
            />
            <button
              type="button"
              onClick={() => onChange(DEFAULT_PREFS)}
              className="mt-3 w-full rounded-md px-2 py-1 text-[12px] text-black/55 hover:bg-black/5"
            >
              Atur ulang tampilan
            </button>
          </div>
        </>
      )}
    </div>
  );
}
