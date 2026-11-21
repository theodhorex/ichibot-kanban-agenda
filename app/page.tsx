import Agenda from "./ui/agenda";
// Sidebar disembunyikan sementara (briefing 19 Nov 2026). Komponennya tetap ada di ./ui/sidebar.tsx.

export default function Home() {
  return (
    <main className="h-dvh min-w-0">
      <Agenda />
    </main>
  );
}
