"use client";

import { useState } from "react";
import { dmyToIso, pad2, safeHref, type AgendaRow } from "../lib/agenda-data";
import { IconCalendar, IconCheck, IconClock, IconCopy, IconExternal, IconLink, IconPencil } from "./icons";
import { Modal } from "./popup";

const longFmt = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export const longDate = (iso: string) => longFmt.format(new Date(`${iso}T00:00:00`));

/** "Hari ini", "3 hari lagi", "2 hari lalu" relatif terhadap hari ini di zona waktu perangkat. */
export function relLabel(iso: string): string {
  const n = new Date();
  const today = new Date(`${n.getFullYear()}-${pad2(n.getMonth() + 1)}-${pad2(n.getDate())}T00:00:00`);
  const diff = Math.round((new Date(`${iso}T00:00:00`).getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Hari ini";
  if (diff === 1) return "Besok";
  if (diff === -1) return "Kemarin";
  return diff > 0 ? `${diff} hari lagi` : `${-diff} hari lalu`;
}

const hostOf = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
};

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-sm btn-icon btn-ghost"
      aria-label={done ? "Tersalin" : "Salin tautan"}
      title={done ? "Tersalin" : "Salin tautan"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {}
      }}
    >
      {done ? <IconCheck className="text-ok" /> : <IconCopy />}
    </button>
  );
}

/** Isi detail satu agenda: judul, waktu, topik, dan semua lampiran sebagai tautan yang bisa dibuka atau disalin. */
export function AgendaDetail({
  row,
  color,
  onEdit,
}: {
  row: AgendaRow;
  color: string;
  onEdit: () => void;
}) {
  const iso = dmyToIso(row.date);
  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {row.topic ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-[12.5px] font-semibold">
              <i className="block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
              {row.topic}
            </span>
          ) : (
            <span className="text-[12.5px] text-muted">Tanpa topik</span>
          )}
          {iso && <span className="rounded-full bg-primary-tint px-2.5 py-0.5 text-[12.5px] font-semibold text-primary-ink">{relLabel(iso)}</span>}
        </div>
        <h3 className="text-[20px] font-bold leading-snug text-balance">{row.kegiatan || "(tanpa nama kegiatan)"}</h3>

        <dl className="mt-4 grid gap-2.5 text-[14px]">
          <div className="flex items-center gap-2.5">
            <dt className="sr-only">Tanggal</dt>
            <IconCalendar className="text-muted" />
            <dd>{iso ? longDate(iso) : <span className="text-muted">Tanggal belum diisi</span>}</dd>
          </div>
          <div className="flex items-center gap-2.5">
            <dt className="sr-only">Jam</dt>
            <IconClock className="text-muted" />
            <dd>{row.jam || <span className="text-muted">Jam belum diisi</span>}</dd>
          </div>
        </dl>

        <h4 className="mb-2 mt-6 text-[14px] font-bold">
          Lampiran <span className="font-medium text-muted">({row.lampiran.length})</span>
        </h4>
        {row.lampiran.length === 0 ? (
          <p className="rounded-md bg-surface-2 px-3 py-3 text-[13px] text-muted">
            Belum ada lampiran. Pilih Ubah agenda untuk menambahkan undangan, link meeting, atau surat tugas.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {row.lampiran.map((a, i) => {
              const href = safeHref(a.url);
              return (
                <li key={i} className="flex items-center gap-2 rounded-md border border-line py-1.5 pl-3 pr-1.5">
                  <IconLink className="flex-none text-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold">{a.type}</p>
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate text-[12.5px] text-primary underline-offset-2 hover:underline"
                        title={href}
                      >
                        {hostOf(href)}
                        <span className="text-muted">{href.replace(/^https?:\/\/[^/]+/, "")}</span>
                      </a>
                    ) : (
                      <p className="truncate text-[12.5px] text-danger">Alamat tidak valid: {a.url}</p>
                    )}
                  </div>
                  {href && (
                    <>
                      <CopyButton text={href} />
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm"
                        aria-label={`Buka ${a.type} di tab baru`}
                      >
                        Buka <IconExternal size={14} />
                      </a>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="flex justify-end border-t border-line px-5 py-3">
        <button type="button" className="btn btn-primary" onClick={onEdit}>
          <IconPencil size={15} /> Ubah agenda
        </button>
      </div>
    </>
  );
}

/** Dialog detail mandiri (dipakai dari daftar agenda dan ikon detail di baris). */
export function DetailDialog({
  row,
  color,
  onClose,
  onEdit,
}: {
  row: AgendaRow;
  color: string;
  onClose: () => void;
  onEdit: (id: string) => void;
}) {
  return (
    <Modal title="Detail agenda" onClose={onClose} width={560}>
      <AgendaDetail row={row} color={color} onEdit={() => onEdit(row.id)} />
    </Modal>
  );
}
