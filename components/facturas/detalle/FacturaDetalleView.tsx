"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageShell, SectionCard } from "@/components/app";
import { formatARS } from "@/components/facturas/types";
import type { FacturaDetalle, ItemGastoDetalle, ItemHaciendaDetalle } from "./FacturaDetalleContainer";

const ESTADO_LABEL: Record<FacturaDetalle["estado"], string> = {
  borrador: "Borrador", confirmada: "Confirmada", pagada: "Pagada", cobrada: "Cobrada", anulada: "Anulada",
};

const ESTADO_VARIANT: Record<FacturaDetalle["estado"], string> = {
  borrador: "secondary", confirmada: "outline", pagada: "outline", cobrada: "outline", anulada: "destructive",
};

const ESTADO_CLASS: Record<FacturaDetalle["estado"], string> = {
  borrador: "",
  confirmada: "border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300",
  pagada: "border-green-300 text-green-700 dark:border-green-700 dark:text-green-300",
  cobrada: "border-green-300 text-green-700 dark:border-green-700 dark:text-green-300",
  anulada: "",
};

const formatFecha = (d: string) => new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
const formatNumero = (tipo: string | null, punto: string | null, numero: string | null) => {
  const prefix = tipo === "liquidacion_hacienda" ? "Liq. Hacienda" : `Fc. ${tipo ?? ""}`;
  if (!punto && !numero) return prefix;
  return `${prefix} ${punto ?? "0000"}-${numero ?? "00000000"}`;
};

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex gap-2 text-sm">
    <span className="text-muted-foreground w-36 shrink-0">{label}</span>
    <span className="text-foreground font-medium">{value}</span>
  </div>
);

type Props = {
  factura: FacturaDetalle | null;
  itemsGasto: ItemGastoDetalle[];
  itemsHacienda: ItemHaciendaDetalle[];
  loading: boolean;
  notFound: boolean;
};

const backLink = (
  <Link href="/facturas">
    <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground -ml-2">
      <ArrowLeft size={14} />Volver a Facturas
    </Button>
  </Link>
);

export default function FacturaDetalleView({ factura, itemsGasto, itemsHacienda, loading, notFound }: Props) {
  if (loading) {
    return <PageShell title="Detalle de Factura" back={backLink} className="max-w-4xl"><p className="text-muted-foreground">Cargando...</p></PageShell>;
  }

  if (notFound || !factura) {
    return (
      <PageShell title="Factura no encontrada" back={backLink} className="max-w-4xl">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText size={48} className="text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">Esta factura no existe o no tenés acceso a ella.</p>
        </div>
      </PageShell>
    );
  }

  const isCompra = factura.tipo_operacion === "compra";
  const titulo = formatNumero(factura.tipo_comprobante, factura.punto_venta, factura.numero);

  return (
    <PageShell
      title={titulo}
      description={isCompra ? "Factura de Compra" : "Factura de Venta"}
      back={backLink}
      action={
        <Badge
          variant={ESTADO_VARIANT[factura.estado] as "default" | "secondary" | "destructive" | "outline"}
          className={ESTADO_CLASS[factura.estado]}
        >
          {ESTADO_LABEL[factura.estado]}
        </Badge>
      }
      className="max-w-4xl"
    >
      <div className="space-y-6">
        <SectionCard title="Datos del comprobante">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow label="Fecha" value={formatFecha(factura.fecha)} />
            <InfoRow label="Condición de pago" value={factura.condicion_pago === "contado" ? "Contado" : "Cuenta corriente"} />
            {factura.fecha_vencimiento && <InfoRow label="Vencimiento" value={formatFecha(factura.fecha_vencimiento)} />}
          </div>
        </SectionCard>

        <SectionCard title={isCompra ? "Proveedor" : "Cliente"}>
          {factura.entidad_legal ? (
            <div className="space-y-3">
              <InfoRow label="Razón Social" value={factura.entidad_legal.razon_social} />
              <InfoRow label="CUIT / CUIL" value={factura.entidad_legal.cuit_cuil} />
              <InfoRow label="Condición IVA" value={factura.entidad_legal.condicion_iva.replace("_", " ")} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Sin información de entidad.</p>
          )}
        </SectionCard>

        {isCompra ? (
          <SectionCard title="Ítems">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Descripción</TableHead>
                  <TableHead className="text-muted-foreground w-40">Categoría</TableHead>
                  <TableHead className="text-muted-foreground text-right w-20">Cant.</TableHead>
                  <TableHead className="text-muted-foreground text-right w-28">Precio unit.</TableHead>
                  <TableHead className="text-muted-foreground text-right w-16">IVA</TableHead>
                  <TableHead className="text-muted-foreground text-right w-28">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemsGasto.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.descripcion}</TableCell>
                    <TableCell className="text-muted-foreground">{item.categoria_gasto?.nombre ?? "—"}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.cantidad}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatARS(item.precio_unitario)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.tasa_iva}%</TableCell>
                    <TableCell className="text-right font-medium">{formatARS(item.subtotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        ) : (
          <SectionCard title="Hacienda">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground w-36">Categoría</TableHead>
                  <TableHead className="text-muted-foreground text-right w-20">Cabezas</TableHead>
                  <TableHead className="text-muted-foreground text-right w-24">Kg prom.</TableHead>
                  <TableHead className="text-muted-foreground text-right w-28">Precio/kg</TableHead>
                  <TableHead className="text-muted-foreground text-right w-28">Precio/cab.</TableHead>
                  <TableHead className="text-muted-foreground text-right w-16">IVA</TableHead>
                  <TableHead className="text-muted-foreground text-right w-28">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemsHacienda.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.categoria_hacienda?.nombre ?? "—"}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.cabezas}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.kg_promedio ?? "—"}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.precio_por_kg ? formatARS(item.precio_por_kg) : "—"}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.precio_por_cabeza ? formatARS(item.precio_por_cabeza) : "—"}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.tasa_iva}%</TableCell>
                    <TableCell className="text-right font-medium">{formatARS(item.subtotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        )}

        <SectionCard title="Totales">
          <div className="space-y-2 text-sm max-w-xs ml-auto">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal (sin IVA)</span><span className="font-medium">{formatARS(factura.subtotal)}</span></div>
            {factura.iva_10_5 > 0 && <div className="flex justify-between"><span className="text-muted-foreground">IVA 10.5%</span><span className="font-medium">{formatARS(factura.iva_10_5)}</span></div>}
            {factura.iva_21 > 0 && <div className="flex justify-between"><span className="text-muted-foreground">IVA 21%</span><span className="font-medium">{formatARS(factura.iva_21)}</span></div>}
            <div className="flex justify-between border-t border-border pt-2"><span className="font-semibold text-base">Total</span><span className="font-bold text-base">{formatARS(factura.total)}</span></div>
          </div>
        </SectionCard>

        {factura.observaciones && (
          <SectionCard title="Observaciones">
            <p className="text-sm text-muted-foreground">{factura.observaciones}</p>
          </SectionCard>
        )}
      </div>
    </PageShell>
  );
}
