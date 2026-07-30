import * as XLSX from "xlsx";

export function downloadXlsx(filename: string, headers: string[], rows: (string | number)[][]): void {
  const sheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Hoja1");
  XLSX.writeFile(workbook, filename);
}
