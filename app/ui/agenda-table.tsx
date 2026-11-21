"use client";

import { memo, useRef, useState, type CSSProperties } from "react";
import { MONTHS_TITLE, type AgendaRow, type Day } from "../lib/agenda-data";
import { COL_LABEL, COL_W, type ColKey } from "../lib/view-prefs";
import { IconExpand, IconPaperclip, IconTrash } from "./icons";

export type Month = { name: string; days: Day[] };

const stickyLeft = (left: number, w: number): CSSProperties => ({
  position: "sticky",
  left,
  width: w,
  minWidth: w,
  maxWidth: w,
});

/* ---------- Kolom + header: dirender sekali per (tahun, layout, zoom, hari ini) ---------- */
export const TableHead = memo(function TableHead({
  months,
  cols,
  lefts,
  leftTotal,
  dayW,
  todayIso,
}: {
  months: Month[];
  cols: ColKey[];
  lefts: number[];
  leftTotal: number;
  dayW: number;
  todayIso: string;
}) {
  return (
    <>
      <colgroup>
        {cols.map((c) => (
          <col key={c} style={{ width: COL_W[c] }} />
        ))}
        {months.flatMap((m) => m.days.map((d) => <col key={d.iso} style={{ width: dayW }} />))}
      </colgroup>
      <thead>
        <tr>
          {cols.map((c, i) => (
            <th
              key={c}
              rowSpan={3}
              className={`lh ${i === cols.length - 1 ? "edge" : ""}`}
              style={{ ...stickyLeft(lefts[i], COL_W[c]), textAlign: c === "no" ? "center" : "left", paddingLeft: c === "no" ? 0 : 8 }}
            >
              {COL_LABEL[c]}
            </th>
          ))}
          {months.map((m, mi) => (
            <th key={m.name} colSpan={m.days.length} className={`mh ${mi % 2 ? "alt" : ""}`}>
              <span className="mh-label" style={{ left: leftTotal + 10 }}>
                {MONTHS_TITLE[mi]}
              </span>
            </th>
          ))}
        </tr>
        <tr>
          {months.flatMap((m) =>
            m.days.map((d) => (
              <th key={d.iso} scope="col" className={`wh ${d.weekend ? "we" : ""} ${d.first ? "first" : ""}`}>
                {d.letter}
              </th>
            )),
          )}
        </tr>
        <tr>
          {months.flatMap((m) =>
            m.days.map((d) => (
              <th
                key={d.iso}
                data-iso={d.iso}
                data-head="1"
                title="Lihat agenda minggu dan bulan ini"
                className={`dh ${d.weekend ? "we" : ""} ${d.first ? "first" : ""}`}
              >
                {d.iso === todayIso ? <span className="tb">{d.day}</span> : d.day}
              </th>
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
/** Satu tanda di kalender. Satu baris bisa memuat beberapa tanda (satu per bulan). */
export type Mark = { iso: string; id: string; color: string; title: string; dim: boolean };

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
      className="cellin"
    />
  );
}

/* ---------- Baris: hanya dirender ulang bila datanya sendiri berubah ---------- */
function leftCell(
  c: ColKey,
  r: AgendaRow | null,
  idx: number,
  color: string,
  confirming: boolean,
  hint: boolean,
  onField: FieldHandler,
) {
  switch (c) {
    case "no":
      if (confirming)
        return (
          <button type="button" data-del="1" className="del-confirm" aria-label={`Konfirmasi hapus agenda ${idx + 1}`}>
            Hapus?
          </button>
        );
      return (
        <div className="no-wrap">
          <span className="no-n">{r ? idx + 1 : ""}</span>
          {r && (
            <span className="rowact">
              <button type="button" data-detail="1" aria-label={`Lihat detail agenda ${idx + 1}`} title="Lihat detail">
                <IconExpand size={14} />
              </button>
              <button type="button" data-del="1" aria-label={`Hapus agenda ${idx + 1}`} title="Hapus">
                <IconTrash size={14} />
              </button>
            </span>
          )}
        </div>
      );
    case "kegiatan":
      return (
        <CellInput
          id={r?.id ?? null}
          field="kegiatan"
          value={r?.kegiatan ?? ""}
          onField={onField}
          placeholder={hint ? "Ketik kegiatan baru lalu tekan Enter" : undefined}
        />
      );
    case "topic":
      return (
        <div className="flex h-full items-center">
          {r?.topic ? <i className="ml-2 block h-2.5 w-2.5 flex-none rounded-full" style={{ background: color }} /> : null}
          <CellInput id={r?.id ?? null} field="topic" value={r?.topic ?? ""} onField={onField} list="topic-list" />
        </div>
      );
    case "date":
      return r ? r.date || <span className="ph">Pilih tanggal</span> : null;
    case "jam":
      return r ? r.jam || <span className="ph-h">Pilih jam</span> : null;
    case "link":
      if (!r) return null;
      return r.lampiran.length ? (
        <span className="att-chip">
          <IconPaperclip size={14} />
          {r.lampiran.length === 1 ? r.lampiran[0].type : `${r.lampiran[0].type} +${r.lampiran.length - 1}`}
        </span>
      ) : (
        <span className="ph-h">+ Lampiran</span>
      );
  }
}

export const AgendaRowView = memo(function AgendaRowView({
  row,
  idx,
  hint,
  calOnly,
  marks,
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
  hint: boolean;
  calOnly: boolean; // baris tanpa agenda di daftar: hanya tanda kalender, kolom daftar kosong
  marks: Mark[];
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
    const mk = marks.find((m) => m.iso === d.iso);
    cells.push(
      <td
        key={d.iso}
        data-iso={d.iso}
        data-m={mk?.id}
        title={mk?.title}
        className={`dc ${d.weekend ? "we" : ""} ${d.iso === todayIso ? "today" : ""} ${d.first ? "first" : ""} ${mk ? "mark" : ""}`}
        style={mk ? ({ "--mark": mk.color, opacity: mk.dim ? 0.28 : 1 } as CSSProperties) : undefined}
      />,
    );
  }
  return (
    <tr className={row || marks.length ? "" : "is-empty"} style={{ height: rowH }}>
      {cols.map((c, i) => {
        const input = c === "kegiatan" || c === "topic";
        return (
          <td
            key={c}
            data-left="1"
            data-col={calOnly ? undefined : c}
            data-r={calOnly ? undefined : row?.id}
            className={`lc ${c === "no" ? "no" : ""} ${i === cols.length - 1 ? "edge" : ""}`}
            style={{
              ...stickyLeft(lefts[i], COL_W[c]),
              ...(input ? { padding: 0 } : null),
              textAlign: c === "no" ? "center" : "left",
              opacity: dim ? 0.28 : 1,
            }}
          >
            {calOnly ? null : leftCell(c, row, idx, color, confirming, hint, onField)}
          </td>
        );
      })}
      {from > 0 && <td colSpan={from} />}
      {cells}
      {hi < days.length && <td colSpan={days.length - hi} />}
    </tr>
  );
});
