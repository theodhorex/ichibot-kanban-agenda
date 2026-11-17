"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_TOPIC_COLOR,
  INITIAL_ROWS,
  MIN_ROWS,
  TOPIC_COLORS,
  buildYear,
  dmyToIso,
  emptyRow,
  type AgendaRow,
} from "../lib/agenda-data";

// lebar kolom kiri (px); dipakai juga untuk offset sticky
const W = { no: 52, kegiatan: 290, topic: 132, date: 134, jam: 133, link: 150 };
const L = {
  no: 0,
  kegiatan: W.no,
  topic: W.no + W.kegiatan,
  date: W.no + W.kegiatan + W.topic,
  jam: W.no + W.kegiatan + W.topic + W.date,
  link: W.no + W.kegiatan + W.topic + W.date + W.jam,
};
const LEFT_TOTAL = L.link + W.link;
const DAY_W = 23;

const TEAL = "#44808f";
const LAV = "#d9d2e9";
const GREEN = "#d9ead3";
const PINK = "#f4cccc";
const GRID = "#d0d0d0";
const BLACK = "#000";

const rowNoColors = ["#dbe5f1", "#fff2cc", "#e2efda"];

const stickyCell = (left: number, w: number, bg: string): React.CSSProperties => ({
  position: "sticky",
  left,
  width: w,
  minWidth: w,
  maxWidth: w,
  background: bg,
  zIndex: 2,
});

export default function Agenda() {
  const [year, setYear] = useState(2026);
  const [rows, setRows] = useState<AgendaRow[]>(() => [
    ...INITIAL_ROWS,
    ...Array.from({ length: MIN_ROWS - INITIAL_ROWS.length }, emptyRow),
  ]);
  const scroller = useRef<HTMLDivElement>(null);

  const months = useMemo(() => buildYear(year), [year]);

  const marks = useMemo(() => {
    // iso -> baris -> warna
    const m = new Map<string, string>();
    rows.forEach((r, i) => {
      const iso = dmyToIso(r.date);
      if (iso) m.set(`${i}|${iso}`, TOPIC_COLORS[r.topic] ?? DEFAULT_TOPIC_COLOR);
    });
    return m;
  }, [rows]);

  // Saat dibuka, gulirkan timeline ke bulan berjalan.
  useEffect(() => {
    const now = new Date();
    const iso = `${year}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const cell = scroller.current?.querySelector<HTMLElement>(`[data-iso="${iso}"]`);
    if (cell && scroller.current) scroller.current.scrollLeft = cell.offsetLeft - LEFT_TOTAL - 8;
  }, [year]);

  const update = (i: number, patch: Partial<AgendaRow>) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const input =
    "h-full w-full bg-transparent px-1 text-[13px] outline-none focus:bg-yellow-50";

  const head = "border-r border-b border-black/40 text-center font-bold text-white";

  return (
    <div ref={scroller} className="h-screen overflow-auto bg-white text-black">
      <table
        className="border-separate border-spacing-0 text-[13px]"
        style={{ tableLayout: "fixed", width: LEFT_TOTAL + 365 * DAY_W + 50 }}
      >
        <colgroup>
          {Object.values(W).map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
          {months.flatMap((m) => m.days.map((d) => <col key={d.iso} style={{ width: DAY_W }} />))}
        </colgroup>

        <thead>
          {/* Baris 1: judul + bulan */}
          <tr style={{ height: 21 }}>
            <th rowSpan={3} className={head} style={{ ...stickyCell(L.no, W.no, TEAL), top: 0, zIndex: 5 }}>
              NO
            </th>
            <th
              rowSpan={3}
              colSpan={2}
              className={head}
              style={{ ...stickyCell(L.kegiatan, W.kegiatan + W.topic, TEAL), top: 0, zIndex: 5 }}
            >
              <span className="inline-flex items-center gap-3 tracking-wide">
                <button onClick={() => setYear(year - 1)} aria-label="Tahun sebelumnya" className="px-1 opacity-80 hover:opacity-100">
                  ‹
                </button>
                ANNUAL AGENDA {year}
                <button onClick={() => setYear(year + 1)} aria-label="Tahun berikutnya" className="px-1 opacity-80 hover:opacity-100">
                  ›
                </button>
              </span>
            </th>
            <th
              rowSpan={3}
              colSpan={2}
              className={head}
              style={{ ...stickyCell(L.date, W.date + W.jam, TEAL), top: 0, zIndex: 5 }}
            />
            <th
              rowSpan={3}
              className="border-b border-r-2 border-b-black/40 border-r-black bg-[#ff6a00] px-1 text-center text-[13px] font-bold leading-[1.15] text-black"
              style={{ ...stickyCell(L.link, W.link, "#ff6a00"), top: 0, zIndex: 5 }}
            >
              Lampiran (Undangan, Link Meeting, Surat Tugas, dst)
            </th>
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
          {/* Baris 2: huruf hari */}
          <tr style={{ height: 21 }}>
            {months.flatMap((m) =>
              m.days.map((d) => (
                <th
                  key={d.iso}
                  className="sticky z-[3] border-b border-r text-[12px] font-normal"
                  style={{
                    top: 21,
                    background: d.weekend ? PINK : "#fff",
                    borderColor: GRID,
                    borderLeft: d.first ? `2px solid ${BLACK}` : undefined,
                  }}
                >
                  {d.letter}
                </th>
              )),
            )}
          </tr>
          {/* Baris 3: tanggal */}
          <tr style={{ height: 21 }}>
            {months.flatMap((m) =>
              m.days.map((d) => (
                <th
                  key={d.iso}
                  data-iso={d.iso}
                  className="sticky z-[3] border-b border-r text-[12px] font-normal"
                  style={{
                    top: 42,
                    background: d.weekend ? PINK : "#fff",
                    borderColor: GRID,
                    borderBottomColor: BLACK,
                    borderLeft: d.first ? `2px solid ${BLACK}` : undefined,
                  }}
                >
                  {d.day}
                </th>
              )),
            )}
          </tr>
          {/* Baris label kolom */}
          <tr style={{ height: 21 }}>
            {[
              ["A", L.no, W.no, "center"],
              ["KEGIATAN", L.kegiatan, W.kegiatan, "left"],
              ["Topics", L.topic, W.topic, "left"],
              ["DATE", L.date, W.date, "left"],
              ["JAM", L.jam, W.jam, "left"],
              ["LINK", L.link, W.link, "left"],
            ].map(([label, left, w, align]) => (
              <th
                key={label as string}
                className="border-b-2 border-r border-b-black border-r-black/50 px-0.5 font-bold"
                style={{
                  ...stickyCell(left as number, w as number, LAV),
                  top: 63,
                  zIndex: 5,
                  textAlign: align as "left" | "center",
                  borderRightWidth: label === "LINK" ? 2 : 1,
                  borderRightColor: label === "LINK" ? BLACK : undefined,
                }}
              >
                {label}
              </th>
            ))}
            {months.flatMap((m) =>
              m.days.map((d) => (
                <th
                  key={d.iso}
                  className="sticky z-[3] border-b-2 border-r"
                  style={{
                    top: 63,
                    background: LAV,
                    borderColor: GRID,
                    borderBottomColor: BLACK,
                    borderLeft: d.first ? `2px solid ${BLACK}` : undefined,
                  }}
                />
              )),
            )}
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ height: 21 }}>
              <td
                className="border-b border-r text-center font-semibold"
                style={{
                  ...stickyCell(L.no, W.no, rowNoColors[Math.floor(i / 6) % 3]),
                  borderColor: BLACK + "66",
                }}
              >
                {i + 1}
              </td>
              {(
                [
                  ["kegiatan", L.kegiatan, W.kegiatan],
                  ["topic", L.topic, W.topic],
                  ["date", L.date, W.date],
                  ["jam", L.jam, W.jam],
                  ["link", L.link, W.link],
                ] as const
              ).map(([key, left, w]) => (
                <td
                  key={key}
                  className="border-b border-r p-0"
                  style={{
                    ...stickyCell(left, w, "#fff"),
                    borderColor: GRID,
                    borderRightColor: key === "link" ? BLACK : "#9a9a9a",
                    borderRightWidth: key === "link" ? 2 : 1,
                    textAlign: key === "date" || key === "jam" ? "center" : "left",
                  }}
                >
                  <input
                    className={input}
                    style={{ textAlign: key === "date" || key === "jam" ? "center" : "left" }}
                    value={r[key]}
                    onChange={(e) => update(i, { [key]: e.target.value })}
                  />
                </td>
              ))}
              {months.flatMap((m) =>
                m.days.map((d) => {
                  const color = marks.get(`${i}|${d.iso}`);
                  return (
                    <td
                      key={d.iso}
                      title={color ? `${r.kegiatan} (${r.date})` : undefined}
                      className="border-b border-r"
                      style={{
                        background: color ?? (d.weekend ? "#fdf1f1" : "#fff"),
                        borderColor: GRID,
                        borderLeft: d.first ? `2px solid ${BLACK}` : undefined,
                      }}
                    />
                  );
                }),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
