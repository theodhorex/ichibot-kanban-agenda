-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 21, 2026 at 09:14 AM
-- Server version: 13.0.2-MariaDB
-- PHP Version: 8.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ichibot_kanban`
--

-- --------------------------------------------------------

--
-- Table structure for table `agenda`
--

CREATE TABLE `agenda` (
  `id` varchar(64) NOT NULL,
  `kegiatan` varchar(500) NOT NULL DEFAULT '',
  `topic` varchar(100) NOT NULL DEFAULT '',
  `tanggal` varchar(10) DEFAULT NULL,
  `jam` varchar(40) NOT NULL DEFAULT '',
  `lampiran` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `agenda`
--

INSERT INTO `agenda` (`id`, `kegiatan`, `topic`, `tanggal`, `jam`, `lampiran`, `created_at`, `updated_at`) VALUES
('amwmnof5dev3a4y', 'Presentasi Akhir Magang dan PKL: Laporan Akhir', 'HR', '2026-11-13', '', '[]', '2026-11-18 22:08:59', '2026-11-18 22:08:59'),
('amwmnof5djf9mco', 'Rapat Human Resource dan Kapten: Persiapan Magang', 'HR', '2026-11-07', '15:00 s.d 15:30', '[]', '2026-11-18 22:08:59', '2026-11-18 22:08:59'),
('amwmnof5dk9lbq7', 'laporan lol 2', 'General', '2026-11-27', '19:00 s.d 22:30', '[]', '2026-11-18 22:08:59', '2026-11-18 22:08:59'),
('amwmnof5dp28cqy', 'On Boarding PKL & Internships', 'HR', '2026-11-09', '', '[]', '2026-11-18 22:08:59', '2026-11-18 22:08:59'),
('amwmnof5dsbi28d', 'Laporan perkembangan progress', 'General', '2026-11-27', '09:00 s.d 09:30', '[]', '2026-11-18 22:08:59', '2026-11-18 22:08:59'),
('amwmnof5dw5rnx7', 'Kunjungan Bimbingan Konseling BPVP Surabaya', 'General', '2026-11-12', '', '[]', '2026-11-18 22:08:59', '2026-11-18 22:08:59'),
('amwmnxo2cp3si4k', 'laporan lol okoko', 'General', '2026-11-27', '21:00', '[]', '2026-11-18 22:08:59', '2026-11-18 22:08:59'),
('amwmodismu9zgm1', 'asd', '', NULL, '', '[]', '2026-11-18 22:10:45', '2026-11-18 22:10:45'),
('amwmodot6g8ed32', 'asdas', '', NULL, '', '[]', '2026-11-18 22:10:50', '2026-11-18 22:10:50'),
('amwmp72tphh68ai', 'okokokok', 'HR', '2026-11-18', '09:20', '[]', '2026-11-18 22:33:41', '2026-11-18 22:33:51'),
('amwq1srjegjf685', '', '', '2026-01-05', '', '[]', '2026-11-21 06:49:47', '2026-11-21 06:49:47'),
('amwq3vtj408wm0i', 'dsfsdf', 'General', '2026-11-17', '', '[]', '2026-11-21 07:48:24', '2026-11-21 07:48:24'),
('amwq3wpjw2pn8cs', 'TWQ6', 'General', '2026-11-16', '', '[]', '2026-11-21 07:49:03', '2026-11-21 07:49:03'),
('amwq4ors0kcya3u', 'Test agenda', 'HR', '2026-11-19', '09:00', '[]', '2026-11-21 08:10:53', '2026-11-21 08:11:15'),
('amwq51hggbw6dky', 'asdasd', 'HR', '2026-11-24', '09:00', '[]', '2026-11-21 08:20:36', '2026-11-21 08:20:45'),
('amwq521n8fp5tdq', 'asdasdasd tesst123123123123', 'General', '2026-11-25', '09:00', '[]', '2026-11-21 08:21:14', '2026-11-21 08:21:14'),
('amwq54ssvp5aec2', 'test123123123123123123123', 'Keuangan', '2026-11-29', '09:00', '[]', '2026-11-21 08:23:19', '2026-11-21 08:23:19'),
('amwq5dkuvbupx04', 'test agenda okok123', '', NULL, '', '[]', '2026-11-21 08:29:57', '2026-11-21 08:29:57'),
('amwq5dmaga71np3', 'sdfsdfsdf', 'Training', '2026-11-28', '', '[]', '2026-11-21 08:29:59', '2026-11-21 08:32:10'),
('amwq5dyl1mkhilq', 'testestst', 'Keuangan', '2026-11-21', '09:00', '[]', '2026-11-21 08:30:18', '2026-11-21 08:30:25'),
('amwq5ic5vegj8dv', 'testst', '', '2026-11-30', '', '[]', '2026-11-21 08:33:39', '2026-11-21 08:33:50'),
('amwq5mj4dpgubsw', 'agenda 123123123', '', '2026-11-16', '', '[]', '2026-11-21 08:36:55', '2026-11-21 08:37:19'),
('amwq5mkvwlqulse', 'agenda 123123123', 'HR', '2026-11-16', '', '[]', '2026-11-21 08:36:57', '2026-11-21 08:37:08'),
('dummy-01', 'Kick-off Tahun 2026 dan Penetapan Target', 'General', '2026-01-05', '09:00 s.d 10:30', '[{\"type\":\"Meeting\",\"url\":\"https://example.com/kickoff-2026\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-02', 'Rapat Human Resource: Rekrutmen Magang Semester Genap', 'HR', '2026-01-08', '13:00 s.d 14:00', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-03', 'Pelatihan Dasar Akuntansi untuk Peserta Baru', 'Training', '2026-01-13', '09:00 s.d 12:00', '[{\"type\":\"Undangan\",\"url\":\"https://example.com/undangan-akuntansi\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-04', 'Review Laporan Keuangan Desember 2025', 'Keuangan', '2026-01-20', '14:00 s.d 15:30', '[{\"type\":\"Dokumen\",\"url\":\"https://example.com/lap-des-2025\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-05', 'Sosialisasi SOP Kerja Terbaru', 'General', '2026-01-27', '10:00', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-06', 'Seleksi Wawancara Calon Peserta Magang', 'HR', '2026-02-03', '09:00 s.d 15:00', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-07', 'Workshop Kanban dan Manajemen Tugas', 'Training', '2026-02-10', '13:00 s.d 16:00', '[{\"type\":\"Meeting\",\"url\":\"https://example.com/ws-kanban\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-08', 'Rapat Koordinasi Bulanan Divisi', 'General', '2026-02-12', '15:00 s.d 16:00', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-09', 'Penyampaian Tenggat Laporan Pajak Bulanan', 'Keuangan', '2026-02-17', '', '[{\"type\":\"Dokumen\",\"url\":\"https://example.com/pajak-feb\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-10', 'On Boarding PKL dan Internship Gelombang 1', 'HR', '2026-02-24', '08:30 s.d 11:00', '[{\"type\":\"Undangan\",\"url\":\"https://example.com/onboard-1\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-11', 'Kunjungan Sekolah Mitra SMK Negeri 1', 'General', '2026-03-03', '10:00 s.d 12:00', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-12', 'Pelatihan Excel Lanjutan untuk Pelaporan', 'Training', '2026-03-06', '09:00 s.d 12:00', '[{\"type\":\"Meeting\",\"url\":\"https://example.com/excel-lanjut\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-13', 'Rapat Evaluasi Kuartal I', 'Keuangan', '2026-03-11', '13:30 s.d 15:30', '[{\"type\":\"Dokumen\",\"url\":\"https://example.com/evaluasi-q1\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-14', 'Rapat Human Resource dan Kapten: Penempatan Peserta', 'HR', '2026-03-18', '15:00 s.d 15:30', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-15', 'Audit Internal Persediaan Barang', 'Keuangan', '2026-03-25', '09:00 s.d 16:00', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-16', 'Presentasi Progres Magang Bulan Pertama', 'HR', '2026-04-02', '14:00 s.d 15:00', '[{\"type\":\"Meeting\",\"url\":\"https://example.com/progres-1\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-17', 'Webinar Pengembangan Karier Generasi Muda', 'Training', '2026-04-08', '19:00 s.d 20:30', '[{\"type\":\"Undangan\",\"url\":\"https://example.com/webinar-karier\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-18', 'Rapat Perencanaan Anggaran Semester II', 'Keuangan', '2026-04-15', '10:00 s.d 12:00', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-19', 'Pemeriksaan Kelengkapan Administrasi Peserta', 'HR', '2026-04-22', '', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-20', 'Rapat Koordinasi Bulanan Divisi', 'General', '2026-04-29', '15:00 s.d 16:00', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-21', 'Pelatihan Komunikasi Profesional', 'Training', '2026-05-05', '09:00 s.d 11:30', '[{\"type\":\"Meeting\",\"url\":\"https://example.com/komunikasi\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-22', 'Penutupan Pembukuan Triwulan dan Rekonsiliasi Bank', 'Keuangan', '2026-05-12', '13:00 s.d 17:00', '[{\"type\":\"Dokumen\",\"url\":\"https://example.com/rekon-bank\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-23', 'Kunjungan Bimbingan Konseling BPVP Surabaya', 'General', '2026-05-19', '09:30 s.d 11:30', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-24', 'Rapat Human Resource: Kontrak Peserta Magang', 'HR', '2026-05-26', '14:00 s.d 15:00', '[{\"type\":\"Surat Tugas\",\"url\":\"https://example.com/kontrak-magang\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-25', 'Hari Lahir Pancasila: Upacara dan Doa Bersama', 'General', '2026-06-02', '07:30 s.d 08:30', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-26', 'Pelatihan Keselamatan dan Kesehatan Kerja', 'Training', '2026-06-09', '09:00 s.d 12:00', '[{\"type\":\"Undangan\",\"url\":\"https://example.com/k3\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-27', 'Laporan Keuangan Semester I: Penyusunan Draf', 'Keuangan', '2026-06-16', '10:00 s.d 15:00', '[{\"type\":\"Dokumen\",\"url\":\"https://example.com/lap-s1-draf\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-28', 'Penilaian Kinerja Peserta Magang Tengah Periode', 'HR', '2026-06-23', '13:00 s.d 16:00', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-29', 'Rapat Awal Semester II dan Penyelarasan Target', 'General', '2026-07-01', '09:00 s.d 10:30', '[{\"type\":\"Meeting\",\"url\":\"https://example.com/awal-s2\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-30', 'On Boarding PKL dan Internship Gelombang 2', 'HR', '2026-07-07', '08:30 s.d 11:00', '[{\"type\":\"Undangan\",\"url\":\"https://example.com/onboard-2\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-31', 'Pelatihan Pengenalan Sistem Akuntansi ICHIBOT', 'Training', '2026-07-14', '13:00 s.d 16:00', '[{\"type\":\"Meeting\",\"url\":\"https://example.com/sistem-akuntansi\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-32', 'Review Laporan Keuangan Juni 2026', 'Keuangan', '2026-07-21', '14:00 s.d 15:30', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-33', 'Rapat Persiapan Perayaan HUT Kemerdekaan', 'General', '2026-08-04', '15:00 s.d 16:00', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-34', 'Workshop Penulisan Laporan Magang', 'Training', '2026-08-12', '09:00 s.d 12:00', '[{\"type\":\"Undangan\",\"url\":\"https://example.com/ws-laporan\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-35', 'Rekonsiliasi Piutang dan Hutang Usaha', 'Keuangan', '2026-08-18', '10:00 s.d 14:00', '[{\"type\":\"Dokumen\",\"url\":\"https://example.com/piutang-hutang\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-36', 'Rapat Human Resource dan Kapten: Evaluasi Peserta', 'HR', '2026-08-25', '15:00 s.d 15:30', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-37', 'Rapat Evaluasi Kuartal III', 'Keuangan', '2026-09-02', '13:30 s.d 15:30', '[{\"type\":\"Dokumen\",\"url\":\"https://example.com/evaluasi-q3\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-38', 'Kunjungan Kampus Mitra Politeknik Negeri', 'General', '2026-09-09', '10:00 s.d 12:00', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-39', 'Pelatihan Analisis Data dengan Spreadsheet', 'Training', '2026-09-16', '09:00 s.d 12:00', '[{\"type\":\"Meeting\",\"url\":\"https://example.com/analisis-data\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-40', 'Seminar Karier dan Penempatan Alumni Magang', 'HR', '2026-09-23', '13:00 s.d 15:00', '[{\"type\":\"Undangan\",\"url\":\"https://example.com/seminar-alumni\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-41', 'Audit Eksternal: Pembukaan dan Penyerahan Dokumen', 'Keuangan', '2026-10-06', '09:00 s.d 12:00', '[{\"type\":\"Dokumen\",\"url\":\"https://example.com/audit-eksternal\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-42', 'Rapat Koordinasi Bulanan Divisi', 'General', '2026-10-14', '15:00 s.d 16:00', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-43', 'Pelatihan Presentasi Akhir untuk Peserta Magang', 'Training', '2026-10-21', '13:00 s.d 15:30', '[{\"type\":\"Meeting\",\"url\":\"https://example.com/presentasi-akhir\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-44', 'Rapat Human Resource dan Kapten: Persiapan Magang', 'HR', '2026-10-28', '15:00 s.d 15:30', '[]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-45', 'Penyusunan Anggaran Tahun 2027', 'Keuangan', '2026-11-04', '10:00 s.d 15:00', '[{\"type\":\"Dokumen\",\"url\":\"https://example.com/anggaran-2027\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-46', 'Pelatihan Penutupan Buku Akhir Tahun', 'Training', '2026-11-10', '09:00 s.d 12:00', '[{\"type\":\"Undangan\",\"url\":\"https://example.com/tutup-buku\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02'),
('dummy-47', 'Presentasi Akhir Magang dan PKL: Laporan Akhir', 'HR', '2026-11-17', '13:00 s.d 16:00', '[{\"type\":\"Meeting\",\"url\":\"https://example.com/presentasi-final\"}]', '2026-11-21 06:46:02', '2026-11-21 06:46:02');

-- --------------------------------------------------------

--
-- Table structure for table `topic_colors`
--

CREATE TABLE `topic_colors` (
  `topic` varchar(100) NOT NULL,
  `color` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `topic_colors`
--

INSERT INTO `topic_colors` (`topic`, `color`) VALUES
('General', '#3d85c6'),
('HR', '#ed7a07');

-- --------------------------------------------------------

--
-- Table structure for table `__drizzle_migrations`
--

CREATE TABLE `__drizzle_migrations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hash` text NOT NULL,
  `created_at` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `__drizzle_migrations`
--

INSERT INTO `__drizzle_migrations` (`id`, `hash`, `created_at`) VALUES
(1, '91eb3763137ec9a1969d39e79493f1c1f3a662aa5615dbeb7b1827ed0d7da41a', 1795039449548);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agenda`
--
ALTER TABLE `agenda`
  ADD PRIMARY KEY (`id`),
  ADD KEY `agenda_tanggal_idx` (`tanggal`);

--
-- Indexes for table `topic_colors`
--
ALTER TABLE `topic_colors`
  ADD PRIMARY KEY (`topic`);

--
-- Indexes for table `__drizzle_migrations`
--
ALTER TABLE `__drizzle_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `__drizzle_migrations`
--
ALTER TABLE `__drizzle_migrations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
