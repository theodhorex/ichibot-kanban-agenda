"use client";

import { useState } from "react";
import Agenda from "./agenda";
import Sidebar from "./sidebar";

// Sidebar ditutup -> agenda otomatis pindah ke layout kalender penuh; dibuka -> kembali ke layout pilihan pengguna.
export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex h-dvh gap-3 p-3">
      <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <main className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-line">
        <Agenda fullCalendar={collapsed} />
      </main>
    </div>
  );
}
