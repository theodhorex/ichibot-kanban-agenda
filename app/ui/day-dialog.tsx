"use client";

import { MONTHS_TITLE, dmyToIso, isoToDmy, safeHref, weekOfMonth, type AgendaRow } from "../lib/agenda-data";
import { Modal } from "./popup";

type Item = { row: AgendaRow; iso: string };

function List({
  items,
  colorOf,
  highlight,
  onEdit,
}: {
  items: Item[];
  colorOf: (t: string) => string;
  highlight?: string;
  onEdit: (id: string) => void;
}) {
  if (!items.length) return <p className="rounded-lg bg-black/[.03] px-3 py-3 text-[13px] text-black/50">Tidak ada agenda.</p>;
  return (
    <ul className="flex flex-col gap-2">
      {items.map(({ row: r, iso }, i) => (
        <li
          key={i}
          className={`rounded-lg border px-3 py-2 ${iso === highlight ? "border-[#44808f] bg-[#44808f]/5" : "border-black/10"}`}
        >
          <div className="flex items-start gap-2">
            <span className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full" style={{ background: colorOf(r.topic.trim()) }} />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold leading-snug">{r.kegiatan || "(tanpa nama kegiatan)"}</p>
              <p className="mt-0.5 text-[12px] text-black/60">
                {isoToDmy(iso)}
                {r.jam ? ` · ${r.jam}` : ""}
                {r.topic ? ` · ${r.topic}` : ""}
              </p>
              {r.lampiran.length > 0 && (
                <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[12px]">
                  {r.lampiran.map((a, k) => {
                    const href = safeHref(a.url);
                    return href ? (
                      <a key={k} href={href} target="_blank" rel="noopener noreferrer" className="text-[#1a6aa8] underline">
                        {a.type}
                      </a>
                    ) : (
                      <span key={k} className="text-black/50">{a.type}</span>
                    );
                  })}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onEdit(r.id)}
              className="flex-none rounded-md border border-black/15 px-2 py-0.5 text-[12px] hover:bg-black/5"
            >
              Ubah
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function DayDialog({
  iso,
  rows,
  colorOf,
  onClose,
  onEdit,
  onAdd,
}: {
  iso: string;
  rows: AgendaRow[];
  colorOf: (t: string) => string;
  onClose: () => void;
  onEdit: (id: string) => void;
  onAdd: (iso: string) => void;
}) {
  const w = weekOfMonth(iso);
  const monthName = `${MONTHS_TITLE[w.month - 1]} ${w.year}`;

  const dated: Item[] = rows
    .map((row) => ({ row, iso: dmyToIso(row.date) ?? "" }))
    .filter((x) => x.iso.startsWith(w.monthPrefix))
    .sort((a, b) => a.iso.localeCompare(b.iso) || a.row.jam.localeCompare(b.row.jam));
  const week = dated.filter((x) => x.iso >= w.startIso && x.iso <= w.endIso);

  return (
    <Modal title={`Agenda ${monthName}`} onClose={onClose} width={620}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <h3 className="mb-2 flex items-baseline justify-between text-[14px] font-bold">
          <span>
            Minggu ke-{w.no}
            <span className="ml-2 text-[12px] font-normal text-black/55">
              {w.start}–{w.end} {MONTHS_TITLE[w.month - 1]}
            </span>
          </span>
          <span className="text-[12px] font-normal text-black/50">{week.length} agenda</span>
        </h3>
        <List items={week} colorOf={colorOf} highlight={iso} onEdit={onEdit} />

        <h3 className="mb-2 mt-5 flex items-baseline justify-between text-[14px] font-bold">
          <span>Seluruh bulan {monthName}</span>
          <span className="text-[12px] font-normal text-black/50">{dated.length} agenda</span>
        </h3>
        <List items={dated} colorOf={colorOf} highlight={iso} onEdit={onEdit} />
      </div>
      <div className="flex items-center justify-between border-t border-black/10 px-5 py-3">
        <span className="text-[12px] text-black/50">Tanggal dipilih: {isoToDmy(iso)}</span>
        <button
          type="button"
          onClick={() => onAdd(iso)}
          className="rounded-md bg-[#44808f] px-3 py-1.5 text-[13px] font-semibold text-white hover:opacity-90"
        >
          + Tambah agenda tanggal ini
        </button>
      </div>
    </Modal>
  );
}
