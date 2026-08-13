"use client";

import { useMemo } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { parseISO } from "date-fns";
import { ArrowUpRight, Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, DatePicker, FormField } from "@/components/app";
import { signoMovimientoRodeo, TIPO_MOVIMIENTO_LABELS } from "@/lib/opciones";
import { downloadXlsx } from "@/lib/excel";
import { downloadPdf } from "@/lib/pdf";
import { MovimientoBadge } from "./MovimientoBadge";
import type { MovimientoFila } from "./HistorialMovimientosContainer";

// parseISO interpreta "YYYY-MM-DD" como medianoche local; new Date(string) lo
// interpreta como UTC, lo que en husos horarios negativos (Argentina) puede
// mostrar el día anterior.
const formatFecha = (fecha: string) => parseISO(fecha).toLocaleDateString("es-AR");

const formatCabezas = (fila: MovimientoFila) => {
  const signo = signoMovimientoRodeo(fila.TipoMovimiento, fila.Sentido);
  if (signo === 0) return `${fila.Cabezas}`;
  return signo > 0 ? `+${fila.Cabezas}` : `-${fila.Cabezas}`;
};

const colorCabezas = (fila: MovimientoFila) => {
  const signo = signoMovimientoRodeo(fila.TipoMovimiento, fila.Sentido);
  if (signo > 0) return "text-green-600 dark:text-green-400";
  if (signo < 0) return "text-destructive";
  return "text-muted-foreground";
};

const detalleTraslado = (fila: MovimientoFila): string | null => {
  if (fila.TipoMovimiento !== "traslado" || !fila.LoteVinculado) return null;
  return fila.Sentido === "incremento" ? `← ${fila.LoteVinculado.Nombre}` : `→ ${fila.LoteVinculado.Nombre}`;
};

type Props = {
  movimientos: MovimientoFila[];
  loading: boolean;
  error: string | null;
  fechaDesde: string;
  fechaHasta: string;
  onFechaDesdeChange: (value: string) => void;
  onFechaHastaChange: (value: string) => void;
};

export default function HistorialMovimientosView({
  movimientos, loading, error, fechaDesde, fechaHasta,
  onFechaDesdeChange, onFechaHastaChange,
}: Props) {
  const columns = useMemo<ColumnDef<MovimientoFila, unknown>[]>(() => [
    {
      accessorKey: "Fecha",
      header: "Fecha",
      cell: ({ row }) => <span className="text-muted-foreground">{formatFecha(row.original.Fecha)}</span>,
    },
    {
      id: "tipo",
      header: "Tipo",
      accessorFn: (row) => row.TipoMovimiento,
      cell: ({ row }) => <MovimientoBadge tipo={row.original.TipoMovimiento} />,
    },
    {
      id: "categoria",
      header: "Categoría",
      accessorFn: (row) => row.CategoriaHacienda?.Nombre ?? "",
      cell: ({ row }) => <span className="font-medium">{row.original.CategoriaHacienda?.Nombre ?? "—"}</span>,
    },
    {
      id: "lote",
      header: "Lote",
      accessorFn: (row) => row.Lote?.Nombre ?? "",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.Lote?.Nombre ?? "—"}</span>,
    },
    {
      id: "campo",
      header: "Campo",
      accessorFn: (row) => row.Lote?.Campo?.Nombre ?? "",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.Lote?.Campo?.Nombre ?? "—"}</span>,
    },
    {
      id: "cabezas",
      header: "Cabezas",
      meta: { align: "right" },
      accessorFn: (row) => signoMovimientoRodeo(row.TipoMovimiento, row.Sentido) * row.Cabezas,
      cell: ({ row }) => (
        <span className={`text-right block font-semibold tabular-nums ${colorCabezas(row.original)}`}>
          {formatCabezas(row.original)}
        </span>
      ),
      footer: ({ table }) => {
        const neto = table.getFilteredRowModel().rows.reduce(
          (s, row) => s + signoMovimientoRodeo(row.original.TipoMovimiento, row.original.Sentido) * row.original.Cabezas,
          0
        );
        const color = neto > 0 ? "text-green-600 dark:text-green-400" : neto < 0 ? "text-destructive" : "text-foreground";
        return <span className={`font-semibold ${color}`}>{`Neto: ${neto > 0 ? "+" : ""}${neto}`}</span>;
      },
    },
    {
      id: "detalle",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const fila = row.original;
        const traslado = detalleTraslado(fila);
        if (traslado) {
          return <span className="text-xs text-muted-foreground">{traslado}</span>;
        }
        if (fila.Id_Factura) {
          return (
            <Link
              href={`/facturas/${fila.Id_Factura}`}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Ver comprobante
              <ArrowUpRight size={12} />
            </Link>
          );
        }
        return <span className="text-xs text-muted-foreground">{fila.Observaciones ?? "—"}</span>;
      },
    },
  ], []);

  const buildExportData = () => {
    const headers = ["Fecha", "Tipo", "Categoría", "Lote", "Campo", "Cabezas", "Detalle"];
    const rows = movimientos.map((m) => {
      const signo = signoMovimientoRodeo(m.TipoMovimiento, m.Sentido);
      const detalle = detalleTraslado(m) ?? (m.Id_Factura ? `Comprobante #${m.Id_Factura}` : (m.Observaciones ?? ""));
      return [
        formatFecha(m.Fecha),
        TIPO_MOVIMIENTO_LABELS[m.TipoMovimiento] ?? m.TipoMovimiento,
        m.CategoriaHacienda?.Nombre ?? "",
        m.Lote?.Nombre ?? "",
        m.Lote?.Campo?.Nombre ?? "",
        signo * m.Cabezas,
        detalle,
      ];
    });
    return { headers, rows };
  };

  const netoCabezas = movimientos.reduce(
    (s, m) => s + signoMovimientoRodeo(m.TipoMovimiento, m.Sentido) * m.Cabezas,
    0
  );

  const handleExportExcel = () => {
    const { headers, rows } = buildExportData();
    downloadXlsx(`historial-rodeo_${fechaDesde}_${fechaHasta}.xlsx`, headers, rows);
  };

  const handleExportPdf = () => {
    const { headers, rows } = buildExportData();
    downloadPdf({
      filename: `historial-rodeo_${fechaDesde}_${fechaHasta}.pdf`,
      title: "Historial de movimientos de hacienda",
      subtitle: `Período: ${formatFecha(fechaDesde)} — ${formatFecha(fechaHasta)}`,
      metrics: [{ label: "Cabezas netas", value: `${netoCabezas > 0 ? "+" : ""}${netoCabezas}` }],
      headers,
      rows,
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Historial de movimientos</h2>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={buttonVariants({ variant: "outline" })}
            disabled={loading || movimientos.length === 0}
          >
            <Download size={15} />
            Exportar
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportExcel}>Excel (.xlsx)</DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPdf}>PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {error && (
        <div className="mb-3 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex items-end gap-3 mb-4">
        <FormField label="Desde" className="w-40">
          <DatePicker value={fechaDesde} onChange={onFechaDesdeChange} />
        </FormField>
        <FormField label="Hasta" className="w-40">
          <DatePicker value={fechaHasta} onChange={onFechaHastaChange} />
        </FormField>
      </div>

      <DataTable
        data={movimientos}
        columns={columns}
        loading={loading}
        searchPlaceholder="Buscar por categoría, lote, campo..."
      />
    </div>
  );
}
