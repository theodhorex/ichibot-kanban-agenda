// Data dummy agenda Jan–Nov 2026. Jalankan: node scripts/seed-dummy.mjs
// Idempoten: baris ber-id "dummy-*" dihapus lalu dimasukkan ulang.
import mysql from "mysql2/promise";

try { process.loadEnvFile(".env.local"); } catch {}

const L = (type, path) => ({ type, url: `https://example.com/${path}` });
const data = [
  ["01-05", "Kick-off Tahun 2026 dan Penetapan Target", "General", "09:00 s.d 10:30", [L("Meeting", "kickoff-2026")]],
  ["01-08", "Rapat Human Resource: Rekrutmen Magang Semester Genap", "HR", "13:00 s.d 14:00", []],
  ["01-13", "Pelatihan Dasar Akuntansi untuk Peserta Baru", "Training", "09:00 s.d 12:00", [L("Undangan", "undangan-akuntansi")]],
  ["01-20", "Review Laporan Keuangan Desember 2025", "Keuangan", "14:00 s.d 15:30", [L("Dokumen", "lap-des-2025")]],
  ["01-27", "Sosialisasi SOP Kerja Terbaru", "General", "10:00", []],
  ["02-03", "Seleksi Wawancara Calon Peserta Magang", "HR", "09:00 s.d 15:00", []],
  ["02-10", "Workshop Kanban dan Manajemen Tugas", "Training", "13:00 s.d 16:00", [L("Meeting", "ws-kanban")]],
  ["02-12", "Rapat Koordinasi Bulanan Divisi", "General", "15:00 s.d 16:00", []],
  ["02-17", "Penyampaian Tenggat Laporan Pajak Bulanan", "Keuangan", "", [L("Dokumen", "pajak-feb")]],
  ["02-24", "On Boarding PKL dan Internship Gelombang 1", "HR", "08:30 s.d 11:00", [L("Undangan", "onboard-1")]],
  ["03-03", "Kunjungan Sekolah Mitra SMK Negeri 1", "General", "10:00 s.d 12:00", []],
  ["03-06", "Pelatihan Excel Lanjutan untuk Pelaporan", "Training", "09:00 s.d 12:00", [L("Meeting", "excel-lanjut")]],
  ["03-11", "Rapat Evaluasi Kuartal I", "Keuangan", "13:30 s.d 15:30", [L("Dokumen", "evaluasi-q1")]],
  ["03-18", "Rapat Human Resource dan Kapten: Penempatan Peserta", "HR", "15:00 s.d 15:30", []],
  ["03-25", "Audit Internal Persediaan Barang", "Keuangan", "09:00 s.d 16:00", []],
  ["04-02", "Presentasi Progres Magang Bulan Pertama", "HR", "14:00 s.d 15:00", [L("Meeting", "progres-1")]],
  ["04-08", "Webinar Pengembangan Karier Generasi Muda", "Training", "19:00 s.d 20:30", [L("Undangan", "webinar-karier")]],
  ["04-15", "Rapat Perencanaan Anggaran Semester II", "Keuangan", "10:00 s.d 12:00", []],
  ["04-22", "Pemeriksaan Kelengkapan Administrasi Peserta", "HR", "", []],
  ["04-29", "Rapat Koordinasi Bulanan Divisi", "General", "15:00 s.d 16:00", []],
  ["05-05", "Pelatihan Komunikasi Profesional", "Training", "09:00 s.d 11:30", [L("Meeting", "komunikasi")]],
  ["05-12", "Penutupan Pembukuan Triwulan dan Rekonsiliasi Bank", "Keuangan", "13:00 s.d 17:00", [L("Dokumen", "rekon-bank")]],
  ["05-19", "Kunjungan Bimbingan Konseling BPVP Surabaya", "General", "09:30 s.d 11:30", []],
  ["05-26", "Rapat Human Resource: Kontrak Peserta Magang", "HR", "14:00 s.d 15:00", [L("Surat Tugas", "kontrak-magang")]],
  ["06-02", "Hari Lahir Pancasila: Upacara dan Doa Bersama", "General", "07:30 s.d 08:30", []],
  ["06-09", "Pelatihan Keselamatan dan Kesehatan Kerja", "Training", "09:00 s.d 12:00", [L("Undangan", "k3")]],
  ["06-16", "Laporan Keuangan Semester I: Penyusunan Draf", "Keuangan", "10:00 s.d 15:00", [L("Dokumen", "lap-s1-draf")]],
  ["06-23", "Penilaian Kinerja Peserta Magang Tengah Periode", "HR", "13:00 s.d 16:00", []],
  ["07-01", "Rapat Awal Semester II dan Penyelarasan Target", "General", "09:00 s.d 10:30", [L("Meeting", "awal-s2")]],
  ["07-07", "On Boarding PKL dan Internship Gelombang 2", "HR", "08:30 s.d 11:00", [L("Undangan", "onboard-2")]],
  ["07-14", "Pelatihan Pengenalan Sistem Akuntansi ICHIBOT", "Training", "13:00 s.d 16:00", [L("Meeting", "sistem-akuntansi")]],
  ["07-21", "Review Laporan Keuangan Juni 2026", "Keuangan", "14:00 s.d 15:30", []],
  ["08-04", "Rapat Persiapan Perayaan HUT Kemerdekaan", "General", "15:00 s.d 16:00", []],
  ["08-12", "Workshop Penulisan Laporan Magang", "Training", "09:00 s.d 12:00", [L("Undangan", "ws-laporan")]],
  ["08-18", "Rekonsiliasi Piutang dan Hutang Usaha", "Keuangan", "10:00 s.d 14:00", [L("Dokumen", "piutang-hutang")]],
  ["08-25", "Rapat Human Resource dan Kapten: Evaluasi Peserta", "HR", "15:00 s.d 15:30", []],
  ["09-02", "Rapat Evaluasi Kuartal III", "Keuangan", "13:30 s.d 15:30", [L("Dokumen", "evaluasi-q3")]],
  ["09-09", "Kunjungan Kampus Mitra Politeknik Negeri", "General", "10:00 s.d 12:00", []],
  ["09-16", "Pelatihan Analisis Data dengan Spreadsheet", "Training", "09:00 s.d 12:00", [L("Meeting", "analisis-data")]],
  ["09-23", "Seminar Karier dan Penempatan Alumni Magang", "HR", "13:00 s.d 15:00", [L("Undangan", "seminar-alumni")]],
  ["10-06", "Audit Eksternal: Pembukaan dan Penyerahan Dokumen", "Keuangan", "09:00 s.d 12:00", [L("Dokumen", "audit-eksternal")]],
  ["10-14", "Rapat Koordinasi Bulanan Divisi", "General", "15:00 s.d 16:00", []],
  ["10-21", "Pelatihan Presentasi Akhir untuk Peserta Magang", "Training", "13:00 s.d 15:30", [L("Meeting", "presentasi-akhir")]],
  ["10-28", "Rapat Human Resource dan Kapten: Persiapan Magang", "HR", "15:00 s.d 15:30", []],
  ["11-04", "Penyusunan Anggaran Tahun 2027", "Keuangan", "10:00 s.d 15:00", [L("Dokumen", "anggaran-2027")]],
  ["11-10", "Pelatihan Penutupan Buku Akhir Tahun", "Training", "09:00 s.d 12:00", [L("Undangan", "tutup-buku")]],
  ["11-17", "Presentasi Akhir Magang dan PKL: Laporan Akhir", "HR", "13:00 s.d 16:00", [L("Meeting", "presentasi-final")]],
];

const rows = data.map(([md, kegiatan, topic, jam, lampiran], i) => [
  `dummy-${String(i + 1).padStart(2, "0")}`, kegiatan, topic, `2026-${md}`, jam, JSON.stringify(lampiran),
]);

const conn = await mysql.createConnection(process.env.DATABASE_URL ?? "mysql://root@127.0.0.1:3306/ichibot_kanban");
await conn.query("DELETE FROM agenda WHERE id LIKE 'dummy-%'");
await conn.query("INSERT INTO agenda (id, kegiatan, topic, tanggal, jam, lampiran) VALUES ?", [rows]);
const [[{ n }]] = await conn.query("SELECT COUNT(*) n FROM agenda");
console.log(`Inserted ${rows.length} dummy rows. Total agenda: ${n}`);
await conn.end();
