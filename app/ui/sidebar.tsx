"use client";

import { useState, type ReactNode } from "react";

const icon = (d: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {d}
  </svg>
);

const ICONS = {
  dashboard: icon(
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9.5h13V10" />
      <path d="M10 19.5v-5h4v5" />
    </>,
  ),
  notifications: icon(
    <>
      <path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 1.5h-15L6 16.5Z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </>,
  ),
  projects: icon(<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4.6l2 2.2h8.4A1.5 1.5 0 0 1 21 8.7v9.8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5v-12Z" />),
  tasks: icon(
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5" />
      <path d="m9 14.5 2 2 4-4.5" />
    </>,
  ),
  analytics: icon(
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M8 16v-3M12 16V8M16 16v-5" />
    </>,
  ),
  settings: icon(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 14.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.4l.1.1a1.6 1.6 0 0 0 1.8.3h0a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v0a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" />
    </>,
  ),
  collapse: icon(
    <>
      <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
      <path d="M9.5 4v16" />
      <path d="m16 9.5-2.5 2.5 2.5 2.5" />
    </>,
  ),
  expand: icon(
    <>
      <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
      <path d="M9.5 4v16" />
      <path d="m13.5 9.5 2.5 2.5-2.5 2.5" />
    </>,
  ),
  support: icon(
    <>
      <path d="M12 21a9 9 0 1 0-8-4.9L3 21l4.2-1A9 9 0 0 0 12 21Z" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1.9-1.1 1.8" />
      <path d="M12 16.5h.01" />
    </>,
  ),
};

type ItemKey = keyof typeof ICONS;
type Item = { key: ItemKey; label: string; badge?: number };

const MAIN: Item[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "notifications", label: "Notifications", badge: 4 },
  { key: "projects", label: "Projects" },
  { key: "tasks", label: "Tasks" },
  { key: "analytics", label: "Analytics" },
];
const FOOT: Item[] = [
  { key: "settings", label: "Settings" },
  { key: "support", label: "Support" },
];

function NavItem({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: Item;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <div className="group relative">
      <button
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        aria-label={item.label}
        className={`flex h-12 w-full items-center rounded-lg text-[16px] text-neutral-900 transition-colors ${
          collapsed ? "justify-center" : "gap-3.5 px-3"
        } ${active ? "bg-[#e3fdf1]" : "hover:bg-neutral-100"}`}
      >
        <span className="relative flex-none">
          {ICONS[item.key]}
          {collapsed && item.badge ? (
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#dc2626]" />
          ) : null}
        </span>
        {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
        {!collapsed && item.badge ? (
          <span className="flex h-[25px] min-w-[27px] items-center justify-center rounded-[5px] bg-[#dc2626] px-1.5 text-[14px] text-white">
            {item.badge}
          </span>
        ) : null}
      </button>
      {collapsed && (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-[calc(100%+8px)] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md bg-neutral-600 px-3 py-1.5 text-[14px] font-semibold text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
        >
          {item.label}
        </span>
      )}
    </div>
  );
}

export default function Sidebar({
  collapsed: collapsedProp,
  onCollapsedChange,
}: {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
} = {}) {
  const [inner, setInner] = useState(false);
  const collapsed = collapsedProp ?? inner;
  const setCollapsed = (v: boolean) => {
    setInner(v);
    onCollapsedChange?.(v);
  };
  const [active, setActive] = useState<ItemKey>("dashboard");

  return (
    <aside
      className={`relative flex flex-none flex-col rounded-2xl bg-[#fafafa] px-3 py-4 shadow-[0_1px_8px_rgba(0,0,0,.12)] transition-[width] duration-200 ${
        collapsed ? "w-[68px]" : "w-[272px]"
      }`}
    >
      {/* 1. Workspace */}
      <button
        className={`flex h-[50px] items-center rounded-lg border border-neutral-200 bg-[#f0f1f4] ${
          collapsed ? "justify-center" : "gap-3 px-2.5"
        }`}
        aria-label="Workspace"
      >
        <span className="flex h-[27px] w-[27px] flex-none items-center justify-center rounded-full bg-neutral-600 text-[15px] font-semibold text-white">
          I
        </span>
        {!collapsed && (
          <>
            <span className="flex-1 text-left text-[17px] font-medium">Ichibot</span>
            <span className="border-x-[5px] border-t-[6px] border-x-transparent border-t-neutral-900" />
          </>
        )}
      </button>

      <nav className="mt-7 flex flex-col gap-1">
        {MAIN.map((it) => (
          <NavItem key={it.key} item={it} active={active === it.key} collapsed={collapsed} onClick={() => setActive(it.key)} />
        ))}
      </nav>

      <div className="flex-1" />

      <nav className="flex flex-col gap-1">
        {FOOT.map((it) => (
          <NavItem key={it.key} item={it} active={active === it.key} collapsed={collapsed} onClick={() => setActive(it.key)} />
        ))}
        <NavItem
          item={{ key: collapsed ? "expand" : "collapse", label: collapsed ? "Expand" : "Collapse" }}
          active={false}
          collapsed={collapsed}
          onClick={() => setCollapsed(!collapsed)}
        />
      </nav>

      {/* 2. Profil */}
      <div className={`mt-4 flex items-center border-t border-neutral-200 pt-4 ${collapsed ? "justify-center" : "gap-3.5 px-0.5"}`}>
        <span className="flex h-[50px] w-[50px] flex-none items-center justify-center rounded-full bg-neutral-300 text-[18px] font-semibold text-neutral-700">
          T
        </span>
        {!collapsed && (
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[16px] font-bold">Theo</span>
            <span className="block truncate text-[13px] text-neutral-500">Magang Ichibot</span>
          </span>
        )}
      </div>
    </aside>
  );
}
