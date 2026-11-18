import { dmyToIso, type AgendaRow } from "./agenda-data";

const HEAD = ["No", "Kegiatan", "Topik", "Tanggal", "Jam", "Lampiran"];

/** Baris yang ikut diekspor: terisi, dan (bila bertanggal) jatuh di tahun yang dipilih. */
function exportRows(rows: AgendaRow[], year: number) {
  return rows
    .filter((r) => r.kegiatan.trim() || r.date.trim())
    .filter((r) => {
      const iso = dmyToIso(r.date);
      return !iso || iso.startsWith(`${year}-`);
    })
    .map((r, i) => [
      String(i + 1),
      r.kegiatan,
      r.topic,
      r.date,
      r.jam,
      r.lampiran.map((a) => `${a.type}: ${a.url}`).join("\n"),
    ]);
}

function download(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function exportXlsx(rows: AgendaRow[], year: number) {
  const mod = await import("exceljs");
  const ExcelJS = mod.default ?? mod;
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(`Agenda ${year}`, { views: [{ state: "frozen", ySplit: 2 }] });
  ws.mergeCells("A1:F1");
  ws.getCell("A1").value = `ANNUAL AGENDA ${year}`;
  ws.getCell("A1").font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
  ws.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0B6E75" } };
  ws.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(1).height = 24;

  const head = ws.addRow(HEAD);
  head.font = { bold: true };
  head.eachCell((c) => {
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2F0F1" } };
    c.border = { bottom: { style: "medium" } };
  });
  for (const r of exportRows(rows, year)) ws.addRow(r);

  [6, 52, 16, 14, 18, 56].forEach((w, i) => (ws.getColumn(i + 1).width = w));
  ws.eachRow((row, n) => {
    if (n > 2) row.alignment = { vertical: "top", wrapText: true };
  });

  const buf = await wb.xlsx.writeBuffer();
  download(
    new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `agenda-${year}.xlsx`,
  );
}

export async function exportPdf(rows: AgendaRow[], year: number) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  doc.setFontSize(16);
  doc.text(`Annual Agenda ${year}`, 40, 40);
  autoTable(doc, {
    head: [HEAD],
    body: exportRows(rows, year),
    startY: 56,
    styles: { fontSize: 9, cellPadding: 4, valign: "top" },
    headStyles: { fillColor: [11, 110, 117] },
    columnStyles: { 0: { cellWidth: 28 }, 1: { cellWidth: 250 }, 2: { cellWidth: 70 }, 3: { cellWidth: 65 }, 4: { cellWidth: 90 } },
    margin: { left: 40, right: 40 },
  });
  doc.save(`agenda-${year}.pdf`);
}
