"use client";

import { memo, useRef, useState } from "react";
import type { AgendaRow, Day } from "../lib/agenda-data";
import { COL_LABEL, COL_W, type ColKey } from "../lib/view-prefs";

const TEAL = "#44808f";
const LAV = "#d9d2e9";
const GREEN = "#d9ead3";
const BLACK = "#000";
const rowNoColors = ["#dbe5f1", "#fff2cc", "#e2efda"];

export type Month = { name: string; days: Day[] };

const stickyLeft = (left: number, w: number): React.CSSProperties => ({
  position: "sticky",
  left,
  width: w,
  minWidth: w,
  maxWidth: w,
  zIndex: 2,
});

/* ---------- Kolom + header: dirender sekali per (tahun, layout, zoom) ---------- */
export const TableHead = memo(function TableHead({
  year,
  months,
  cols,
  lefts,
  dayW,
}: {
  year: number;
  months: Month[];
  cols: ColKey[];
  lefts: number[];
  dayW: number;
}) {
  const hasLink = cols.includes("link");
  const plain = cols.filter((c) => c !== "link");
  const plainW = plain.reduce((a, c) => a + COL_W[c], 0);
  const linkLeft = lefts[cols.indexOf("link")];

  return (
    <>
      <colgroup>
        {cols.map((c) => (
          <col key={c} style={{ width: COL_W[c] }} />
        ))}
        {months.flatMap((m) => m.days.map((d) => <col key={d.iso} style={{ width: dayW }} />))}
      </colgroup>
      <thead>
        <tr style={{ height: 21 }}>
          {plain.length > 0 && (
            <th
              rowSpan={3}
              colSpan={plain.length}
              className="border-b border-r border-black/40 text-center font-bold tracking-wide text-white"
              style={{ ...stickyLeft(0, plainW), background: TEAL, top: 0, zIndex: 5 }}
            >
              ANNUAL AGENDA {year}
            </th>
          )}
          {hasLink && (
            <th
              rowSpan={3}
              className="border-b border-r-2 border-b-black/40 border-r-black bg-[#ff6a00] px-1 text-center text-[13px] font-bold leading-[1.15] text-black"
              style={{ ...stickyLeft(linkLeft, COL_W.link), top: 0, zIndex: 5, background: "#ff6a00" }}
            >
              Lampiran (Undangan, Link Meeting, Surat Tugas, dst)
            </th>
          )}
          {months.map((m) => (
            <th
              key={m.name}
              colSpan={m.days.length}
              className="sticky top-0 z-[3] border-b border-r-2 border-b-black/40 border-r-black text-center text-[13px] font-bold"
              style={{ background: GREEN, height: 21 }}
            >
              {m.name} {year}
            </th>
          ))}
        </tr>
        <tr style={{ height: 21 }}>
          {months.flatMap((m) =>
            m.days.map((d) => (
              <th
                key={d.iso}
                className={`dh ${d.weekend ? "dc-we" : ""} ${d.first ? "dc-first" : ""}`}
                style={{ top: 21 }}
              >
                {d.letter}
              </th>
            )),
          )}
        </tr>
        <tr style={{ height: 21 }}>
          {months.flatMap((m) =>
            m.days.map((d) => (
              <th
                key={d.iso}
                data-iso={d.iso}
                data-head="1"
                title="Lihat agenda minggu dan bulan ini"
                className={`dh ${d.weekend ? "dc-we" : ""} ${d.first ? "dc-first" : ""}`}
                style={{ top: 42, borderBottomColor: BLACK }}
              >
                {d.day}
              </th>
            )),
          )}
        </tr>
        <tr style={{ height: 21 }}>
          {cols.map((c, i) => (
            <th
              key={c}
              className="border-b-2 border-r border-b-black px-1 font-bold"
              style={{
                ...stickyLeft(lefts[i], COL_W[c]),
                background: LAV,
                top: 63,
                zIndex: 5,
                textAlign: c === "no" ? "center" : "left",
                borderRightColor: c === "link" ? BLACK : "rgba(0,0,0,.5)",
                borderRightWidth: c === "link" ? 2 : 1,
              }}
            >
              {COL_LABEL[c]}
            </th>
          ))}
          {months.flatMap((m) =>
            m.days.map((d) => (
              <th
                key={d.iso}
                className="sticky z-[3] border-b-2 border-r"
                style={{ top: 63, background: LAV, borderColor: "#d0d0d0", borderBottomColor: BLACK, borderLeft: d.first ? `2px solid ${BLACK}` : undefined }}
              />
            )),
          )}
        </tr>
      </thead>
    </>
  );
});

/* ---------- Sel yang bisa diketik langsung ----------
   Ketikan hidup di state lokal sel ini saja; data baru dikirim saat blur/Enter,
   jadi tabel tidak dirender ulang per ketukan. Esc membatalkan. */
export type FieldHandler = (id: string | null, field: "kegiatan" | "topic", value: string) => void;

function CellInput({
  id,
  field,
  value,
  onField,
  list,
  placeholder,
}: {
  id: string | null;
  field: "kegiatan" | "topic";
  value: string;
  onField: FieldHandler;
  list?: string;
  placeholder?: string;
}) {
  const [v, setV] = useState(value);
  const [seen, setSeen] = useState(value);
  const cancel = useRef(false);
  if (value !== seen) {
    // nilai berubah dari luar (mis. diubah lewat panel lain)
    setSeen(value);
    setV(value);
  }
  return (
    <input
      data-kid={id ?? undefined}
      data-field={field}
      list={list}
      value={v}
      placeholder={placeholder}
      aria-label={field === "kegiatan" ? "Kegiatan" : "Topik"}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => {
        const final = cancel.current ? value : v;
        if (cancel.current) {
          cancel.current = false;
          setV(value);
        }
        onField(id, field, final);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        else if (e.key === "Escape") {
          cancel.current = true;
          e.currentTarget.blur();
        }
      }}
      className="h-full w-full bg-transparent px-1 text-[13px] outline-none focus:bg-yellow-50"
    />
  );
}

/* ---------- Baris: hanya dirender ulang bila datanya sendiri berubah ---------- */
const muted = (t: string) => <span className="text-black/30">{t}</span>;

function leftCell(
  c: ColKey,
  r: AgendaRow | null,
  idx: number,
  color: string,
  confirming: boolean,
  onField: FieldHandler,
) {
  switch (c) {
    case "no":
      return (
        <>
          <span className={confirming ? "hidden" : "no-n"}>{idx + 1}</span>
          {r && (
            <button
              type="button"
              data-del="1"
              aria-label={`Hapus agenda ${idx + 1}`}
              className={confirming ? "font-bold text-red-600" : "no-del"}
            >
              {confirming ? "Yakin?" : "×"}
            </button>
          )}
        </>
      );
    case "kegiatan":
      return <CellInput id={r?.id ?? null} field="kegiatan" value={r?.kegiatan ?? ""} onField={onField} />;
    case "topic":
      return (
        <div className="flex h-full items-center">
          {r?.topic ? <span className="ml-1 h-2 w-2 flex-none rounded-full" style={{ background: color }} /> : null}
          <CellInput id={r?.id ?? null} field="topic" value={r?.topic ?? ""} onField={onField} list="topic-list" />
        </div>
      );
    case "date":
      return r ? r.date || muted("Pilih tanggal") : null;
    case "jam":
      return r ? r.jam || muted("Pilih jam") : null;
    case "link":
      if (!r) return null;
      return r.lampiran.length ? (
        <span className="font-medium text-[#1a6aa8]">
          {r.lampiran.length === 1 ? r.lampiran[0].type : `${r.lampiran[0].type} +${r.lampiran.length - 1}`}
        </span>
      ) : (
        muted("+ Lampiran")
      );
  }
}

export const AgendaRowView = memo(function AgendaRowView({
  row,
  idx,
  markIso,
  color,
  dim,
  confirming,
  cols,
  lefts,
  days,
  from,
  to,
  rowH,
  todayIso,
  onField,
}: {
  row: AgendaRow | null;
  idx: number;
  markIso: string | null;
  color: string;
  dim: boolean;
  confirming: boolean;
  cols: ColKey[];
  lefts: number[];
  days: Day[];
  from: number;
  to: number;
  rowH: number;
  todayIso: string;
  onField: FieldHandler;
}) {
  const hi = Math.min(to, days.length);
  const cells = [];
  for (let i = from; i < hi; i++) {
    const d = days[i];
    const marked = markIso === d.iso;
    cells.push(
      <td
        key={d.iso}
        data-iso={d.iso}
        data-m={marked ? row?.id : undefined}
        title={marked && row ? `${row.kegiatan}${row.jam ? ` · ${row.jam}` : ""}` : undefined}
        className={`dc ${d.weekend ? "dc-we" : ""} ${d.iso === todayIso ? "dc-today" : ""} ${d.first ? "dc-first" : ""} ${marked ? "dc-mark" : ""}`}
        style={marked ? { background: color } : undefined}
      />,
    );
  }
  return (
    <tr className={row ? "" : "is-empty"} style={{ height: rowH, opacity: dim ? 0.25 : 1 }}>
      {cols.map((c, i) => {
        const input = c === "kegiatan" || c === "topic";
        return (
          <td
            key={c}
            data-left="1"
            data-col={c}
            data-r={row?.id}
            className="lc"
            style={{
              ...stickyLeft(lefts[i], COL_W[c]),
              padding: input ? 0 : undefined,
              textAlign: c === "no" || c === "date" || c === "jam" ? "center" : "left",
              fontWeight: c === "no" ? 600 : undefined,
              fontSize: 13,
              ...(c === "no" ? { background: rowNoColors[Math.floor(idx / 6) % 3], borderRightColor: "rgba(0,0,0,.4)" } : null),
              ...(c === "link" ? { borderRightColor: BLACK, borderRightWidth: 2 } : null),
            }}
          >
            {leftCell(c, row, idx, color, confirming, onField)}
          </td>
        );
      })}
      {from > 0 && <td colSpan={from} />}
      {cells}
      {hi < days.length && <td colSpan={days.length - hi} />}
    </tr>
  );
});
