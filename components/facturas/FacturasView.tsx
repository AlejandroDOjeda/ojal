"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { parseISO } from "date-fns";
import { Download, Pencil, Plus, Search, ShoppingCart, Trash2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageShell, DataTable, DatePicker, FormField } from "@/components/app";
import { signoComprobante, labelComprobante } from "@/lib/opciones";
import { downloadXlsx } from "@/lib/excel";
import { downloadPdf } from "@/lib/pdf";
import type { FacturaResumen } from "./FacturasContainer";

const formatNumero = (tipoId: number | null, punto: string | null, numero: string | null, tipoAsociada?: number | null) => {
  const label = tipoId ? labelComprobante(tipoId, tipoAsociada) : "";
  if (!punto && !numero) return label || "—";
  return `${label} ${punto ?? "00000"}-${numero ?? "00000000"}`;
};

// parseISO interpreta "YYYY-MM-DD" como medianoche local; new Date(string) lo
// interpreta como UTC, lo que en husos horarios negativos (Argentina) puede
// mostrar el día anterior.
const formatFecha = (fecha: string) => parseISO(fecha).toLocaleDateString("es-AR");

const formatMonto = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

// Una Nota de Crédito resta del período, una Nota de Débito suma — igual
// que una Factura común. Se aplica el signo tanto en cada celda como en las
// sumatorias, para que el pie de la tabla y los exports queden netos.
const sumColumn = (rows: { original: FacturaResumen }[], field: "Subtotal" | "Iva" | "Total") =>
  rows.reduce((s, row) => {
    const signo = signoComprobante(row.original.Id_TipoComprobante);
    if (field === "Iva") return s + signo * (row.original.Iva10_5 + row.original.Iva21);
    return s + signo * row.original[field];
  }, 0);

type Tab = "compras" | "ventas";
type Props = {
  compras:            FacturaResumen[];
  ventas:             FacturaResumen[];
  loading:            boolean;
  error:              string | null;
  fechaDesde:         string;
  fechaHasta:         string;
  onFechaDesdeChange: (value: string) => void;
  onFechaHastaChange: (value: string) => void;
  onDelete:           (id: number) => Promise<void>;
};

export default function FacturasView({ compras, ventas, loading, error, fechaDesde, fechaHasta, onFechaDesdeChange, onFechaHastaChange, onDelete }: Props) {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => searchParams.get("tab") === "ventas" ? "ventas" : "compras");
  const router = useRouter();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      await onDelete(id);
      setDeleteConfirmId(null);
      toast.success("Comprobante eliminado.");
    } catch {
      toast.error("No se pudo eliminar la factura.");
    } finally {
      setDeleting(false);
    }
  };

  const accionesCell = (row: { original: FacturaResumen }) => {
    const id = row.original.Id_Factura;
    return deleteConfirmId === id ? (
      <div className="flex items-center gap-2 justify-end">
        <span className="text-xs text-muted-foreground">¿Eliminar?</span>
        <Button variant="destructive" size="xs" onClick={() => handleDelete(id)} disabled={deleting}>Sí</Button>
        <Button variant="ghost" size="xs" onClick={() => setDeleteConfirmId(null)}>No</Button>
      </div>
    ) : (
      <div className="flex gap-1 justify-end">
        <Link href={`/facturas/${id}`}>
          <Button variant="ghost" size="icon-sm" aria-label="Ver detalle"><Search size={13} /></Button>
        </Link>
        <Link href={`/facturas/${id}/edit`}>
          <Button variant="ghost" size="icon-sm" aria-label="Editar"><Pencil size={13} /></Button>
        </Link>
        <Button
          variant="ghost" size="icon-sm"
          className="hover:text-destructive hover:bg-destructive/10"
          aria-label="Eliminar"
          onClick={() => setDeleteConfirmId(id)}
        >
          <Trash2 size={13} />
        </Button>
      </div>
    );
  };

  const montoColumnas = (): ColumnDef<FacturaResumen, unknown>[] => [
    {
      accessorKey: "Subtotal",
      header: "Neto",
      meta: { align: "right" },
      cell: ({ row }) => <span className="text-right block">{formatMonto(row.original.Subtotal * signoComprobante(row.original.Id_TipoComprobante))}</span>,
      footer: ({ table }) => `Total: ${formatMonto(sumColumn(table.getFilteredRowModel().rows, "Subtotal"))}`,
    },
    {
      id: "iva",
      header: "IVA",
      meta: { align: "right" },
      accessorFn: (row) => (row.Iva10_5 + row.Iva21) * signoComprobante(row.Id_TipoComprobante),
      cell: ({ row }) => <span className="text-right block">{formatMonto((row.original.Iva10_5 + row.original.Iva21) * signoComprobante(row.original.Id_TipoComprobante))}</span>,
      footer: ({ table }) => `Total: ${formatMonto(sumColumn(table.getFilteredRowModel().rows, "Iva"))}`,
    },
    {
      accessorKey: "Total",
      header: "Bruto",
      meta: { align: "right" },
      cell: ({ row }) => <span className="font-medium text-right block">{formatMonto(row.original.Total * signoComprobante(row.original.Id_TipoComprobante))}</span>,
      footer: ({ table }) => <span className="font-semibold">{`Total: ${formatMonto(sumColumn(table.getFilteredRowModel().rows, "Total"))}`}</span>,
    },
  ];

  const columnsCompras = useMemo<ColumnDef<FacturaResumen, unknown>[]>(() => [
    {
      accessorKey: "Fecha",
      header: "Fecha",
      cell: ({ row }) => <span className="text-muted-foreground">{formatFecha(row.original.Fecha)}</span>,
    },
    {
      id: "comprobante",
      header: "Comprobante",
      accessorFn: (row) => `${labelComprobante(row.Id_TipoComprobante, row.FacturaAsociada?.Id_TipoComprobante)} ${row.PuntoVenta ?? ""}-${row.Numero ?? ""}`,
      cell: ({ row }) => <span className="text-muted-foreground">{formatNumero(row.original.Id_TipoComprobante, row.original.PuntoVenta, row.original.Numero, row.original.FacturaAsociada?.Id_TipoComprobante)}</span>,
    },
    {
      id: "entidad",
      header: "Proveedor",
      accessorFn: (row) => row.EntidadLegal?.RazonSocial ?? "",
      cell: ({ row }) => <span className="font-medium">{row.original.EntidadLegal?.RazonSocial ?? "—"}</span>,
    },
    ...montoColumnas(),
    {
      id: "acciones", header: "", enableSorting: false, size: 130,
      cell: ({ row }) => accionesCell(row),
    },
  ], [deleteConfirmId, deleting]);

  const columnsVentas = useMemo<ColumnDef<FacturaResumen, unknown>[]>(() => [
    {
      accessorKey: "Fecha",
      header: "Fecha",
      cell: ({ row }) => <span className="text-muted-foreground">{formatFecha(row.original.Fecha)}</span>,
    },
    {
      id: "comprobante",
      header: "Comprobante",
      accessorFn: (row) => `${labelComprobante(row.Id_TipoComprobante, row.FacturaAsociada?.Id_TipoComprobante)} ${row.PuntoVenta ?? ""}-${row.Numero ?? ""}`,
      cell: ({ row }) => <span className="text-muted-foreground">{formatNumero(row.original.Id_TipoComprobante, row.original.PuntoVenta, row.original.Numero, row.original.FacturaAsociada?.Id_TipoComprobante)}</span>,
    },
    {
      id: "entidad",
      header: "Cliente",
      accessorFn: (row) => row.EntidadLegal?.RazonSocial ?? "",
      cell: ({ row }) => <span className="font-medium">{row.original.EntidadLegal?.RazonSocial ?? "—"}</span>,
    },
    ...montoColumnas(),
    {
      id: "acciones", header: "", enableSorting: false, size: 130,
      cell: ({ row }) => accionesCell(row),
    },
  ], [deleteConfirmId, deleting]);

  const filasTab = tab === "compras" ? compras : ventas;
  const entidadLabel = tab === "compras" ? "Proveedor" : "Cliente";

  const buildExportData = () => {
    const headers = ["Fecha", "Comprobante", entidadLabel, "Neto", "IVA", "Bruto"];
    const rows = filasTab.map((f) => {
      const signo = signoComprobante(f.Id_TipoComprobante);
      return [
        formatFecha(f.Fecha),
        formatNumero(f.Id_TipoComprobante, f.PuntoVenta, f.Numero, f.FacturaAsociada?.Id_TipoComprobante),
        f.EntidadLegal?.RazonSocial ?? "",
        f.Subtotal * signo,
        (f.Iva10_5 + f.Iva21) * signo,
        f.Total * signo,
      ];
    });
    return { headers, rows };
  };

  const handleExportExcel = () => {
    const { headers, rows } = buildExportData();
    downloadXlsx(`facturas-${tab}_${fechaDesde}_${fechaHasta}.xlsx`, headers, rows);
  };

  const handleExportPdf = () => {
    const { headers, rows } = buildExportData();
    const totalNeto = filasTab.reduce((s, f) => s + f.Subtotal * signoComprobante(f.Id_TipoComprobante), 0);
    const totalIva = filasTab.reduce((s, f) => s + (f.Iva10_5 + f.Iva21) * signoComprobante(f.Id_TipoComprobante), 0);
    const totalBruto = filasTab.reduce((s, f) => s + f.Total * signoComprobante(f.Id_TipoComprobante), 0);
    downloadPdf({
      filename: `facturas-${tab}_${fechaDesde}_${fechaHasta}.pdf`,
      title: tab === "compras" ? "Comprobantes de Compra" : "Comprobantes de Venta",
      subtitle: `Período: ${formatFecha(fechaDesde)} — ${formatFecha(fechaHasta)}`,
      metrics: [
        { label: "Neto", value: formatMonto(totalNeto) },
        { label: "IVA", value: formatMonto(totalIva) },
        { label: "Bruto", value: formatMonto(totalBruto) },
      ],
      headers,
      rows,
    });
  };

  return (
    <PageShell title="Comprobantes">
      {error && <div className="mb-3 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}

      <div className="flex items-end gap-3 mb-4">
        <FormField label="Desde" className="w-40">
          <DatePicker value={fechaDesde} onChange={onFechaDesdeChange} />
        </FormField>
        <FormField label="Hasta" className="w-40">
          <DatePicker value={fechaHasta} onChange={onFechaHastaChange} />
        </FormField>
      </div>

      <div className="flex items-end justify-between mb-4 border-b border-border">
        <div className="flex gap-1">
          <button onClick={() => setTab("compras")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === "compras" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <ShoppingCart size={15} />Compras
            {compras.length > 0 && <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{compras.length}</span>}
          </button>
          <button onClick={() => setTab("ventas")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === "ventas" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <TrendingUp size={15} />Ventas
            {ventas.length > 0 && <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{ventas.length}</span>}
          </button>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({ variant: "outline" })}
              disabled={loading || filasTab.length === 0}
            >
              <Download size={15} />
              Exportar
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportExcel}>Excel (.xlsx)</DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPdf}>PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="icon"
            onClick={() => router.push(tab === "compras" ? "/facturas/nueva-compra" : "/facturas/nueva-venta")}>
            <Plus size={15} />
          </Button>
        </div>
      </div>

      {tab === "compras" ? (
        <DataTable key="compras" data={compras} columns={columnsCompras} loading={loading} />
      ) : (
        <DataTable key="ventas" data={ventas} columns={columnsVentas} loading={loading} />
      )}
    </PageShell>
  );
}
