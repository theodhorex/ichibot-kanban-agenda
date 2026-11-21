import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const svg = ({ size = 16, ...p }: P): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
  ...p,
});

export const IconPlus = (p: P) => (<svg {...svg(p)}><path d="M12 5v14M5 12h14" /></svg>);
export const IconClose = (p: P) => (<svg {...svg(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const IconChevronLeft = (p: P) => (<svg {...svg(p)}><path d="m15 6-6 6 6 6" /></svg>);
export const IconChevronRight = (p: P) => (<svg {...svg(p)}><path d="m9 6 6 6-6 6" /></svg>);
export const IconChevronsLeft = (p: P) => (<svg {...svg(p)}><path d="m11 6-6 6 6 6M18 6l-6 6 6 6" /></svg>);
export const IconChevronsRight = (p: P) => (<svg {...svg(p)}><path d="m13 6 6 6-6 6M6 6l6 6-6 6" /></svg>);
export const IconChevronDown = (p: P) => (<svg {...svg(p)}><path d="m6 9 6 6 6-6" /></svg>);
export const IconArrowLeft = (p: P) => (<svg {...svg(p)}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>);
export const IconSearch = (p: P) => (<svg {...svg(p)}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></svg>);
export const IconCalendar = (p: P) => (<svg {...svg(p)}><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M8 3v4M16 3v4M3.5 10h17" /></svg>);
export const IconClock = (p: P) => (<svg {...svg(p)}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>);
export const IconTag = (p: P) => (<svg {...svg(p)}><path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7a1 1 0 0 1 .7.3l7.6 7.6a1 1 0 0 1 0 1.4l-7.7 7.7a1 1 0 0 1-1.4 0L3.8 12.9a1 1 0 0 1-.3-.7Z" /><circle cx="8" cy="8" r="1.2" /></svg>);
export const IconPaperclip = (p: P) => (<svg {...svg(p)}><path d="m20 11-8.6 8.6a5 5 0 0 1-7-7l8.8-8.8a3.3 3.3 0 0 1 4.7 4.7l-8.8 8.8a1.7 1.7 0 0 1-2.4-2.4L15 7" /></svg>);
export const IconLink = (p: P) => (<svg {...svg(p)}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1" /></svg>);
export const IconExternal = (p: P) => (<svg {...svg(p)}><path d="M14 4h6v6M20 4l-9 9M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" /></svg>);
export const IconCopy = (p: P) => (<svg {...svg(p)}><rect x="8.5" y="8.5" width="11" height="11" rx="2" /><path d="M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" /></svg>);
export const IconCheck = (p: P) => (<svg {...svg(p)}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>);
export const IconTrash = (p: P) => (<svg {...svg(p)}><path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7M10 11v6M14 11v6" /></svg>);
export const IconPencil = (p: P) => (<svg {...svg(p)}><path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3ZM14 7l3 3" /></svg>);
export const IconExpand = (p: P) => (<svg {...svg(p)}><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" /></svg>);
export const IconList = (p: P) => (<svg {...svg(p)}><path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" /></svg>);
export const IconSidebarClose = (p: P) => (
  <svg {...svg(p)}>
    <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
    <path d="M9.5 4v16" />
    <path d="m16 9.5-2.5 2.5 2.5 2.5" />
  </svg>
);
export const IconSidebarOpen = (p: P) => (
  <svg {...svg(p)}>
    <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
    <path d="M9.5 4v16" />
    <path d="m13.5 9.5 2.5 2.5-2.5 2.5" />
  </svg>
);
export const IconSliders = (p: P) => (<svg {...svg(p)}><path d="M4 7h9M17 7h3M4 17h3M11 17h9M13 7a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM7 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" /></svg>);
export const IconDownload = (p: P) => (<svg {...svg(p)}><path d="M12 4v11M7.5 11 12 15.5 16.5 11M5 20h14" /></svg>);
export const IconSheet = (p: P) => (<svg {...svg(p)}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 10h16M4 15h16M10 4v16" /></svg>);
export const IconFile = (p: P) => (<svg {...svg(p)}><path d="M14 3H7.5A1.5 1.5 0 0 0 6 4.5v15A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V7l-4-4ZM14 3v4h4M9 13h6M9 17h4" /></svg>);
export const IconAlert = (p: P) => (<svg {...svg(p)}><path d="M12 4 3 19.5h18L12 4ZM12 10v4.5M12 17.2h.01" /></svg>);
export const IconSpinner = (p: P) => (<svg {...svg(p)} className={`spin ${p.className ?? ""}`}><path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5" /></svg>);

/** Logo: kotak dengan kisi hari, satu sel terisi. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden focusable="false">
      <rect width="32" height="32" rx="8" fill="#0b6e75" />
      <g fill="#fff" opacity=".92">
        <rect x="7" y="9" width="4" height="4" rx="1" />
        <rect x="14" y="9" width="4" height="4" rx="1" />
        <rect x="21" y="9" width="4" height="4" rx="1" />
        <rect x="7" y="16" width="4" height="4" rx="1" />
        <rect x="21" y="16" width="4" height="4" rx="1" />
        <rect x="7" y="23" width="4" height="2.5" rx="1" />
      </g>
      <rect x="14" y="16" width="4" height="4" rx="1" fill="#f5b72f" />
    </svg>
  );
}
