"use client";

import { useState } from "react";
import { ATTACHMENT_TYPES, safeHref, type Attachment } from "../lib/agenda-data";
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

  const field = "h-9 rounded-md border border-black/20 bg-white px-2 text-[13px] outline-none focus:border-[#44808f]";

  return (
    <Modal title={`Lampiran${title ? ` · ${title}` : ""}`} onClose={onClose} width={560}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <p className="mb-3 text-[12px] text-black/55">
          Tambahkan undangan, link meeting, surat tugas, atau tautan lain. Alamat tanpa <code>https://</code> akan dilengkapi otomatis.
        </p>
        <ul className="flex flex-col gap-2">
          {items.map((a, i) => (
            <li key={i} className="flex items-center gap-2">
              <select
                value={a.type}
                onChange={(e) => patch(i, { type: e.target.value })}
                className={`${field} w-[140px] flex-none`}
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
                className={`${field} min-w-0 flex-1 ${i === badIdx ? "border-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setItems((xs) => xs.filter((_, idx) => idx !== i))}
                aria-label={`Hapus lampiran ${i + 1}`}
                className="h-9 w-9 flex-none rounded-md text-[18px] text-red-600 hover:bg-red-50"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setItems((xs) => [...xs, { type: ATTACHMENT_TYPES[0], url: "" }])}
          className="mt-3 rounded-md border border-dashed border-black/30 px-3 py-1.5 text-[13px] font-medium text-[#44808f] hover:bg-black/5"
        >
          + Tambah lampiran
        </button>
        {badIdx >= 0 && <p className="mt-2 text-[12px] text-red-600">Hanya alamat http atau https yang diterima (baris {badIdx + 1}).</p>}
      </div>
      <div className="flex justify-end gap-2 border-t border-black/10 px-5 py-3">
        <button type="button" onClick={onClose} className="rounded-md px-3 py-1.5 text-[13px] hover:bg-black/5">
          Batal
        </button>
        <button
          type="button"
          disabled={badIdx >= 0}
          onClick={() =>
            onSave(filled.map((a) => ({ type: a.type, url: safeHref(a.url) ?? a.url.trim() })))
          }
          className="rounded-md bg-[#44808f] px-4 py-1.5 text-[13px] font-semibold text-white hover:opacity-90 disabled:opacity-40"
        >
          Simpan
        </button>
      </div>
    </Modal>
  );
}
