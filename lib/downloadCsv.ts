import { downloadFile } from "./downloadFile";

function csvCell(value: string | number) {
  if (typeof value === "number") return String(value);
  const safeValue = /^\s*[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

export function createCsv(rows: (string | number)[][]) {
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  return new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
}

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  downloadFile(filename, createCsv(rows));
}
