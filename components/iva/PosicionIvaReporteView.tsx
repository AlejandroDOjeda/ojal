"use client";

import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { parseISO } from "date-fns";
import { Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageShell, SectionCard, DataTable, DatePicker, FormField } from "@/components/app";
import { TIPO_COMPROBANTE_ITEMS } from "@/lib/opciones";
import { formatARS } from "@/components/facturas/types";
import { downloadXlsx } from "@/lib/excel";
import { downloadPdf } from "@/lib/pdf";
import type { FacturaIva, ResumenIva } from "./PosicionIvaReporteContainer";

// parseISO interpreta "YYYY-MM-DD" como medianoche local; new Date(string) lo
// interpreta como UTC, lo que en husos horarios negativos (Argentina) puede
// mostrar el día anterior.
const formatFecha = (fecha: string) => parseISO(fecha).toLocaleDateString("es-AR");

const formatNumero = (tipoId: number | null, punto: string | null, numero: string | null) => {
  const label = tipoId ? (TIPO_COMPROBANTE_ITEMS[String(tipoId)] ?? "") : "";
  if (!punto && !numero) return label || "—";
  return `${label} ${punto ?? "00000"}-${numero ?? "00000000"}`;
};

const sumColumn = (rows: { original: FacturaIva }[], field: "Subtotal" | "Iva10_5" | "Iva21" | "Total") =>
  rows.reduce((s, row) => s + (row.original[field] ?? 0), 0);

type Metric = { label: string; value: number; colorClass?: string };

function ResumenTira({ resumen, loading }: { resumen: ResumenIva; loading: boolean }) {
  const saldoColor =
    resumen.saldoTecnico > 0 ? "text-green-600 dark:text-green-400" :
    resumen.saldoTecnico < 0 ? "text-destructive" :
    "text-foreground";

  const saldoLabel =
    resumen.saldoTecnico > 0 ? "Saldo a favor" :
    resumen.saldoTecnico < 0 ? "Deuda" :
    "Saldo técnico";

  const metrics: Metric[] = [
    { label: "Crédito fiscal", value: resumen.creditoFiscal },
    { label: "Débito fiscal", value: resumen.debitoFiscal },
    { label: saldoLabel, value: resumen.saldoTecnico, colorClass: saldoColor },
  ];

  return (
    <SectionCard className="mb-4">
      <div className="grid grid-cols-3 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{m.label}</p>
            <p className={`text-xl font-bold tabular-nums ${m.colorClass ?? "text-foreground"} ${loading ? "opacity-40" : ""}`}>
              {loading ? "—" : (m.value > 0 && m.colorClass ? "+" : "") + formatARS(m.value)}
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

type Props = {
  facturas: FacturaIva[];
  resumen: ResumenIva;
  loading: boolean;
  error: string | null;
  fechaDesde: string;
  fechaHasta: string;
  onFechaDesdeChange: (value: string) => void;
  onFechaHastaChange: (value: string) => void;
};

export default function PosicionIvaReporteView({
  facturas, resumen, loading, error, fechaDesde, fechaHasta, onFechaDesdeChange, onFechaHastaChange,
}: Props) {
  const columns = useMemo<ColumnDef<FacturaIva, unknown>[]>(() => [
    {
      accessorKey: "Fecha",
      header: "Fecha",
      cell: ({ row }) => <span className="text-muted-foreground">{formatFecha(row.original.Fecha)}</span>,
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => (
        <span className={row.original.tipo === "compra" ? "text-foreground" : "text-green-600 dark:text-green-400"}>
          {row.original.tipo === "compra" ? "Compra" : "Venta"}
        </span>
      ),
    },
    {
      id: "comprobante",
      header: "Comprobante",
      accessorFn: (row) => `${TIPO_COMPROBANTE_ITEMS[String(row.Id_TipoComprobante)] ?? ""} ${row.PuntoVenta ?? ""}-${row.Numero ?? ""}`,
      cell: ({ row }) => <span className="text-muted-foreground">{formatNumero(row.original.Id_TipoComprobante, row.original.PuntoVenta, row.original.Numero)}</span>,
    },
    {
      id: "entidad",
      header: "Entidad",
      accessorFn: (row) => row.EntidadLegal?.RazonSocial ?? "",
      cell: ({ row }) => <span className="font-medium">{row.original.EntidadLegal?.RazonSocial ?? "—"}</span>,
    },
    {
      accessorKey: "Subtotal",
      header: "Neto",
      meta: { align: "right" },
      cell: ({ row }) => <span className="text-right block">{formatARS(row.original.Subtotal)}</span>,
      footer: ({ table }) => `Total: ${formatARS(sumColumn(table.getFilteredRowModel().rows, "Subtotal"))}`,
    },
    {
      accessorKey: "Iva10_5",
      header: "IVA 10.5%",
      meta: { align: "right" },
      cell: ({ row }) => <span className="text-right block">{formatARS(row.original.Iva10_5)}</span>,
      footer: ({ table }) => `Total: ${formatARS(sumColumn(table.getFilteredRowModel().rows, "Iva10_5"))}`,
    },
    {
      accessorKey: "Iva21",
      header: "IVA 21%",
      meta: { align: "right" },
      cell: ({ row }) => <span className="text-right block">{formatARS(row.original.Iva21)}</span>,
      footer: ({ table }) => `Total: ${formatARS(sumColumn(table.getFilteredRowModel().rows, "Iva21"))}`,
    },
    {
      accessorKey: "Total",
      header: "Bruto",
      meta: { align: "right" },
      cell: ({ row }) => <span className="font-medium text-right block">{formatARS(row.original.Total)}</span>,
      footer: ({ table }) => <span className="font-semibold">{`Total: ${formatARS(sumColumn(table.getFilteredRowModel().rows, "Total"))}`}</span>,
    },
  ], []);

  const buildExportData = () => {
    const headers = ["Fecha", "Tipo", "Comprobante", "Entidad", "Neto", "IVA 10.5%", "IVA 21%", "Total"];
    const rows = facturas.map((f) => [
      formatFecha(f.Fecha),
      f.tipo === "compra" ? "Compra" : "Venta",
      formatNumero(f.Id_TipoComprobante, f.PuntoVenta, f.Numero),
      f.EntidadLegal?.RazonSocial ?? "",
      f.Subtotal,
      f.Iva10_5,
      f.Iva21,
      f.Total,
    ]);
    return { headers, rows };
  };

  const handleExportExcel = () => {
    const { headers, rows } = buildExportData();
    downloadXlsx(`posicion-iva_${fechaDesde}_${fechaHasta}.xlsx`, headers, rows);
  };

  const handleExportPdf = () => {
    const { headers, rows } = buildExportData();
    downloadPdf({
      filename: `posicion-iva_${fechaDesde}_${fechaHasta}.pdf`,
      title: "Posición IVA",
      subtitle: `Período: ${formatFecha(fechaDesde)} — ${formatFecha(fechaHasta)}`,
      metrics: [
        { label: "Crédito fiscal", value: formatARS(resumen.creditoFiscal) },
        { label: "Débito fiscal", value: formatARS(resumen.debitoFiscal) },
        { label: "Saldo técnico", value: formatARS(resumen.saldoTecnico) },
      ],
      headers,
      rows,
    });
  };

  return (
    <PageShell
      title="Posición IVA"
      action={
        <DropdownMenu>
          <DropdownMenuTrigger
            className={buttonVariants({ variant: "outline" })}
            disabled={loading || facturas.length === 0}
          >
            <Download size={15} />
            Exportar
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportExcel}>Excel (.xlsx)</DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPdf}>PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    >
      {error && <div className="mb-3 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}

      <div className="flex items-end gap-3 mb-4">
        <FormField label="Desde" className="w-40">
          <DatePicker value={fechaDesde} onChange={onFechaDesdeChange} />
        </FormField>
        <FormField label="Hasta" className="w-40">
          <DatePicker value={fechaHasta} onChange={onFechaHastaChange} />
        </FormField>
      </div>

      <ResumenTira resumen={resumen} loading={loading} />

      <DataTable data={facturas} columns={columns} loading={loading} searchPlaceholder="Buscar por entidad, comprobante..." />
    </PageShell>
  );
}
