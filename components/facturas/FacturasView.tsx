"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { parseISO } from "date-fns";
import { Pencil, Plus, Search, ShoppingCart, Trash2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageShell, DataTable, DatePicker, FormField } from "@/components/app";
import { TIPO_COMPROBANTE_ITEMS } from "@/lib/opciones";
import type { FacturaResumen } from "./FacturasContainer";

const formatNumero = (tipoId: number | null, punto: string | null, numero: string | null) => {
  const label = tipoId ? (TIPO_COMPROBANTE_ITEMS[String(tipoId)] ?? "") : "";
  if (!punto && !numero) return label || "—";
  return `${label} ${punto ?? "00000"}-${numero ?? "00000000"}`;
};

// parseISO interpreta "YYYY-MM-DD" como medianoche local; new Date(string) lo
// interpreta como UTC, lo que en husos horarios negativos (Argentina) puede
// mostrar el día anterior.
const formatFecha = (fecha: string) => parseISO(fecha).toLocaleDateString("es-AR");

const formatMonto = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

const sumColumn = (rows: { original: FacturaResumen }[], field: "Subtotal" | "Iva" | "Total") =>
  rows.reduce((s, row) => {
    if (field === "Iva") return s + row.original.Iva10_5 + row.original.Iva21;
    return s + row.original[field];
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
      toast.success("Factura eliminada.");
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
      cell: ({ row }) => <span className="text-right block">{formatMonto(row.original.Subtotal)}</span>,
      footer: ({ table }) => `Total: ${formatMonto(sumColumn(table.getFilteredRowModel().rows, "Subtotal"))}`,
    },
    {
      id: "iva",
      header: "IVA",
      meta: { align: "right" },
      accessorFn: (row) => row.Iva10_5 + row.Iva21,
      cell: ({ row }) => <span className="text-right block">{formatMonto(row.original.Iva10_5 + row.original.Iva21)}</span>,
      footer: ({ table }) => `Total: ${formatMonto(sumColumn(table.getFilteredRowModel().rows, "Iva"))}`,
    },
    {
      accessorKey: "Total",
      header: "Bruto",
      meta: { align: "right" },
      cell: ({ row }) => <span className="font-medium text-right block">{formatMonto(row.original.Total)}</span>,
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
      accessorFn: (row) => `${TIPO_COMPROBANTE_ITEMS[String(row.Id_TipoComprobante)] ?? ""} ${row.PuntoVenta ?? ""}-${row.Numero ?? ""}`,
      cell: ({ row }) => <span className="text-muted-foreground">{formatNumero(row.original.Id_TipoComprobante, row.original.PuntoVenta, row.original.Numero)}</span>,
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
      accessorFn: (row) => `${TIPO_COMPROBANTE_ITEMS[String(row.Id_TipoComprobante)] ?? ""} ${row.PuntoVenta ?? ""}-${row.Numero ?? ""}`,
      cell: ({ row }) => <span className="text-muted-foreground">{formatNumero(row.original.Id_TipoComprobante, row.original.PuntoVenta, row.original.Numero)}</span>,
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

  return (
    <PageShell title="Facturas">
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
        <Button size="icon" className="mb-1"
          onClick={() => router.push(tab === "compras" ? "/facturas/nueva-compra" : "/facturas/nueva-venta")}>
          <Plus size={15} />
        </Button>
      </div>

      {tab === "compras" ? (
        <DataTable key="compras" data={compras} columns={columnsCompras} loading={loading} />
      ) : (
        <DataTable key="ventas" data={ventas} columns={columnsVentas} loading={loading} />
      )}
    </PageShell>
  );
}
