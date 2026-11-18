<h1 align="center">Annual Agenda</h1>

<p align="center"><strong>A year-at-a-glance agenda planner: one row per agenda, one column per day, saved to MySQL.</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/NEXT.JS-16-000000?style=flat-square&labelColor=555555" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/REACT-19-000000?style=flat-square&labelColor=555555" alt="React 19" />
  <img src="https://img.shields.io/badge/TAILWIND-4-0B6E75?style=flat-square&labelColor=555555" alt="Tailwind 4" />
  <img src="https://img.shields.io/badge/DRIZZLE-ORM-F4B728?style=flat-square&labelColor=555555" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/MYSQL-MARIADB-627EEA?style=flat-square&labelColor=555555" alt="MySQL / MariaDB" />
  <img src="https://img.shields.io/badge/TYPESCRIPT-STRICT-16A34A?style=flat-square&labelColor=555555" alt="TypeScript" />
</p>

---

Annual Agenda is built for **teams and interns who plan work across a whole year** and want to see every meeting, training and deadline on one screen instead of twelve separate month views.

> **Type an agenda, see it on the calendar, keep it in a database.**
>
> - Every agenda is one row; every day of the year is one column, Gantt style.
> - Click any day to see that week and month, then open any agenda for its full detail and links.
> - Attachments (invitations, meeting links, assignment letters) are stored as links on each agenda.
> - Export the year to Excel or PDF.
> - It does **not** upload files and it has **no login**: it is a single-workspace tool meant to run on a trusted network.

<img width="1440" alt="Annual Agenda: the full list layout with the year calendar" src="docs/screenshots/01-kalender.png" />

---

## Documentation

| Section | Where |
| --- | --- |
| What it is for | [What Makes Annual Agenda Special](#what-makes-annual-agenda-special) |
| Capabilities | [Features](#features) |
| Layout of the code | [Project Structure](#project-structure) |
| Running it | [Setup](#setup) |
| Data and endpoints | [Architecture](#architecture) |

---

## What Makes Annual Agenda Special

### Who This Is For

Meet Sari, a coordinator who keeps a spreadsheet of 60 meetings, trainings and deadlines for her internship cohort. When someone asks "what is happening in the week of 9 November?", she scrolls, filters, and still misses the invitation link that lives in a chat thread.

### The Problem

- **Spreadsheets hide time**: a table of dates cannot show that three things collide on the same Thursday.
- **Calendars hide the plan**: month views are good for today, poor for "what does Q4 look like?".
- **Links get lost**: the invitation, the meeting URL and the assignment letter live in different places from the agenda itself.
- **Slow editing kills adoption**: if typing a new row lags, people go back to the spreadsheet.

**How might we keep the whole year on one screen, make editing instant, and keep every link attached to its agenda?**

### The Solution

**1. One grid for the year.** Rows are agendas, columns are the 365 days. A coloured mark sits on the day of each agenda, coloured by topic.

**2. Type where you look.** Click an empty cell on a date, or type in the blank row, and the agenda is created. No form is required in the default layout.

**3. Week and month at a click.** Click a day header to see that week and that month; click an agenda to open its full detail with every attachment, and open or copy each link.

**4. Saved without a Save button.** Changes are written to MySQL in the background, with a visible status and a retry if the database is unreachable.

---

## Screenshots

<img width="1440" alt="Week and month agenda dialog" src="docs/screenshots/02-agenda-minggu.png" />

Clicking a day opens the agenda of that week and month. Each item opens its detail; **Ubah** edits it.

<img width="1440" alt="Agenda detail with attachments" src="docs/screenshots/03-detail-agenda.png" />

The detail view shows the topic, relative date ("10 hari lalu"), the long date, the time, and every attachment as a link that can be opened in a new tab or copied.

<img width="1440" alt="View menu with layout thumbnails" src="docs/screenshots/04-menu-tampilan.png" />

The **Tampilan** menu switches layouts (with a thumbnail of each), row density and day width. Choices are remembered per browser.

<img width="1440" alt="Calendar-only layout with the agenda list panel" src="docs/screenshots/05-kalender-penuh.png" />

The calendar-only layout hides the agenda columns for more room; the **Daftar agenda** panel brings the full list back on demand.

<img width="1440" alt="Add agenda form" src="docs/screenshots/06-form-agenda.png" />

In calendar-only layout, **Tambah agenda** opens a side form with a date picker, a time-range picker and an attachments dialog.

---

## Features

- **Year Grid**: 12 months, 365 day columns, weekends shaded, today highlighted with a badge, month names that stay in view while scrolling.
- **Month Rail**: twelve month tabs with the number of agendas in each; the active month follows your scroll and the current month is marked.
- **Topic Chips**: each topic has a colour you can change and a count; click a topic to highlight only its agendas.
- **Inline Editing**: type directly in the Kegiatan and Topik cells; Enter or leaving the cell commits, Esc cancels.
- **Day, Week and Month Dialog**: click a day header or a coloured mark to list that week and month; click an item for its full detail.
- **Agenda Detail**: topic, relative and long date, time, and all attachments with open and copy actions.
- **Interactive Pickers**: calendar date picker, start and end time picker, and an attachments dialog (type plus URL; only `http` and `https` are accepted).
- **Two Layouts**: *Lengkap* (all columns plus calendar) and *Kalender penuh* (calendar only, with an agenda list panel and a side form).
- **Search**: filters the grid across name, topic, date, time and attachments.
- **Export**: Excel (`.xlsx`, via ExcelJS) and PDF (via jsPDF and autotable) for the selected year.
- **Database Sync**: debounced, serialised writes with status (loading, saving, saved, failed) and a retry banner; the existing browser data is imported once if the database is empty.
- **Fast on Large Years**: horizontal windowing, memoised rows and a single delegated click handler keep a keystroke at roughly 8 to 15 ms (down from about 75 ms).
- **Accessible Basics**: visible keyboard focus, dialogs trap focus and restore it, `prefers-reduced-motion` respected, labelled controls.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, `cacheComponents`), React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 with design tokens in `@theme`; Schibsted Grotesk via `next/font` |
| Database | MySQL or MariaDB through `mysql2` |
| ORM and migrations | Drizzle ORM and drizzle-kit |
| Export | ExcelJS, jsPDF, jspdf-autotable (loaded on demand) |
| Tooling | pnpm, ESLint |

---

## Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Agenda (client)
    participant API as Route Handlers
    participant DB as MySQL / MariaDB

    U->>UI: Type in a cell, pick a date, add a link
    UI->>UI: Update local state (instant)
    UI->>UI: Wait 350 ms, diff against last saved snapshot
    UI->>API: PUT /api/agenda/:id (queued, one at a time)
    API->>API: Validate id, lengths, date, http(s) links, colour
    API->>DB: INSERT ... ON DUPLICATE KEY UPDATE
    DB-->>API: ok
    API-->>UI: 200
    UI-->>U: Status shows "Tersimpan"
```

```mermaid
graph TD
    A[Loading] -->|fetch ok| B[Ready]
    A -->|unreachable| C[Error banner]
    C -->|Coba lagi| A
    B -->|edit| D[Saving]
    D -->|ok| B
    D -->|failed| E[Save error banner]
    E -->|Coba lagi| D
    style A fill:#edf1ef,stroke:#66737d
    style B fill:#e2f0f1,stroke:#0b6e75
    style C fill:#fdeeed,stroke:#b42318
    style E fill:#fdeeed,stroke:#b42318
```

### HTTP API

| Method and path | Purpose |
| --- | --- |
| `GET /api/agenda` | All agendas and topic colours |
| `PUT /api/agenda/[id]` | Create or update one agenda (upsert) |
| `DELETE /api/agenda/[id]` | Delete one agenda |
| `PUT /api/colors` | Set the colour of a topic |
| `POST /api/import` | One-time import of legacy browser data; only when the database is empty |

Database outages and authentication failures are reported as `503` with a readable message instead of a generic `500`.

### Data Model

| Table | Columns |
| --- | --- |
| `agenda` | `id`, `kegiatan`, `topic`, `tanggal` (`YYYY-MM-DD`, nullable), `jam`, `lampiran` (JSON text), `created_at`, `updated_at`; index on `tanggal` |
| `topic_colors` | `topic` (primary key), `color` (`#rrggbb`) |

---

## Project Structure

```
app/
  api/            Route handlers (agenda, colors, import)
  db/             Drizzle schema, pooled connection, input validation
  lib/            Agenda model, view preferences, API client, xlsx/PDF export
  ui/             Agenda orchestrator, table, dialogs, pickers, menus, icons
  globals.css     Design tokens and component classes
drizzle/          Generated SQL migrations
docs/screenshots/ Images used in this README
```

---

## Setup

### Requirements

- Node.js 20.9 or newer
- pnpm
- A running MySQL or MariaDB server

### App Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Create an empty database (utf8mb4)
mysql -u root -p -e "CREATE DATABASE ichibot_kanban CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"

# 3. Configure the connection
cp .env.example .env.local
#    then edit DATABASE_URL in .env.local

# 4. Run (tables are created automatically on the first request)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Configuration

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | `mysql://USER:PASSWORD@HOST:PORT/DATABASE`. Percent-encode special characters in the password (for example `@` becomes `%40`). |

### Useful Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` and `pnpm start` | Production build and server |
| `pnpm lint` | ESLint |
| `pnpm db:generate` | Generate a migration after editing `app/db/schema.ts` |
| `pnpm db:migrate` | Apply migrations manually |
| `pnpm db:studio` | Open Drizzle Studio |

> **Two traps worth knowing.** Do not run `pnpm build` while `pnpm dev` is running in the same folder: both write to `.next`, and the dev server will return errors until it is restarted. And never commit `.env.local`; only `.env.example` (without a real password) belongs in git.

---

## How It Works

```
Typing in a cell
  -> local cell state (no table re-render per keystroke)
  -> Enter / blur commits to the page state
  -> 350 ms debounce, diff against the last saved snapshot
  -> PUT / DELETE queued one at a time
  -> status: Menyimpan -> Tersimpan   (or "Coba lagi" on failure)

Opening a day
  -> click header or coloured mark
  -> dialog lists the week (Monday to Sunday, cut at month edges) and the whole month
  -> click an item -> agenda detail with attachments
```

### Validation on the Server

| Field | Rule |
| --- | --- |
| `id` | 1 to 64 characters of letters, digits, `_` and `-` |
| `kegiatan`, `topic`, `jam` | Length limits (500, 100, 40) |
| Date | `dd/mm/yyyy` that exists on the calendar (31/02 is rejected) |
| Attachments | `http` or `https` URLs only |
| Colour | `#rrggbb` |

---

## Build Checklist

- [x] Year grid with weekends, today and month labels
- [x] Inline editing and click-to-add on empty cells
- [x] Week and month dialog with agenda detail and attachment links
- [x] Date, time and attachment pickers
- [x] Two layouts, density and day-width options
- [x] MySQL / MariaDB storage with Drizzle migrations
- [x] Excel and PDF export
- [x] Keyboard focus, focus trap in dialogs, reduced-motion support
- [ ] Uploading files as attachments (links only today)
- [ ] User accounts and per-user agendas
- [ ] Automated test suite in the repository (the behaviour was verified with browser scripts that are not committed)

**One limitation worth naming.** There is no authentication: anyone who can reach the server can read and change every agenda, so run it on a trusted network or put it behind your own access control.

---

## Project Info

| | |
| --- | --- |
| Context | Internship project at Ichibot |
| Status | Working application, single workspace |
| License | None chosen yet |

> **Plan the year once, then just look at it.**
