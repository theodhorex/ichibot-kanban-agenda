"use client";

import { useEffect, useRef, useState } from "react";
import { dmyToIso, type AgendaRow } from "../lib/agenda-data";
import AttachmentsDialog from "./attachments-dialog";
import DatePicker from "./date-picker";
import { Popover, anchorOf, type Anchor } from "./popup";
import TimePicker from "./time-picker";

type Pick = { kind: "date" | "jam"; anchor: Anchor } | null;

export default function AgendaDrawer({
  initial,
  isNew,
  topics,
  colorOf,
  onSave,
  onDelete,
  onClose,
}: {
  initial: AgendaRow;
  isNew: boolean;
  topics: string[];
  colorOf: (t: string) => string;
  onSave: (r: AgendaRow) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  // Seluruh ketikan hidup di state lokal drawer: kalender di belakang tidak dirender ulang.
  const [draft, setDraft] = useState<AgendaRow>(initial);
  const [pick, setPick] = useState<Pick>(null);
  const [attach, setAttach] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [touched, setTouched] = useState(false);
  const nameRef = useRef<HTMLTextAreaElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    nameRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      // Esc milik popup/dialog di atasnya bila ada.
      if (e.key === "Escape" && !document.querySelector('body > [role="dialog"]')) closeRef.current();
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);

  const set = (p: Partial<AgendaRow>) => setDraft((d) => ({ ...d, ...p }));
  const nameErr = !draft.kegiatan.trim();
  const dateErr = !dmyToIso(draft.date);
  const invalid = nameErr || dateErr;

  const label = "mb-1 block text-[12px] font-semibold text-black/60";
  const field =
    "w-full rounded-md border border-black/20 bg-white px-2.5 text-[14px] outline-none focus:border-[#44808f]";
  const trigger = `${field} flex h-9 items-center justify-between text-left hover:bg-black/[.03]`;

  return (
    <aside
      aria-label={isNew ? "Tambah agenda" : "Ubah agenda"}
      className="drawer-in fixed right-0 top-0 z-[90] flex h-full w-[400px] max-w-full flex-col bg-white text-black shadow-[-8px_0_30px_rgba(0,0,0,.18)]"
    >
      <div className="flex items-center justify-between border-b border-black/10 px-5 py-3">
        <h2 className="text-[16px] font-bold">{isNew ? "Tambah agenda" : "Ubah agenda"}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="rounded-md px-2 text-[22px] leading-none text-black/50 hover:bg-black/5 hover:text-black"
        >
          ×
        </button>
      </div>

      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (!invalid) onSave({ ...draft, kegiatan: draft.kegiatan.trim(), topic: draft.topic.trim() });
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-4">
          <div>
            <label className={label} htmlFor="f-kegiatan">Kegiatan</label>
            <textarea
              id="f-kegiatan"
              ref={nameRef}
              rows={2}
              value={draft.kegiatan}
              onChange={(e) => set({ kegiatan: e.target.value })}
              placeholder="Nama kegiatan"
              aria-invalid={touched && nameErr}
              className={`${field} resize-none py-2 ${touched && nameErr ? "border-red-500" : ""}`}
            />
            {touched && nameErr && <p className="mt-1 text-[12px] text-red-600">Nama kegiatan wajib diisi.</p>}
          </div>

          <div>
            <label className={label} htmlFor="f-topik">Topik</label>
            <input
              id="f-topik"
              list="drawer-topics"
              value={draft.topic}
              onChange={(e) => set({ topic: e.target.value })}
              placeholder="mis. HR, General"
              className={`${field} h-9`}
            />
            <datalist id="drawer-topics">
              {topics.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
            {topics.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {topics.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={draft.topic === t}
                    onClick={() => set({ topic: t })}
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] ${
                      draft.topic === t ? "border-[#44808f] bg-[#44808f]/10 font-semibold" : "border-black/15 hover:bg-black/5"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: colorOf(t) }} />
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={label}>Tanggal</span>
              <button
                type="button"
                className={`${trigger} ${touched && dateErr ? "border-red-500" : ""}`}
                onClick={(e) => setPick({ kind: "date", anchor: anchorOf(e.currentTarget) })}
              >
                {draft.date || <span className="text-black/35">Pilih tanggal</span>}
                <span aria-hidden className="text-black/40">▾</span>
              </button>
              {touched && dateErr && <p className="mt-1 text-[12px] text-red-600">Pilih tanggal.</p>}
            </div>
            <div>
              <span className={label}>Jam</span>
              <button
                type="button"
                className={trigger}
                onClick={(e) => setPick({ kind: "jam", anchor: anchorOf(e.currentTarget) })}
              >
                <span className="truncate">{draft.jam || <span className="text-black/35">Pilih jam</span>}</span>
                <span aria-hidden className="text-black/40">▾</span>
              </button>
            </div>
          </div>

          <div>
            <span className={label}>Lampiran</span>
            <button type="button" className={trigger} onClick={() => setAttach(true)}>
              {draft.lampiran.length ? `${draft.lampiran.length} lampiran` : <span className="text-black/35">Tambah lampiran</span>}
              <span aria-hidden className="text-black/40">+</span>
            </button>
            {draft.lampiran.length > 0 && (
              <p className="mt-1 text-[12px] text-black/55">{draft.lampiran.map((a) => a.type).join(", ")}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-black/10 px-5 py-3">
          {!isNew &&
            (confirmDel ? (
              <button
                type="button"
                onClick={() => onDelete(draft.id)}
                className="rounded-md bg-red-600 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-red-700"
              >
                Yakin hapus?
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDel(true)}
                className="rounded-md px-3 py-1.5 text-[13px] text-red-600 hover:bg-red-50"
              >
                Hapus
              </button>
            ))}
          <span className="flex-1" />
          <button type="button" onClick={onClose} className="rounded-md px-3 py-1.5 text-[13px] hover:bg-black/5">
            Batal
          </button>
          <button
            type="submit"
            className="rounded-md bg-[#44808f] px-4 py-1.5 text-[13px] font-semibold text-white hover:opacity-90"
          >
            Simpan
          </button>
        </div>
      </form>

      {pick && (
        <Popover anchor={pick.anchor} onClose={() => setPick(null)} label={pick.kind === "date" ? "Pilih tanggal" : "Pilih jam"}>
          {pick.kind === "date" ? (
            <DatePicker
              value={draft.date}
              onPick={(dmy) => {
                set({ date: dmy });
                setPick(null);
              }}
              onClear={() => {
                set({ date: "" });
                setPick(null);
              }}
            />
          ) : (
            <TimePicker
              value={draft.jam}
              onApply={(jam) => {
                set({ jam });
                setPick(null);
              }}
              onClear={() => {
                set({ jam: "" });
                setPick(null);
              }}
            />
          )}
        </Popover>
      )}
      {attach && (
        <AttachmentsDialog
          title={draft.kegiatan}
          value={draft.lampiran}
          onClose={() => setAttach(false)}
          onSave={(lampiran) => {
            set({ lampiran });
            setAttach(false);
          }}
        />
      )}
    </aside>
  );
}
