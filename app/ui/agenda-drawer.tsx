"use client";

import { useEffect, useRef, useState } from "react";
import { dmyToIso, type AgendaRow } from "../lib/agenda-data";
import AttachmentsDialog from "./attachments-dialog";
import DatePicker from "./date-picker";
import { Popover, anchorOf, type Anchor } from "./popup";
import { IconCalendar, IconChevronDown, IconClock, IconClose, IconPaperclip, IconTrash } from "./icons";
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

  const trigger = "field flex items-center justify-between gap-2 text-left hover:bg-surface-2";

  return (
    <aside
      aria-label={isNew ? "Tambah agenda" : "Ubah agenda"}
      className="drawer-in fixed right-0 top-0 z-[90] flex h-full w-[420px] max-w-full flex-col bg-surface text-ink shadow-float"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <h2 className="text-[17px] font-bold">{isNew ? "Tambah agenda" : "Ubah agenda"}</h2>
        <button type="button" onClick={onClose} aria-label="Tutup" className="btn btn-ghost btn-icon btn-sm -mr-1">
          <IconClose />
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
            <label className="label" htmlFor="f-kegiatan">Kegiatan</label>
            <textarea
              id="f-kegiatan"
              ref={nameRef}
              rows={2}
              value={draft.kegiatan}
              onChange={(e) => set({ kegiatan: e.target.value })}
              placeholder="Nama kegiatan"
              aria-invalid={touched && nameErr}
              className="field"
            />
            {touched && nameErr && <p role="alert" className="mt-1 text-[12.5px] text-danger">Nama kegiatan wajib diisi.</p>}
          </div>

          <div>
            <label className="label" htmlFor="f-topik">Topik</label>
            <input
              id="f-topik"
              list="drawer-topics"
              value={draft.topic}
              onChange={(e) => set({ topic: e.target.value })}
              placeholder="mis. HR, General"
              className="field"
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
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12.5px] font-medium ${
                      draft.topic === t ? "border-primary bg-primary-tint text-primary-ink" : "border-line-strong hover:bg-surface-3"
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: colorOf(t) }} />
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="label">Tanggal</span>
              <button
                type="button"
                className={`${trigger} ${touched && dateErr ? "border-danger" : ""}`}
                onClick={(e) => setPick({ kind: "date", anchor: anchorOf(e.currentTarget) })}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <IconCalendar className="flex-none text-muted" />
                  {draft.date || <span className="text-muted">Pilih tanggal</span>}
                </span>
                <IconChevronDown size={14} className="flex-none text-muted" />
              </button>
              {touched && dateErr && <p role="alert" className="mt-1 text-[12.5px] text-danger">Tanggal wajib dipilih.</p>}
            </div>
            <div>
              <span className="label">Jam</span>
              <button
                type="button"
                className={trigger}
                onClick={(e) => setPick({ kind: "jam", anchor: anchorOf(e.currentTarget) })}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <IconClock className="flex-none text-muted" />
                  <span className="truncate">{draft.jam || <span className="text-muted">Pilih jam</span>}</span>
                </span>
                <IconChevronDown size={14} className="flex-none text-muted" />
              </button>
            </div>
          </div>

          <div>
            <span className="label">Lampiran</span>
            <button type="button" className={trigger} onClick={() => setAttach(true)}>
              <span className="flex items-center gap-2">
                <IconPaperclip className="text-muted" />
                {draft.lampiran.length ? `${draft.lampiran.length} lampiran` : <span className="text-muted">Tambah lampiran</span>}
              </span>
              <span aria-hidden className="text-muted">Kelola</span>
            </button>
            {draft.lampiran.length > 0 && (
              <p className="mt-1 text-[12.5px] text-muted">{draft.lampiran.map((a) => a.type).join(", ")}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-line px-5 py-3">
          {!isNew &&
            (confirmDel ? (
              <button
                type="button"
                onClick={() => onDelete(draft.id)}
                className="btn btn-danger-solid"
              >
                Ya, hapus agenda
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDel(true)}
                className="btn btn-ghost btn-danger"
              >
                <IconTrash size={15} /> Hapus
              </button>
            ))}
          <span className="flex-1" />
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Batal
          </button>
          <button type="submit" className="btn btn-primary">
            Simpan agenda
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
