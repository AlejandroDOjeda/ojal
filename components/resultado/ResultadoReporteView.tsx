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
import { formatARS } from "@/components/facturas/types";
import { downloadXlsx } from "@/lib/excel";
import { downloadPdf } from "@/lib/pdf";
import type { GastoCategoria, ResultadoResumen } from "./ResultadoReporteContainer";

// parseISO interpreta "YYYY-MM-DD" como medianoche local; new Date(string) lo
// interpreta como UTC, lo que en husos horarios negativos (Argentina) puede
// mostrar el día anterior.
const formatFecha = (fecha: string) => parseISO(fecha).toLocaleDateString("es-AR");

type Metric = { label: string; value: number; colorClass?: string };

function ResumenTira({ resumen, loading }: { resumen: ResultadoResumen; loading: boolean }) {
  const resultadoColor =
    resumen.resultado > 0 ? "text-green-600 dark:text-green-400" :
    resumen.resultado < 0 ? "text-destructive" :
    "text-foreground";

  const metrics: Metric[] = [
    { label: "Ingresos", value: resumen.ingresos },
    { label: "Gastos", value: resumen.totalGastos },
    { label: "Resultado", value: resumen.resultado, colorClass: resultadoColor },
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
  gastos: GastoCategoria[];
  resumen: ResultadoResumen;
  loading: boolean;
  error: string | null;
  fechaDesde: string;
  fechaHasta: string;
  onFechaDesdeChange: (value: string) => void;
  onFechaHastaChange: (value: string) => void;
};

export default function ResultadoReporteView({
  gastos, resumen, loading, error, fechaDesde, fechaHasta, onFechaDesdeChange, onFechaHastaChange,
}: Props) {
  const columns = useMemo<ColumnDef<GastoCategoria, unknown>[]>(() => [
    {
      accessorKey: "nombre",
      header: "Categoría",
      cell: ({ row }) => <span className="font-medium">{row.original.nombre}</span>,
    },
    {
      accessorKey: "monto",
      header: "Monto",
      meta: { align: "right" },
      cell: ({ row }) => <span className="text-right block">{formatARS(row.original.monto)}</span>,
      footer: ({ table }) => (
        <span className="font-semibold">
          {`Total: ${formatARS(table.getFilteredRowModel().rows.reduce((s, r) => s + r.original.monto, 0))}`}
        </span>
      ),
    },
  ], []);

  const buildExportData = () => {
    const headers = ["Categoría", "Monto"];
    const rows: (string | number)[][] = gastos.map((g) => [g.nombre, g.monto]);
    rows.push(["Total gastos", resumen.totalGastos]);
    rows.push(["Ingresos", resumen.ingresos]);
    rows.push(["Resultado", resumen.resultado]);
    return { headers, rows };
  };

  const handleExportExcel = () => {
    const { headers, rows } = buildExportData();
    downloadXlsx(`resultado-ejercicio_${fechaDesde}_${fechaHasta}.xlsx`, headers, rows);
  };

  const handleExportPdf = () => {
    const { headers, rows } = buildExportData();
    downloadPdf({
      filename: `resultado-ejercicio_${fechaDesde}_${fechaHasta}.pdf`,
      title: "Resultado del Ejercicio",
      subtitle: `Período: ${formatFecha(fechaDesde)} — ${formatFecha(fechaHasta)}`,
      metrics: [
        { label: "Ingresos", value: formatARS(resumen.ingresos) },
        { label: "Gastos", value: formatARS(resumen.totalGastos) },
        { label: "Resultado", value: formatARS(resumen.resultado) },
      ],
      headers,
      rows,
    });
  };

  return (
    <PageShell
      title="Resultado del Ejercicio"
      action={
        <DropdownMenu>
          <DropdownMenuTrigger
            className={buttonVariants({ variant: "outline" })}
            disabled={loading || gastos.length === 0}
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

      <DataTable data={gastos} columns={columns} loading={loading} searchPlaceholder="Buscar categoría..." />
    </PageShell>
  );
}
