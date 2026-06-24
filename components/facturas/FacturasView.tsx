"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, ShoppingCart, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageShell, DataTable } from "@/components/app";
import { TIPO_COMPROBANTE_ITEMS, ESTADO_FACTURA_OPTIONS } from "@/lib/opciones";
import type { FacturaResumen } from "./FacturasContainer";

const ESTADO_LABEL = Object.fromEntries(ESTADO_FACTURA_OPTIONS.map(o => [o.value, o.label]));
const ESTADO_VARIANT: Record<number, "default" | "secondary" | "destructive" | "outline"> = {
  1: "secondary", 2: "outline", 3: "outline", 4: "outline", 5: "destructive",
};
const ESTADO_CLASS: Record<number, string> = {
  1: "", 5: "",
  2: "border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300",
  3: "border-green-300 text-green-700 dark:border-green-700 dark:text-green-300",
  4: "border-green-300 text-green-700 dark:border-green-700 dark:text-green-300",
};

const formatNumero = (tipoId: number | null, punto: string | null, numero: string | null) => {
  const label = tipoId ? (TIPO_COMPROBANTE_ITEMS[String(tipoId)] ?? "") : "";
  if (!punto && !numero) return label || "—";
  return `${label} ${punto ?? "0000"}-${numero ?? "00000000"}`;
};

const formatMonto = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

type Tab = "compras" | "ventas";
type Props = { compras: FacturaResumen[]; ventas: FacturaResumen[]; loading: boolean; error: string | null };

export default function FacturasView({ compras, ventas, loading, error }: Props) {
  const [tab, setTab] = useState<Tab>("compras");
  const router = useRouter();

  const columnsCompras = useMemo<ColumnDef<FacturaResumen, unknown>[]>(() => [
    {
      accessorKey: "Fecha",
      header: "Fecha",
      cell: ({ row }) => <span className="text-muted-foreground">{new Date(row.original.Fecha).toLocaleDateString("es-AR")}</span>,
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
    {
      accessorKey: "Total",
      header: "Total",
      cell: ({ row }) => <span className="font-medium text-right block">{formatMonto(row.original.Total)}</span>,
    },
    {
      accessorKey: "Id_EstadoFactura",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={ESTADO_VARIANT[row.original.Id_EstadoFactura]} className={ESTADO_CLASS[row.original.Id_EstadoFactura]}>
          {ESTADO_LABEL[row.original.Id_EstadoFactura] ?? "—"}
        </Badge>
      ),
    },
    {
      id: "ver", header: "", enableSorting: false, size: 60,
      cell: ({ row }) => <Link href={`/facturas/${row.original.Id_Factura}`}><Button variant="ghost" size="xs">Ver</Button></Link>,
    },
  ], []);

  const columnsVentas = useMemo<ColumnDef<FacturaResumen, unknown>[]>(() => [
    {
      accessorKey: "Fecha",
      header: "Fecha",
      cell: ({ row }) => <span className="text-muted-foreground">{new Date(row.original.Fecha).toLocaleDateString("es-AR")}</span>,
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
    {
      accessorKey: "Total",
      header: "Total",
      cell: ({ row }) => <span className="font-medium text-right block">{formatMonto(row.original.Total)}</span>,
    },
    {
      accessorKey: "Id_EstadoFactura",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={ESTADO_VARIANT[row.original.Id_EstadoFactura]} className={ESTADO_CLASS[row.original.Id_EstadoFactura]}>
          {ESTADO_LABEL[row.original.Id_EstadoFactura] ?? "—"}
        </Badge>
      ),
    },
    {
      id: "ver", header: "", enableSorting: false, size: 60,
      cell: ({ row }) => <Link href={`/facturas/${row.original.Id_Factura}`}><Button variant="ghost" size="xs">Ver</Button></Link>,
    },
  ], []);

  return (
    <PageShell title="Facturas" description="Comprobantes de compra y venta">
      {error && <div className="mb-3 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}

      {/* Tabs + botón */}
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

      {/* key={tab} resetea la búsqueda al cambiar de pestaña */}
      {tab === "compras" ? (
        <DataTable key="compras" data={compras} columns={columnsCompras} loading={loading}
           />
      ) : (
        <DataTable key="ventas" data={ventas} columns={columnsVentas} loading={loading}
          searchPlaceholder="Buscar por cliente, comprobante..." />
      )}
    </PageShell>
  );
}
