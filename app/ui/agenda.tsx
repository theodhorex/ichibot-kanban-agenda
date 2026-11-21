"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_TOPIC_COLOR,
  MONTHS_TITLE,
  buildYear,
  dmyToIso,
  emptyRow,
  isBlankRow,
  isoToDmy,
  normalizeRow,
  pad2,
  sortRows,
  type AgendaRow,
} from "../lib/agenda-data";
import { deleteRow as apiDelete, fetchAll, importLegacy, putColor, putRow } from "../lib/api";
import { exportPdf, exportXlsx } from "../lib/export";
import {
  DAY_W,
  DEFAULT_PREFS,
  PREFS_KEY,
  PRESET_COLS,
  ROW_H,
  leftOffsets,
  parsePrefs,
  type Prefs,
} from "../lib/view-prefs";
import { DetailDialog } from "./agenda-detail";
import AgendaDrawer from "./agenda-drawer";
import AgendaListPanel from "./agenda-list-panel";
import { AgendaRowView, TableHead, type FieldHandler } from "./agenda-table";
import AttachmentsDialog from "./attachments-dialog";
import DatePicker from "./date-picker";
import DayDialog from "./day-dialog";
import {
  IconAlert,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconFile,
  IconList,
  IconPanelLeft,
  IconPlus,
  IconSearch,
  IconSheet,
  IconSpinner,
  LogoMark,
} from "./icons";
import { Dropdown, MenuItem } from "./menu";
import { Popover, anchorOf, type Anchor } from "./popup";
import TimePicker from "./time-picker";
import ViewMenu from "./view-menu";

const STORE_KEY = "ichibot-agenda-v1"; // data lama (sebelum database): hanya dibaca untuk impor sekali jalan
const IMPORTED_KEY = "ichibot-db-imported";
const OVERSCAN = 30; // hari di kiri/kanan area terlihat yang tetap dirender
const QUANT = 10; // jendela dibulatkan agar tidak render ulang tiap piksel scroll

type Editing = { row: AgendaRow; isNew: boolean } | null;
type Picker = { kind: "date" | "jam"; id: string; anchor: Anchor } | null;

const focusRow = (id: string) => {
  const el = document.querySelector<HTMLInputElement>(`input[data-kid="${id}"][data-field="kegiatan"]`);
  if (!el) return;
  el.focus();
  el.scrollIntoView({ block: "nearest", inline: "nearest" });
};

const isoOf = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export default function Agenda() {
  const [year, setYear] = useState(2026);
  const [rows, setRows] = useState<AgendaRow[]>([]);
  const [colors, setColors] = useState<Record<string, string>>({});
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [query, setQuery] = useState("");
  const [prefsReady, setPrefsReady] = useState(false);
  const [dbState, setDbState] = useState<"loading" | "ready" | "error">("loading");
  const [dbError, setDbError] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "error">("idle");
  const [loadTick, setLoadTick] = useState(0);
  const [todayIso, setTodayIso] = useState("");
  const [range, setRange] = useState({ from: 0, to: 90 });
  const [editing, setEditing] = useState<Editing>(null);
  const [dayIso, setDayIso] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [activeMonth, setActiveMonth] = useState(0);
  const [viewH, setViewH] = useState(600);
  const [picker, setPicker] = useState<Picker>(null);
  const [attachId, setAttachId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const draft = useRef(new Set<string>()); // baris baru yang dibuang bila kegiatannya dibiarkan kosong
  const pendingFocus = useRef<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const scrollTarget = useRef<string | null>(null);
  const raf = useRef(0);
  const synced = useRef(new Map<string, string>()); // id -> JSON yang sudah ada di database
  const syncedColors = useRef(new Map<string, string>());
  const rowsRef = useRef(rows);
  const colorsRef = useRef(colors);
  const chain = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    rowsRef.current = rows;
    colorsRef.current = colors;
  });

  // Preferensi tampilan (per browser) dibaca setelah mount agar tidak beda dengan HTML server.
  useEffect(() => {
    queueMicrotask(() => {
      setTodayIso(isoOf(new Date()));
      try {
        const p = localStorage.getItem(PREFS_KEY);
        if (p) setPrefs(parsePrefs(JSON.parse(p)));
      } catch {}
      setPrefsReady(true);
    });
  }, []);

  // Muat agenda dari database. Bila database masih kosong dan ada data lama di browser, impor sekali.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let data = await fetchAll();
        if (data.rows.length === 0 && !localStorage.getItem(IMPORTED_KEY)) {
          let legacy: AgendaRow[] = [];
          let legacyColors: Record<string, string> = {};
          try {
            const raw = localStorage.getItem(STORE_KEY);
            if (raw) {
              const d = JSON.parse(raw);
              if (Array.isArray(d.rows)) legacy = d.rows.map(normalizeRow).filter((r: AgendaRow) => !isBlankRow(r));
              if (d.colors && typeof d.colors === "object") legacyColors = d.colors;
            }
          } catch {}
          if (legacy.length) {
            await importLegacy(legacy, legacyColors);
            data = await fetchAll();
          }
          try {
            localStorage.setItem(IMPORTED_KEY, "1");
          } catch {}
        }
        if (cancelled) return;
        synced.current = new Map(data.rows.map((r) => [r.id, JSON.stringify(r)]));
        syncedColors.current = new Map(Object.entries(data.colors));
        setRows(data.rows);
        setColors(data.colors);
        setDbState("ready");
      } catch (e) {
        if (cancelled) return;
        setDbError(e instanceof Error ? e.message : "Galat tidak dikenal");
        setDbState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadTick]);

  // Kirim perubahan ke database. Berjalan berurutan (satu antrean) agar versi lama tak menimpa yang baru.
  const flush = useCallback(() => {
    chain.current = chain.current.then(async () => {
      const curRows = rowsRef.current;
      const curColors = colorsRef.current;
      const byId = new Map(curRows.map((r) => [r.id, r]));
      const puts: [AgendaRow, string][] = [];
      const dels: string[] = [];
      for (const r of curRows) {
        if (isBlankRow(r)) continue;
        const j = JSON.stringify(r);
        if (synced.current.get(r.id) !== j) puts.push([r, j]);
      }
      for (const id of synced.current.keys()) {
        const r = byId.get(id);
        if (!r || isBlankRow(r)) dels.push(id);
      }
      const colorPuts = Object.entries(curColors).filter(([t, c]) => syncedColors.current.get(t) !== c);
      if (!puts.length && !dels.length && !colorPuts.length) {
        setSaveState("idle");
        return;
      }
      setSaveState("saving");
      try {
        await Promise.all([
          ...puts.map(async ([r, j]) => {
            await putRow(r);
            synced.current.set(r.id, j);
          }),
          ...dels.map(async (id) => {
            await apiDelete(id);
            synced.current.delete(id);
          }),
          ...colorPuts.map(async ([t, c]) => {
            await putColor(t, c);
            syncedColors.current.set(t, c);
          }),
        ]);
        setSaveState("idle");
      } catch {
        setSaveState("error");
      }
    });
  }, []);

  useEffect(() => {
    if (dbState !== "ready") return;
    const t = setTimeout(flush, 350);
    return () => clearTimeout(t);
  }, [rows, colors, dbState, flush]);

  // Simpan segera bila tab disembunyikan/ditutup.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [flush]);

  useEffect(() => {
    if (!prefsReady) return;
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {}
  }, [prefs, prefsReady]);

  const cols = PRESET_COLS[prefs.preset];
  const isList = cols.length > 0; // layout yang menampilkan daftar agenda: tulis langsung di baris
  const { lefts, total } = useMemo(() => leftOffsets(cols), [cols]);
  const dayW = DAY_W[prefs.zoom];
  const rowH = ROW_H[prefs.density];

  const months = useMemo(() => buildYear(year), [year]);
  const days = useMemo(() => months.flatMap((m) => m.days), [months]);
  const dayIndex = useMemo(() => new Map(days.map((d, i) => [d.iso, i])), [days]);

  const sorted = useMemo(() => sortRows(rows), [rows]);
  const topics = useMemo(() => Array.from(new Set(rows.map((r) => r.topic.trim()).filter(Boolean))), [rows]);
  const colorOf = useCallback((t: string) => colors[t] ?? DEFAULT_TOPIC_COLOR, [colors]);

  const q = query.trim().toLowerCase();
  const matches = (r: AgendaRow) =>
    !q ||
    [r.kegiatan, r.topic, r.date, r.jam, ...r.lampiran.flatMap((a) => [a.type, a.url])].some((v) =>
      v.toLowerCase().includes(q),
    );

  // Baris kosong mengisi sisa tinggi layar supaya selalu ada "kanvas" untuk diklik.
  const display = useMemo<(AgendaRow | null)[]>(() => {
    const target = Math.ceil(viewH / rowH) + 1;
    return [...sorted, ...Array.from({ length: Math.max(4, target - sorted.length) }, () => null)];
  }, [sorted, viewH, rowH]);

  const topicCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) {
      const t = r.topic.trim();
      if (t) m.set(t, (m.get(t) ?? 0) + 1);
    }
    return m;
  }, [rows]);
  const monthCounts = useMemo(() => {
    const c = Array<number>(12).fill(0);
    for (const r of rows) {
      const iso = dmyToIso(r.date);
      if (iso && iso.startsWith(`${year}-`)) c[Number(iso.slice(5, 7)) - 1]++;
    }
    return c;
  }, [rows, year]);
  const yearCount = monthCounts.reduce((a, b) => a + b, 0);
  const nowMonth = todayIso.startsWith(`${year}-`) ? Number(todayIso.slice(5, 7)) - 1 : -1;

  /* ---------- scroll + jendela horizontal ---------- */
  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const first = Math.floor(el.scrollLeft / dayW);
    const last = Math.ceil((el.scrollLeft + el.clientWidth) / dayW);
    const from = Math.max(0, Math.floor((first - OVERSCAN) / QUANT) * QUANT);
    const to = Math.min(days.length, Math.ceil((last + OVERSCAN) / QUANT) * QUANT);
    setRange((r) => (r.from === from && r.to === to ? r : { from, to }));
    const spy = days[Math.min(days.length - 1, Math.max(0, first + 3))];
    if (spy) setActiveMonth(Number(spy.iso.slice(5, 7)) - 1);
    setViewH(el.clientHeight);
  }, [dayW, days]);

  const onScroll = () => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      measure();
    });
  };

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const scrollToIso = useCallback(
    (iso: string, smooth = true) => {
      const i = dayIndex.get(iso);
      const el = scroller.current;
      if (i === undefined || !el) return;
      el.scrollTo({ left: i * dayW, behavior: smooth ? "smooth" : "auto" });
    },
    [dayIndex, dayW],
  );

  // Saat tahun/zoom berubah: gulir ke tanggal tujuan, atau ke bulan berjalan.
  useEffect(() => {
    const target = scrollTarget.current;
    scrollTarget.current = null;
    const now = new Date();
    scrollToIso(target ?? (now.getFullYear() === year ? `${year}-${pad2(now.getMonth() + 1)}-01` : `${year}-01-01`), false);
    queueMicrotask(measure);
  }, [year, scrollToIso, measure]);

  const goTo = (iso: string) => {
    const y = Number(iso.slice(0, 4));
    if (y !== year) {
      scrollTarget.current = iso;
      setYear(y);
    } else {
      requestAnimationFrame(() => scrollToIso(iso));
    }
  };

  /* ---------- tambah / ubah / hapus ---------- */
  const update = (id: string, patch: Partial<AgendaRow>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  // Setelah baris baru dirender, pindahkan fokus ke kolom kegiatannya.
  useEffect(() => {
    const id = pendingFocus.current;
    if (!id) return;
    pendingFocus.current = null;
    focusRow(id);
  }, [rows]);

  const openAdd = (dmy = "") => {
    setDayIso(null);
    if (isList) {
      const r = { ...emptyRow(), date: dmy };
      draft.current.add(r.id);
      pendingFocus.current = r.id;
      setRows((rs) => [...rs, r]);
    } else {
      setEditing({ row: { ...emptyRow(), date: dmy }, isNew: true });
    }
  };
  const openEdit = (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    setDayIso(null);
    if (isList) {
      const iso = dmyToIso(row.date);
      if (iso) goTo(iso);
      requestAnimationFrame(() => focusRow(id));
    } else {
      setEditing({ row, isNew: false });
    }
  };
  const saveRow = (r: AgendaRow) => {
    setRows((rs) => (rs.some((x) => x.id === r.id) ? rs.map((x) => (x.id === r.id ? r : x)) : [...rs, r]));
    setEditing(null);
    const iso = dmyToIso(r.date);
    if (iso) goTo(iso);
  };
  const deleteRow = (id: string) => {
    setRows((rs) => rs.filter((r) => r.id !== id));
    setEditing(null);
    setConfirmId(null);
  };

  // Dipanggil saat sel kegiatan/topik kehilangan fokus (stabil, agar baris ter-memo tidak ikut berubah).
  const onField = useCallback<FieldHandler>((id, field, value) => {
    const v = value.trim();
    if (id === null) {
      if (v) setRows((rs) => [...rs, { ...emptyRow(), [field]: v }]);
      return;
    }
    if (field === "kegiatan" && draft.current.has(id)) {
      draft.current.delete(id);
      if (!v) {
        setRows((rs) => rs.filter((r) => r.id !== id));
        return;
      }
    }
    setRows((rs) => rs.map((r) => (r.id === id && r[field] !== v ? { ...r, [field]: v } : r)));
  }, []);

  // Satu penangan klik untuk seluruh tabel (bukan satu per sel).
  const onTableClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("input")) return; // mengetik langsung di sel
    const cell = target.closest<HTMLElement>("td,th");
    if (!cell) return;
    const d = cell.dataset;
    const onDel = !!target.closest("[data-del]");
    if (!onDel) setConfirmId(null);
    if (d.iso) {
      if (d.head || d.m) setDayIso(d.iso);
      else openAdd(isoToDmy(d.iso));
    } else if (d.col) {
      const id = d.r;
      if (d.col === "no") {
        if (id && target.closest("[data-detail]")) {
          setDetailId(id);
          return;
        }
        if (id && onDel) {
          if (confirmId === id) deleteRow(id);
          else setConfirmId(id);
        }
        return;
      }
      if (!id) {
        cell.parentElement?.querySelector<HTMLInputElement>("input")?.focus();
        return;
      }
      if (d.col === "date" || d.col === "jam") setPicker({ kind: d.col, id, anchor: anchorOf(cell) });
      else if (d.col === "link") setAttachId(id);
    }
  };

  const runExport = async (kind: "xlsx" | "pdf") => {
    setExporting(true);
    try {
      await (kind === "xlsx" ? exportXlsx(sorted, year) : exportPdf(sorted, year));
    } finally {
      setExporting(false);
    }
  };

  const saveLabel =
    dbState === "loading"
      ? "Memuat dari database"
      : dbState === "error"
        ? "Database tidak terhubung"
        : saveState === "saving"
          ? "Menyimpan"
          : saveState === "error"
            ? "Gagal menyimpan"
            : "Tersimpan";
  const saveBad = dbState === "error" || saveState === "error";
  const detailRow = detailId ? rows.find((r) => r.id === detailId) : undefined;

  return (
    <div className="flex h-full flex-col bg-surface text-ink">
      <header className="border-b border-line bg-surface">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 pb-2 pt-3">
          <div className="flex items-center gap-2.5 pr-1">
            <LogoMark />
            <h1 className="text-[17px] font-bold leading-none tracking-tight">Annual Agenda</h1>
          </div>

          <div className="flex items-center gap-0.5" role="group" aria-label="Pilih tahun">
            <button className="btn btn-ghost btn-icon" onClick={() => setYear(year - 1)} aria-label="Tahun sebelumnya">
              <IconChevronLeft />
            </button>
            <span className="min-w-[64px] text-center text-[22px] font-extrabold leading-none tabular-nums" aria-live="polite">
              {year}
            </span>
            <button className="btn btn-ghost btn-icon" onClick={() => setYear(year + 1)} aria-label="Tahun berikutnya">
              <IconChevronRight />
            </button>
          </div>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setPrefs((p) => ({ ...p, preset: p.preset === "lengkap" ? "kalender" : "lengkap" }))}
            aria-pressed={isList}
            aria-label={isList ? "Tutup daftar agenda (kalender penuh)" : "Buka daftar agenda"}
            title={isList ? "Tutup daftar agenda: kalender penuh" : "Buka daftar agenda"}
          >
            <IconPanelLeft />
          </button>
          <button className="btn" onClick={() => goTo(todayIso || isoOf(new Date()))}>
            Hari ini
          </button>

          <div className="relative min-w-[150px] max-w-[320px] flex-1">
            <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari agenda"
              aria-label="Cari agenda"
              className="field pl-8"
            />
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <span
              role="status"
              className={`inline-flex items-center gap-1.5 text-[12.5px] font-medium ${saveBad ? "text-danger" : "text-muted"}`}
            >
              {dbState === "loading" || saveState === "saving" ? (
                <IconSpinner size={14} />
              ) : saveBad ? (
                <IconAlert size={14} />
              ) : (
                <IconCheck size={14} className="text-ok" />
              )}
              <span className="hidden sm:inline">{saveLabel}</span>
              <span className="sr-only sm:hidden">{saveLabel}</span>
            </span>
            {!isList && (
              <button className="btn" onClick={() => setListOpen((v) => !v)} aria-pressed={listOpen}>
                <IconList />
                <span className="hidden md:inline">Daftar agenda</span>
                <span className="md:hidden sr-only">Daftar agenda</span>
                <span className="text-muted">{rows.length}</span>
              </button>
            )}
            <ViewMenu prefs={prefs} onChange={setPrefs} />
            <Dropdown
              label={exporting ? "Mengekspor" : "Ekspor"}
              icon={exporting ? <IconSpinner /> : <IconDownload />}
              width={260}
            >
              {(close) => (
                <>
                  <MenuItem
                    icon={<IconSheet />}
                    title="Excel (.xlsx)"
                    hint={`Tabel agenda ${year} dengan kalender`}
                    onClick={() => {
                      close();
                      runExport("xlsx");
                    }}
                  />
                  <MenuItem
                    icon={<IconFile />}
                    title="PDF (.pdf)"
                    hint={`Dokumen siap cetak untuk ${year}`}
                    onClick={() => {
                      close();
                      runExport("pdf");
                    }}
                  />
                </>
              )}
            </Dropdown>
            <button className="btn btn-primary" onClick={() => openAdd()} disabled={dbState !== "ready"}>
              <IconPlus size={16} /> Tambah agenda
            </button>
          </div>
        </div>

        {isList && (
        <div className="flex items-center gap-1 overflow-x-auto px-3 pb-2 pt-0.5 [scrollbar-width:none]">
          <nav className="flex flex-none items-center gap-0.5" aria-label={`Bulan di ${year}`}>
            {MONTHS_TITLE.map((name, i) => (
              <button
                key={name}
                type="button"
                className={`mp ${i === nowMonth ? "now" : ""}`}
                aria-current={i === activeMonth}
                title={`Ke ${name} ${year}`}
                onClick={() => scrollToIso(`${year}-${pad2(i + 1)}-01`)}
              >
                {name.slice(0, 3)}
                {monthCounts[i] > 0 && <span className="n">{monthCounts[i]}</span>}
              </button>
            ))}
          </nav>
          {topics.length > 0 && (
            <>
              <span className="mx-2 h-5 w-px flex-none bg-line-strong" aria-hidden />
              <div className="flex flex-none items-center gap-1.5" role="group" aria-label="Topik">
                {topics.map((t) => (
                  <div key={t} className="chip" data-on={topicFilter === t}>
                    <label className="sw" title={`Ubah warna topik ${t}`}>
                      <input
                        type="color"
                        value={colorOf(t)}
                        onChange={(e) => setColors((c) => ({ ...c, [t]: e.target.value }))}
                        className="sr-only-input"
                        aria-label={`Warna topik ${t}`}
                      />
                      <i style={{ background: colorOf(t) }} />
                    </label>
                    <button
                      type="button"
                      aria-pressed={topicFilter === t}
                      title={topicFilter === t ? "Tampilkan semua topik" : `Sorot hanya topik ${t}`}
                      onClick={() => setTopicFilter((f) => (f === t ? null : t))}
                    >
                      {t}
                      <span className="n">{topicCounts.get(t)}</span>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        )}
      </header>

      {saveBad && (
        <div role="alert" className="flex flex-wrap items-center gap-3 border-b border-danger/25 bg-danger-tint px-4 py-2.5 text-[13.5px] text-danger">
          <IconAlert className="flex-none" />
          <span className="min-w-0 flex-1">
            {dbState === "error"
              ? `Tidak bisa memuat dari database: ${dbError}. Pastikan MariaDB/MySQL berjalan dan DATABASE_URL di .env.local benar.`
              : "Perubahan belum tersimpan ke database. Data masih ada di layar; jangan tutup halaman ini."}
          </span>
          <button
            className="btn btn-sm"
            onClick={() => {
              if (dbState === "error") {
                setDbState("loading");
                setLoadTick((n) => n + 1);
              } else flush();
            }}
          >
            Coba lagi
          </button>
        </div>
      )}
      <datalist id="topic-list">
        {topics.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>
      <div className="relative min-h-0 flex-1">
        <div
          ref={scroller}
          onScroll={onScroll}
          className={`cal-scroll h-full overflow-auto ${dbState === "ready" ? "" : "pointer-events-none opacity-60"}`}
          aria-busy={dbState !== "ready"}
        >
          <table onClick={onTableClick} className="cal" style={{ width: total + days.length * dayW }}>
            <TableHead months={months} cols={cols} lefts={lefts} leftTotal={total} dayW={dayW} todayIso={todayIso} />
            <tbody>
              {display.map((r, i) => (
                <AgendaRowView
                  key={r?.id ?? `e${i}`}
                  row={r}
                  idx={i}
                  hint={!r && i === sorted.length}
                  markIso={r ? dmyToIso(r.date) : null}
                  color={r ? colorOf(r.topic.trim()) : DEFAULT_TOPIC_COLOR}
                  dim={r ? !matches(r) || (topicFilter !== null && r.topic.trim() !== topicFilter) : false}
                  confirming={r ? confirmId === r.id : false}
                  onField={onField}
                  cols={cols}
                  lefts={lefts}
                  days={days}
                  from={range.from}
                  to={range.to}
                  rowH={rowH}
                  todayIso={todayIso}
                />
              ))}
            </tbody>
          </table>
        </div>
        {dbState === "ready" && yearCount === 0 && (
          <div className="pointer-events-none absolute inset-x-0 top-[104px] flex" style={{ paddingLeft: total + 28 }}>
            <div role="status" className="fade-in pointer-events-auto max-w-[340px] rounded-lg border border-line bg-surface p-5 shadow-float">
              <h2 className="text-[16px] font-bold">Belum ada agenda di {year}</h2>
              <p className="mt-1.5 text-[13.5px] text-ink-2">
                {isList
                  ? "Ketik di baris kosong, klik sel pada tanggal, atau gunakan tombol di bawah."
                  : "Klik sel kosong pada tanggal, atau gunakan tombol di bawah."}
                {rows.length > 0 && " Agenda di tahun lain tetap tersimpan."}
              </p>
              <button className="btn btn-primary mt-3" onClick={() => openAdd()}>
                <IconPlus size={16} /> Tambah agenda
              </button>
            </div>
          </div>
        )}
      {!isList && listOpen && (
        <AgendaListPanel
          rows={sorted}
          colorOf={colorOf}
          onClose={() => setListOpen(false)}
          onAdd={() => openAdd()}
          onPick={(id) => {
            const row = rows.find((r) => r.id === id);
            const iso = row ? dmyToIso(row.date) : null;
            if (iso) goTo(iso);
            setDetailId(id);
          }}
        />
      )}
      </div>

      {picker &&
        (() => {
          const row = rows.find((r) => r.id === picker.id);
          if (!row) return null;
          return (
            <Popover anchor={picker.anchor} onClose={() => setPicker(null)} label={picker.kind === "date" ? "Pilih tanggal" : "Pilih jam"}>
              {picker.kind === "date" ? (
                <DatePicker
                  value={row.date}
                  onPick={(date) => {
                    update(row.id, { date });
                    setPicker(null);
                  }}
                  onClear={() => {
                    update(row.id, { date: "" });
                    setPicker(null);
                  }}
                />
              ) : (
                <TimePicker
                  value={row.jam}
                  onApply={(jam) => {
                    update(row.id, { jam });
                    setPicker(null);
                  }}
                  onClear={() => {
                    update(row.id, { jam: "" });
                    setPicker(null);
                  }}
                />
              )}
            </Popover>
          );
        })()}
      {attachId && rows.find((r) => r.id === attachId) && (
        <AttachmentsDialog
          title={rows.find((r) => r.id === attachId)?.kegiatan ?? ""}
          value={rows.find((r) => r.id === attachId)?.lampiran ?? []}
          onClose={() => setAttachId(null)}
          onSave={(lampiran) => {
            update(attachId, { lampiran });
            setAttachId(null);
          }}
        />
      )}
      {editing && (
        <AgendaDrawer
          key={editing.row.id}
          initial={editing.row}
          isNew={editing.isNew}
          topics={topics}
          colorOf={colorOf}
          onSave={saveRow}
          onDelete={deleteRow}
          onClose={() => setEditing(null)}
        />
      )}
      {detailRow && (
        <DetailDialog
          row={detailRow}
          color={colorOf(detailRow.topic.trim())}
          onClose={() => setDetailId(null)}
          onEdit={(id) => {
            setDetailId(null);
            openEdit(id);
          }}
        />
      )}
      {dayIso && (
        <DayDialog
          iso={dayIso}
          rows={rows}
          colorOf={colorOf}
          onClose={() => setDayIso(null)}
          onEdit={openEdit}
          onAdd={(iso) => openAdd(isoToDmy(iso))}
        />
      )}
    </div>
  );
}
