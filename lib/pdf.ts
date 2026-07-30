import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Metric = { label: string; value: string };

type Options = {
  filename: string;
  title: string;
  subtitle?: string;
  metrics?: Metric[];
  headers: string[];
  rows: (string | number)[][];
};

export function downloadPdf({ filename, title, subtitle, metrics, headers, rows }: Options): void {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(16);
  doc.text(title, 14, 15);

  let y = 22;
  if (subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(subtitle, 14, y);
    y += 7;
  }

  if (metrics && metrics.length > 0) {
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(metrics.map((m) => `${m.label}: ${m.value}`).join("     "), 14, y);
    y += 8;
  }

  autoTable(doc, {
    startY: y,
    head: [headers],
    body: rows.map((row) => row.map(String)),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [51, 51, 51] },
  });

  doc.save(filename);
}
