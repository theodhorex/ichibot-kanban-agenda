"use client";

import { DAY_W, DEFAULT_PREFS, PRESETS, type Density, type Preset, type Prefs, type Zoom } from "../lib/view-prefs";
import { IconSliders } from "./icons";
import { Dropdown } from "./menu";

/** Gambar mini tata letak: blok kiri = kolom agenda, kotak-kotak = kalender. */
function Thumb({ kind }: { kind: Preset }) {
  const leftW = kind === "lengkap" ? 26 : 0;
  const x0 = 4 + leftW + (leftW ? 2 : 0);
  const cols = Math.floor((68 - (x0 - 4)) / 5);
  const marks = new Set(["1-3", "3-6", "5-2", "2-8"]);
  return (
    <svg viewBox="0 0 72 46" width="72" height="46" aria-hidden className="flex-none rounded-sm border border-line-strong bg-surface">
      <rect x="4" y="4" width="64" height="5" rx="1.5" fill="#e4ece9" />
      {leftW > 0 && <rect x="4" y="4" width={leftW} height="5" rx="1.5" fill="#0b6e75" />}
      {Array.from({ length: 6 }, (_, r) => (
        <g key={r}>
          {leftW > 0 && <rect x="4" y={12 + r * 5.5} width={leftW} height="4" rx="1" fill="#0b6e75" opacity=".22" />}
          {Array.from({ length: cols }, (_, c) => (
            <rect
              key={c}
              x={x0 + c * 5}
              y={12 + r * 5.5}
              width="4"
              height="4"
              rx=".8"
              fill={marks.has(`${r}-${c}`) ? (r % 2 ? "#0072b2" : "#e69f00") : "#edf1ef"}
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
      <p className="mb-1.5 text-[12.5px] font-semibold text-ink-2">{label}</p>
      <div className="flex gap-1" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            aria-pressed={value === o.key}
            onClick={() => onChange(o.key)}
            className="btn btn-sm flex-1"
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ViewMenu({ prefs, onChange }: { prefs: Prefs; onChange: (p: Prefs) => void }) {
  return (
    <Dropdown label="Tampilan" icon={<IconSliders />} width={330}>
      {() => (
        <div className="p-1.5" role="group" aria-label="Pengaturan tampilan">
          <p className="mb-1.5 text-[12.5px] font-semibold text-ink-2">Tata letak</p>
          <div className="flex flex-col gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                type="button"
                aria-pressed={prefs.preset === p.key}
                onClick={() => onChange({ ...prefs, preset: p.key })}
                className={`flex items-center gap-3 rounded-md border px-2.5 py-2 text-left ${
                  prefs.preset === p.key ? "border-primary bg-primary-tint" : "border-line-strong hover:bg-surface-3"
                }`}
              >
                <Thumb kind={p.key} />
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-semibold">{p.label}</span>
                  <span className="block text-[12.5px] leading-snug text-muted">{p.desc}</span>
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
          <button type="button" onClick={() => onChange(DEFAULT_PREFS)} className="btn btn-ghost btn-sm mt-3 w-full text-muted">
            Atur ulang tampilan
          </button>
        </div>
      )}
    </Dropdown>
  );
}
