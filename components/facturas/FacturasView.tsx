"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ShoppingCart, TrendingUp, FileText } from "lucide-react";
import { PageShell, GridContainer, EmptyState } from "@/components/app";
import type { FacturaResumen } from "./FacturasContainer";

const ESTADO_LABEL: Record<FacturaResumen["estado"], string> = {
  borrador: "Borrador",
  confirmada: "Confirmada",
  pagada: "Pagada",
  cobrada: "Cobrada",
  anulada: "Anulada",
};

const ESTADO_CLASS: Record<FacturaResumen["estado"], string> = {
  borrador: "bg-muted text-muted-foreground",
  confirmada: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  pagada: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  cobrada: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  anulada: "bg-destructive/10 text-destructive",
};

const formatNumero = (punto: string | null, numero: string | null) => {
  if (!punto && !numero) return "—";
  return `${punto ?? "0000"}-${numero ?? "00000000"}`;
};

const formatMonto = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

type Tab = "compras" | "ventas";

type Props = {
  compras: FacturaResumen[];
  ventas: FacturaResumen[];
  loading: boolean;
  error: string | null;
};

export default function FacturasView({ compras, ventas, loading, error }: Props) {
  const [tab, setTab] = useState<Tab>("compras");
  const router = useRouter();

  const filas = tab === "compras" ? compras : ventas;

  return (
    <PageShell title="Facturas" description="Comprobantes de compra y venta">
      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      {/* Tabs + botón de alta */}
      <div className="flex items-end justify-between mb-6 border-b border-border">
        <div className="flex gap-1">
          <button
            onClick={() => setTab("compras")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === "compras" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingCart size={15} />
            Compras
            {compras.length > 0 && (
              <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{compras.length}</span>
            )}
          </button>
          <button
            onClick={() => setTab("ventas")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === "ventas" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingUp size={15} />
            Ventas
            {ventas.length > 0 && (
              <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{ventas.length}</span>
            )}
          </button>
        </div>
        <button
          onClick={() => router.push(tab === "compras" ? "/facturas/nueva-compra" : "/facturas/nueva-venta")}
          className="mb-1 inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:bg-primary/90 transition-colors"
          aria-label={tab === "compras" ? "Nueva Compra" : "Nueva Venta"}
        >
          <Plus size={15} />
        </button>
      </div>

      {loading ? (
        <GridContainer state="loading"><p className="text-muted-foreground">Cargando...</p></GridContainer>
      ) : filas.length === 0 ? (
        <GridContainer state="empty">
          <EmptyState
            icon={<FileText size={48} />}
            title={`No hay ${tab === "compras" ? "facturas de compra" : "facturas de venta"}`}
            description={`Las ${tab} que cargues aparecerán acá.`}
          />
        </GridContainer>
      ) : (
        <GridContainer>
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fecha</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Comprobante</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">{tab === "compras" ? "Proveedor" : "Cliente"}</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filas.map((f) => (
                <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{new Date(f.fecha).toLocaleDateString("es-AR")}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {f.tipo_comprobante === "liquidacion_hacienda" ? "Liq. Hacienda" : `Fc. ${f.tipo_comprobante}`}{" "}
                    {formatNumero(f.punto_venta, f.numero)}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{f.entidad_legal?.razon_social ?? "—"}</td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">{formatMonto(f.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_CLASS[f.estado]}`}>
                      {ESTADO_LABEL[f.estado]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs text-primary hover:underline">Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GridContainer>
      )}
    </PageShell>
  );
}
