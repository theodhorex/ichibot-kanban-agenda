"use client";

import { useState } from "react";
import { MONTHS_TITLE, dmyToIso, isoToDmy, weekOfMonth, type AgendaRow } from "../lib/agenda-data";
import { AgendaDetail } from "./agenda-detail";
import { IconArrowLeft, IconChevronRight, IconPaperclip, IconPencil, IconPlus } from "./icons";
import { Modal } from "./popup";

type Item = { row: AgendaRow; iso: string };

function Group({
  title,
  sub,
  count,
  items,
  colorOf,
  highlight,
  onOpen,
  onEdit,
}: {
  title: string;
  sub?: string;
  count: number;
  items: Item[];
  colorOf: (t: string) => string;
  highlight: string;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  return (
    <section className="mb-6 last:mb-0">
      <h3 className="mb-2 flex items-baseline gap-2 text-[14px] font-bold">
        {title}
        {sub && <span className="text-[12.5px] font-medium text-muted">{sub}</span>}
        <span className="ml-auto text-[12.5px] font-medium text-muted">{count} agenda</span>
      </h3>
      {items.length === 0 ? (
        <p className="rounded-md bg-surface-2 px-3 py-3 text-[13px] text-muted">Tidak ada agenda.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {items.map(({ row: r, iso }) => (
            <li
              key={r.id}
              className={`group flex items-stretch rounded-md border ${
                iso === highlight ? "border-primary bg-primary-tint/50" : "border-line"
              }`}
            >
              <button
                type="button"
                onClick={() => onOpen(r.id)}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-l-md px-3 py-2.5 text-left hover:bg-surface-2"
                aria-label={`Lihat detail: ${r.kegiatan || "tanpa nama"}`}
              >
                <i className="block h-2.5 w-2.5 flex-none rounded-full" style={{ background: colorOf(r.topic.trim()) }} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold">{r.kegiatan || "(tanpa nama kegiatan)"}</span>
                  <span className="block truncate text-[12.5px] text-muted">
                    {isoToDmy(iso)}
                    {r.jam ? `, ${r.jam}` : ""}
                    {r.topic ? `, ${r.topic}` : ""}
                  </span>
                </span>
                {r.lampiran.length > 0 && (
                  <span className="inline-flex flex-none items-center gap-1 text-[12.5px] font-semibold text-primary-ink">
                    <IconPaperclip size={14} />
                    {r.lampiran.length}
                  </span>
                )}
                <IconChevronRight className="flex-none text-faint group-hover:text-ink-2" />
              </button>
              <button
                type="button"
                onClick={() => onEdit(r.id)}
                className="flex flex-none items-center gap-1.5 rounded-r-md border-l border-line px-3 text-[13px] font-semibold text-ink-2 hover:bg-surface-3"
                aria-label={`Ubah: ${r.kegiatan || "tanpa nama"}`}
              >
                <IconPencil size={14} />
                <span className="hidden sm:inline">Ubah</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
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
  const [openId, setOpenId] = useState<string | null>(null);
  const w = weekOfMonth(iso);
  const monthName = `${MONTHS_TITLE[w.month - 1]} ${w.year}`;

  const dated: Item[] = rows
    .map((row) => ({ row, iso: dmyToIso(row.date) ?? "" }))
    .filter((x) => x.iso.startsWith(w.monthPrefix))
    .sort((a, b) => a.iso.localeCompare(b.iso) || a.row.jam.localeCompare(b.row.jam));
  const week = dated.filter((x) => x.iso >= w.startIso && x.iso <= w.endIso);
  const opened = openId ? rows.find((r) => r.id === openId) : undefined;

  if (opened) {
    return (
      <Modal
        title="Detail agenda"
        onClose={onClose}
        width={560}
        leading={
          <button type="button" className="btn btn-ghost btn-icon btn-sm -ml-1" onClick={() => setOpenId(null)} aria-label={`Kembali ke daftar agenda ${monthName}`}>
            <IconArrowLeft />
          </button>
        }
      >
        <AgendaDetail row={opened} color={colorOf(opened.topic.trim())} onEdit={() => onEdit(opened.id)} />
      </Modal>
    );
  }

  return (
    <Modal title={`Agenda ${monthName}`} onClose={onClose} width={620}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <Group
          title={`Minggu ke-${w.no}`}
          sub={`${w.start}–${w.end} ${MONTHS_TITLE[w.month - 1]}`}
          count={week.length}
          items={week}
          colorOf={colorOf}
          highlight={iso}
          onOpen={setOpenId}
          onEdit={onEdit}
        />
        <Group
          title={`Seluruh bulan ${monthName}`}
          count={dated.length}
          items={dated}
          colorOf={colorOf}
          highlight={iso}
          onOpen={setOpenId}
          onEdit={onEdit}
        />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
        <span className="text-[12.5px] text-muted">Tanggal dipilih: {isoToDmy(iso)}</span>
        <button type="button" onClick={() => onAdd(iso)} className="btn btn-primary">
          <IconPlus size={15} /> Tambah agenda tanggal ini
        </button>
      </div>
    </Modal>
  );
}
