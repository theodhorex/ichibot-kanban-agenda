"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { IconChevronDown } from "./icons";

/** Tombol dengan panel menu: tutup via klik luar, Esc (fokus kembali ke tombol), atau pilihan. */
export function Dropdown({
  label,
  icon,
  width = 240,
  children,
}: {
  label: string;
  icon: ReactNode;
  width?: number;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  return (
    <div className="relative" ref={wrap}>
      <button
        ref={trigger}
        type="button"
        className="btn"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {icon}
        <span className="hidden lg:inline">{label}</span>
        <span className="lg:hidden sr-only">{label}</span>
        <IconChevronDown size={14} className="text-muted" />
      </button>
      {open && (
        <div
          className="pop-in absolute right-0 top-full z-50 mt-1.5 rounded-md border border-line bg-surface p-1.5 shadow-float"
          style={{ width }}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function MenuItem({
  icon,
  title,
  hint,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-sm px-2.5 py-2 text-left hover:bg-surface-3"
    >
      <span className="text-muted">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[13.5px] font-semibold">{title}</span>
        {hint && <span className="block text-[12px] text-muted">{hint}</span>}
      </span>
    </button>
  );
}
