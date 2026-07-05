"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageShell, SectionCard } from "@/components/app";
import { formatARS } from "@/components/facturas/types";
import { TIPO_COMPROBANTE_ITEMS, CONDICION_IVA_ITEMS, CONDICION_PAGO_OPTIONS } from "@/lib/opciones";
import type { FacturaDetalle, ItemGastoDetalle, ItemHaciendaDetalle } from "./FacturaDetalleContainer";

const formatFecha = (d: string) => new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
const formatNumero = (tipoId: number | null, punto: string | null, numero: string | null) => {
  const label = tipoId ? (TIPO_COMPROBANTE_ITEMS[String(tipoId)] ?? "") : "";
  if (!punto && !numero) return label || "—";
  return `${label} ${punto ?? "00000"}-${numero ?? "00000000"}`;
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

const backLinkFor = (tab: "compras" | "ventas") => (
  <Link href={`/facturas?tab=${tab}`}>
    <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground -ml-2"><ArrowLeft size={14} />Volver a Facturas</Button>
  </Link>
);

export default function FacturaDetalleView({ factura, itemsGasto, itemsHacienda, loading, notFound }: Props) {
  const backLink = backLinkFor(factura?.Id_TipoOperacion === 1 ? "compras" : "ventas");

  if (loading) return <PageShell title="Detalle de Factura" back={backLink} className="max-w-4xl"><p className="text-muted-foreground">Cargando...</p></PageShell>;

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

  const isCompra = factura.Id_TipoOperacion === 1;
  const titulo = formatNumero(factura.Id_TipoComprobante, factura.PuntoVenta, factura.Numero);
  const condPagoLabel = CONDICION_PAGO_OPTIONS.find(o => o.value === factura.Id_CondicionPago)?.label ?? "—";
  const condIvaLabel = factura.EntidadLegal ? (CONDICION_IVA_ITEMS[String(factura.EntidadLegal.Id_CondicionIva)] ?? "—") : "—";

  return (
    <PageShell title={titulo} description={isCompra ? "Factura de Compra" : "Factura de Venta"} back={backLink} className="max-w-4xl">
      <div className="space-y-6">
        <SectionCard title="Datos del comprobante">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow label="Fecha" value={formatFecha(factura.Fecha)} />
            <InfoRow label="Condición de pago" value={condPagoLabel} />
            {factura.FechaVencimiento && <InfoRow label="Vencimiento" value={formatFecha(factura.FechaVencimiento)} />}
          </div>
        </SectionCard>

        <SectionCard title={isCompra ? "Proveedor" : "Cliente"}>
          {factura.EntidadLegal ? (
            <div className="space-y-3">
              <InfoRow label="Razón Social" value={factura.EntidadLegal.RazonSocial} />
              <InfoRow label="CUIT / CUIL" value={factura.EntidadLegal.CuitCuil} />
              <InfoRow label="Condición IVA" value={condIvaLabel} />
            </div>
          ) : <p className="text-sm text-muted-foreground">Sin información de entidad.</p>}
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
                  <TableRow key={item.Id_ItemGasto}>
                    <TableCell>{item.Descripcion}</TableCell>
                    <TableCell className="text-muted-foreground">{item.CategoriaGasto?.Nombre ?? "—"}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.Cantidad}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatARS(item.PrecioUnitario)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.TasaIva}%</TableCell>
                    <TableCell className="text-right font-medium">{formatARS(item.Subtotal)}</TableCell>
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
                  <TableHead className="text-muted-foreground w-32">Campo</TableHead>
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
                  <TableRow key={item.Id_ItemHacienda}>
                    <TableCell className="text-muted-foreground">{item.Campo?.Nombre ?? "—"}</TableCell>
                    <TableCell>{item.CategoriaHacienda?.Nombre ?? "—"}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.Cabezas}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.KgPromedio ?? "—"}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.PrecioPorKg ? formatARS(item.PrecioPorKg) : "—"}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.PrecioPorCabeza ? formatARS(item.PrecioPorCabeza) : "—"}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.TasaIva}%</TableCell>
                    <TableCell className="text-right font-medium">{formatARS(item.Subtotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        )}

        <SectionCard title="Totales">
          <div className="space-y-2 text-sm max-w-xs ml-auto">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal (sin IVA)</span><span className="font-medium">{formatARS(factura.Subtotal)}</span></div>
            {factura.Iva10_5 > 0 && <div className="flex justify-between"><span className="text-muted-foreground">IVA 10.5%</span><span className="font-medium">{formatARS(factura.Iva10_5)}</span></div>}
            {factura.Iva21 > 0 && <div className="flex justify-between"><span className="text-muted-foreground">IVA 21%</span><span className="font-medium">{formatARS(factura.Iva21)}</span></div>}
            <div className="flex justify-between border-t border-border pt-2"><span className="font-semibold text-base">Total</span><span className="font-bold text-base">{formatARS(factura.Total)}</span></div>
          </div>
        </SectionCard>

        {factura.Observaciones && <SectionCard title="Observaciones"><p className="text-sm text-muted-foreground">{factura.Observaciones}</p></SectionCard>}
      </div>
    </PageShell>
  );
}
