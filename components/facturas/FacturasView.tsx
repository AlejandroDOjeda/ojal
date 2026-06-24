"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, ShoppingCart, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageShell, DataTable } from "@/components/app";
import { TIPO_COMPROBANTE_ITEMS } from "@/lib/opciones";
import type { FacturaResumen } from "./FacturasContainer";

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
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => searchParams.get("tab") === "ventas" ? "ventas" : "compras");
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
      id: "acciones", header: "", enableSorting: false, size: 110,
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Link href={`/facturas/${row.original.Id_Factura}`}><Button variant="ghost" size="xs">Ver</Button></Link>
          <Link href={`/facturas/${row.original.Id_Factura}/edit`}><Button variant="ghost" size="xs"><Pencil size={13} /></Button></Link>
        </div>
      ),
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
      id: "acciones", header: "", enableSorting: false, size: 110,
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Link href={`/facturas/${row.original.Id_Factura}`}><Button variant="ghost" size="xs">Ver</Button></Link>
          <Link href={`/facturas/${row.original.Id_Factura}/edit`}><Button variant="ghost" size="xs"><Pencil size={13} /></Button></Link>
        </div>
      ),
    },
  ], []);

  return (
    <PageShell title="Facturas" description="Comprobantes de compra y venta">
      {error && <div className="mb-3 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}

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
