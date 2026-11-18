CREATE TABLE `agenda` (
	`id` varchar(64) NOT NULL,
	`kegiatan` varchar(500) NOT NULL DEFAULT '',
	`topic` varchar(100) NOT NULL DEFAULT '',
	`tanggal` varchar(10),
	`jam` varchar(40) NOT NULL DEFAULT '',
	`lampiran` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agenda_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `topic_colors` (
	`topic` varchar(100) NOT NULL,
	`color` varchar(7) NOT NULL,
	CONSTRAINT `topic_colors_topic` PRIMARY KEY(`topic`)
);
--> statement-breakpoint
CREATE INDEX `agenda_tanggal_idx` ON `agenda` (`tanggal`);