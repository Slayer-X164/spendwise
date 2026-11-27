import { createCsv } from "@/lib/downloadCsv";
import type { ExportDocument, ReportChart, ReportFormat } from "./data";

const printableNumber = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

async function createPdf(report: ExportDocument) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ format: "a4", unit: "mm", compress: true });
  const margin = 16;
  const width = pdf.internal.pageSize.getWidth() - 2 * margin;
  const bottom = pdf.internal.pageSize.getHeight() - 18;
  let y = 18;

  function newPage() {
    pdf.addPage();
    y = 18;
  }

  function drawChart(chart: ReportChart) {
    if (!chart.points.length) return;
    if (chart.series.length > 1) {
      let x = margin;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor("#475569");
      for (const { label, color } of chart.series) {
        pdf.setFillColor(color);
        pdf.rect(x, y, 2.5, 2.5, "F");
        pdf.text(label, x + 4, y + 2.5);
        x += pdf.getTextWidth(label) + 10;
      }
      y += 8;
    }
    const height = 26;
    const baseline = y + height;
    const max = Math.max(1, ...chart.points.flatMap(({ values }) => values));
    const column = width / chart.points.length;
    const bar = Math.min(7, column / (chart.series.length + 2));
    pdf.setFontSize(8);
    pdf.setTextColor("#475569");
    pdf.setDrawColor("#cbd5e1");
    pdf.line(margin, baseline, margin + width, baseline);
    chart.points.forEach(({ label, values }, index) => {
      const center = margin + (index + 0.5) * column;
      values.forEach((value, series) => {
        const amount = value / max * height;
        pdf.setFillColor(chart.series[series].color);
        pdf.rect(center + (series - values.length / 2) * bar, baseline - amount, bar - 0.5, amount, "F");
      });
      pdf.text(label, center, baseline + 4, { align: "center", maxWidth: column - 1 });
    });
    y = baseline + 10;
  }

  pdf.setProperties({ title: report.title, author: "SpendWise" });
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor("#1257ff");
  pdf.setFontSize(12);
  pdf.text("SpendWise", margin, y);
  pdf.setTextColor("#171717");
  pdf.setFontSize(22);
  pdf.text(report.title, margin, y + 10);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor("#475569");
  pdf.text(report.range.replaceAll(/[\u2013\u2014]/g, "-"), margin, y + 16);
  pdf.text(report.source, margin, y + 22, { maxWidth: width });
  y += 33;

  for (const section of report.sections) {
    const narrow = width * 0.66 / Math.max(1, section.columns.length - 1);
    const widths = section.columns.map((_, index) => index ? narrow : width * 0.34);
    const rowWidth = widths.reduce((sum, value) => sum + value, 0);

    function drawHeading(continued = false) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor("#171717");
      pdf.text(section.title + (continued ? " (continued)" : ""), margin, y);
      y += 6;
    }

    function rowLines(row: (string | number)[]) {
      return row.map((value, index) => pdf.splitTextToSize(typeof value === "number" ? printableNumber.format(value) : value, widths[index] - 4) as string[]);
    }

    function drawRow(lines: string[][], header = false) {
      const height = Math.max(7, Math.max(...lines.map((cell) => cell.length)) * 4 + 3);
      pdf.setFillColor(header ? "#eaf0ff" : "#f5f7fa");
      pdf.rect(margin, y, rowWidth, height - 0.4, "F");
      pdf.setFont("helvetica", header ? "bold" : "normal");
      pdf.setTextColor("#262626");
      pdf.setFontSize(9);
      let x = margin + 2;
      for (const [index, cell] of lines.entries()) {
        pdf.text(cell, x, y + 4.5);
        x += widths[index];
      }
      y += height;
    }

    if (y + (section.chart ? 62 : 22) > bottom) newPage();
    drawHeading();
    if (section.chart) drawChart(section.chart);
    pdf.setFontSize(9);
    const heading = rowLines(section.columns);
    drawRow(heading, true);
    for (const row of section.rows) {
      const lines = rowLines(row);
      const height = Math.max(7, Math.max(...lines.map((cell) => cell.length)) * 4 + 3);
      if (y + height > bottom) {
        newPage();
        drawHeading(true);
        drawRow(heading, true);
      }
      drawRow(lines);
    }
    if (!section.rows.length) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text("No entries for this period.", margin, y + 5);
      y += 8;
    }
    y += 10;
  }

  const pages = pdf.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    pdf.setPage(page);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor("#475569");
    pdf.text(`Generated ${report.date} | SpendWise`, margin, bottom + 7);
    pdf.text(`Page ${page} of ${pages}`, margin + width, bottom + 7, { align: "right" });
  }
  return pdf.output("blob");
}

export async function getReportFile(report: ExportDocument, format: ReportFormat) {
  if (format === "PDF") return createPdf(report);
  if (format === "CSV") {
    return createCsv([
      [report.title], ["Period", report.range], ["Generated", report.date], ["Source", report.source],
      ...report.sections.flatMap(({ title, columns, rows }) => [[], [title], columns, ...rows]),
    ]);
  }

  const { default: writeWorkbook } = await import("write-excel-file/browser");
  return writeWorkbook([
    { sheet: "Report details", columns: [{ width: 22 }, { width: 78 }], data: [
      ["Report", report.title], ["Period", report.range], ["Generated", report.date], ["Source", report.source],
    ] },
    ...report.sections.map(({ title, columns, rows }) => ({
      sheet: title,
      columns: columns.map((name, index) => ({ width: index === 0 ? 32 : Math.max(16, name.length + 3) })),
      data: [columns.map((value) => ({ value, fontWeight: "bold" as const, backgroundColor: "#eaf0ff" })), ...rows],
    })),
  ]).toBlob();
}
