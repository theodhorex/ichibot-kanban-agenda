"use client";

import { useState } from "react";
import { ATTACHMENT_TYPES, safeHref, type Attachment } from "../lib/agenda-data";
import { IconFile, IconPlus, IconSpinner, IconTrash, IconUpload } from "./icons";
import { Modal } from "./popup";

async function uploadOne(file: File): Promise<{ url: string; name: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = (await res.json()) as { url?: string; name?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "Gagal mengunggah file");
  return { url: data.url, name: data.name ?? file.name };
}

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
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  const filled = items.filter((a) => a.url.trim());
  const badIdx = items.findIndex((a) => a.url.trim() && !safeHref(a.url));
  const patch = (i: number, p: Partial<Attachment>) =>
    setItems((xs) => xs.map((x, idx) => (idx === i ? { ...x, ...p } : x)));

  const handleUploadRow = async (i: number, file: File | undefined) => {
    if (!file) return;
    setUploadErr("");
    setUploading(true);
    try {
      const { url, name } = await uploadOne(file);
      patch(i, { url, name });
    } catch (e) {
      setUploadErr(e instanceof Error ? e.message : "Gagal mengunggah file");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadNew = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploadErr("");
    setUploading(true);
    try {
      const uploaded: Attachment[] = [];
      for (const file of Array.from(files)) {
        const { url, name } = await uploadOne(file);
        uploaded.push({ type: ATTACHMENT_TYPES[0], url, name });
      }
      setItems((xs) => {
        const clean = xs.filter((x) => x.url.trim());
        return [...clean, ...uploaded];
      });
    } catch (e) {
      setUploadErr(e instanceof Error ? e.message : "Gagal mengunggah file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal title={title ? `Lampiran: ${title}` : "Lampiran"} onClose={onClose} width={600}>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <p className="mb-3 text-[13px] text-muted">
          Tambahkan tautan (undangan, link meeting, surat tugas) atau unggah file (maks. 10 MB). Alamat tanpa{" "}
          <code className="rounded bg-surface-3 px-1">https://</code> dilengkapi otomatis.
        </p>
        <ul className="flex flex-col gap-2">
          {items.map((a, i) => {
            const isUpload = a.url.startsWith("/uploads/");
            return (
              <li key={i} className="flex items-center gap-2">
                <select
                  value={a.type}
                  onChange={(e) => patch(i, { type: e.target.value })}
                  className="field w-[144px] flex-none"
                  aria-label={`Jenis lampiran ${i + 1}`}
                >
                  {Array.from(new Set([...ATTACHMENT_TYPES, a.type])).map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                {isUpload ? (
                  <div className="field flex min-w-0 flex-1 items-center gap-2 bg-surface-2">
                    <IconFile size={15} className="flex-none text-primary" />
                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium" title={a.url}>
                      {a.name ?? a.url.replace(/^\/uploads\//, "")}
                    </span>
                  </div>
                ) : (
                  <input
                    value={a.url}
                    onChange={(e) => patch(i, { url: e.target.value, name: undefined })}
                    placeholder="https://…"
                    aria-label={`Alamat lampiran ${i + 1}`}
                    aria-invalid={i === badIdx}
                    className="field min-w-0 flex-1"
                  />
                )}
                <label
                  className={`btn btn-ghost btn-icon flex-none cursor-pointer ${uploading ? "pointer-events-none opacity-50" : ""}`}
                  title="Unggah file untuk baris ini"
                >
                  <input
                    type="file"
                    className="sr-only"
                    disabled={uploading}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = "";
                      void handleUploadRow(i, f);
                    }}
                  />
                  <IconUpload size={15} />
                </label>
                <button
                  type="button"
                  onClick={() => setItems((xs) => xs.filter((_, idx) => idx !== i))}
                  aria-label={`Hapus lampiran ${i + 1}`}
                  className="btn btn-ghost btn-danger btn-icon flex-none"
                >
                  <IconTrash />
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setItems((xs) => [...xs, { type: ATTACHMENT_TYPES[0], url: "" }])}
            className="btn btn-sm border-dashed text-primary"
          >
            <IconPlus size={14} /> Tambah link
          </button>
          <label className={`btn btn-sm cursor-pointer border-dashed text-primary ${uploading ? "pointer-events-none opacity-60" : ""}`}>
            <input
              type="file"
              multiple
              className="sr-only"
              disabled={uploading}
              onChange={(e) => {
                const files = e.target.files;
                void handleUploadNew(files).then(() => {
                  e.target.value = "";
                });
              }}
            />
            {uploading ? <IconSpinner size={14} /> : <IconUpload size={14} />}
            {uploading ? "Mengunggah…" : "Upload file"}
          </label>
        </div>
        {uploadErr && (
          <p role="alert" className="mt-2 text-[13px] text-danger">
            {uploadErr}
          </p>
        )}
        {badIdx >= 0 && (
          <p role="alert" className="mt-2 text-[13px] text-danger">
            Hanya alamat http, https, atau file terunggah yang diterima (baris {badIdx + 1}).
          </p>
        )}
      </div>
      <div className="flex justify-end gap-2 border-t border-line px-4 py-3">
        <button type="button" onClick={onClose} className="btn btn-ghost">
          Batal
        </button>
        <button
          type="button"
          disabled={badIdx >= 0 || uploading}
          onClick={() =>
            onSave(
              filled.map((a) => ({
                type: a.type,
                url: safeHref(a.url) ?? a.url.trim(),
                ...(a.name ? { name: a.name } : null),
              })),
            )
          }
          className="btn btn-primary"
        >
          Simpan lampiran
        </button>
      </div>
    </Modal>
  );
}
