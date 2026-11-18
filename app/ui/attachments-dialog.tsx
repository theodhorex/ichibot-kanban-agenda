"use client";

import { useState } from "react";
import { ATTACHMENT_TYPES, safeHref, type Attachment } from "../lib/agenda-data";
import { IconPlus, IconTrash } from "./icons";
import { Modal } from "./popup";

export default function AttachmentsDialog({
  title,
  value,
  onSave,
  onClose,
}: {
  title: string;
  value: Attachment[];
  onSave: (v: Attachment[]) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<Attachment[]>(value.length ? value : [{ type: ATTACHMENT_TYPES[0], url: "" }]);

  const filled = items.filter((a) => a.url.trim());
  const badIdx = items.findIndex((a) => a.url.trim() && !safeHref(a.url));
  const patch = (i: number, p: Partial<Attachment>) =>
    setItems((xs) => xs.map((x, idx) => (idx === i ? { ...x, ...p } : x)));

  return (
    <Modal title={title ? `Lampiran: ${title}` : "Lampiran"} onClose={onClose} width={580}>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <p className="mb-3 text-[13px] text-muted">
          Tambahkan undangan, link meeting, surat tugas, atau tautan lain. Alamat tanpa <code className="rounded bg-surface-3 px-1">https://</code> dilengkapi otomatis.
        </p>
        <ul className="flex flex-col gap-2">
          {items.map((a, i) => (
            <li key={i} className="flex items-center gap-2">
              <select
                value={a.type}
                onChange={(e) => patch(i, { type: e.target.value })}
                className="field w-[148px] flex-none"
                aria-label={`Jenis lampiran ${i + 1}`}
              >
                {Array.from(new Set([...ATTACHMENT_TYPES, a.type])).map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <input
                value={a.url}
                onChange={(e) => patch(i, { url: e.target.value })}
                placeholder="https://…"
                aria-label={`Alamat lampiran ${i + 1}`}
                aria-invalid={i === badIdx}
                className="field min-w-0 flex-1"
              />
              <button
                type="button"
                onClick={() => setItems((xs) => xs.filter((_, idx) => idx !== i))}
                aria-label={`Hapus lampiran ${i + 1}`}
                className="btn btn-ghost btn-danger btn-icon flex-none"
              >
                <IconTrash />
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setItems((xs) => [...xs, { type: ATTACHMENT_TYPES[0], url: "" }])}
          className="btn btn-sm mt-3 border-dashed text-primary"
        >
          <IconPlus size={14} /> Tambah lampiran
        </button>
        {badIdx >= 0 && (
          <p role="alert" className="mt-2 text-[13px] text-danger">
            Hanya alamat http atau https yang diterima (baris {badIdx + 1}).
          </p>
        )}
      </div>
      <div className="flex justify-end gap-2 border-t border-line px-4 py-3">
        <button type="button" onClick={onClose} className="btn btn-ghost">
          Batal
        </button>
        <button
          type="button"
          disabled={badIdx >= 0}
          onClick={() => onSave(filled.map((a) => ({ type: a.type, url: safeHref(a.url) ?? a.url.trim() })))}
          className="btn btn-primary"
        >
          Simpan lampiran
        </button>
      </div>
    </Modal>
  );
}
