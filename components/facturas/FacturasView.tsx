"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ShoppingCart, TrendingUp, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageShell, GridContainer, EmptyState } from "@/components/app";
import { TIPO_OPERACION, TIPO_COMPROBANTE_ITEMS, ESTADO_FACTURA_OPTIONS } from "@/lib/opciones";
import type { FacturaResumen } from "./FacturasContainer";

// Mapas por Id para display
const ESTADO_LABEL = Object.fromEntries(ESTADO_FACTURA_OPTIONS.map(o => [o.value, o.label]));
const ESTADO_VARIANT: Record<number, string> = { 1: "secondary", 2: "outline", 3: "outline", 4: "outline", 5: "destructive" };
const ESTADO_CLASS: Record<number, string> = {
  1: "",
  2: "border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300",
  3: "border-green-300 text-green-700 dark:border-green-700 dark:text-green-300",
  4: "border-green-300 text-green-700 dark:border-green-700 dark:text-green-300",
  5: "",
};

const formatNumero = (tipoId: number | null, punto: string | null, numero: string | null) => {
  const label = tipoId ? (TIPO_COMPROBANTE_ITEMS[String(tipoId)] ?? "") : "";
  if (!punto && !numero) return label || "—";
  return `${label} ${punto ?? "0000"}-${numero ?? "00000000"}`;
};

const formatMonto = (n: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

type Tab = "compras" | "ventas";
type Props = { compras: FacturaResumen[]; ventas: FacturaResumen[]; loading: boolean; error: string | null };

export default function FacturasView({ compras, ventas, loading, error }: Props) {
  const [tab, setTab] = useState<Tab>("compras");
  const router = useRouter();
  const filas = tab === "compras" ? compras : ventas;

  return (
    <PageShell title="Facturas" description="Comprobantes de compra y venta">
      {error && <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}

      <div className="flex items-end justify-between mb-6 border-b border-border">
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

      {loading ? (
        <GridContainer state="loading"><p className="text-muted-foreground">Cargando...</p></GridContainer>
      ) : filas.length === 0 ? (
        <GridContainer state="empty">
          <EmptyState icon={<FileText size={48} />}
            title={`No hay ${tab === "compras" ? "facturas de compra" : "facturas de venta"}`}
            description={`Las ${tab} que cargues aparecerán acá.`} />
        </GridContainer>
      ) : (
        <GridContainer>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/50">
                <TableHead className="text-muted-foreground">Fecha</TableHead>
                <TableHead className="text-muted-foreground">Comprobante</TableHead>
                <TableHead className="text-muted-foreground">{tab === "compras" ? "Proveedor" : "Cliente"}</TableHead>
                <TableHead className="text-muted-foreground text-right">Total</TableHead>
                <TableHead className="text-muted-foreground">Estado</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filas.map((f) => (
                <TableRow key={f.Id_Factura}>
                  <TableCell className="text-muted-foreground">{new Date(f.Fecha).toLocaleDateString("es-AR")}</TableCell>
                  <TableCell className="text-muted-foreground">{formatNumero(f.Id_TipoComprobante, f.PuntoVenta, f.Numero)}</TableCell>
                  <TableCell className="font-medium">{f.EntidadLegal?.RazonSocial ?? "—"}</TableCell>
                  <TableCell className="text-right font-medium">{formatMonto(f.Total)}</TableCell>
                  <TableCell>
                    <Badge variant={ESTADO_VARIANT[f.Id_EstadoFactura] as "default" | "secondary" | "destructive" | "outline"} className={ESTADO_CLASS[f.Id_EstadoFactura]}>
                      {ESTADO_LABEL[f.Id_EstadoFactura] ?? "—"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/facturas/${f.Id_Factura}`}>
                      <Button variant="ghost" size="xs">Ver</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GridContainer>
      )}
    </PageShell>
  );
}
