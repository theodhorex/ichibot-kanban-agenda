import Agenda from "./ui/agenda";
// Sidebar disembunyikan sementara (briefing 19 Nov 2026). Komponennya tetap ada di ./ui/sidebar.tsx.

export default function Home() {
  return (
    <div className="flex h-screen bg-[#eef1f3] p-3">
      <main className="min-w-0 flex-1 overflow-hidden rounded-2xl bg-white shadow-[0_1px_8px_rgba(0,0,0,.12)]">
        <Agenda />
      </main>
    </div>
  );
}
