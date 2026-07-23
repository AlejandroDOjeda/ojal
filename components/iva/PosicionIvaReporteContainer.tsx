"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TIPO_OPERACION } from "@/lib/opciones";
import { toDateStr, hoyStr } from "@/lib/fecha";
import { useCampoContext } from "@/contexts/CampoContext";
import PosicionIvaReporteView from "./PosicionIvaReporteView";

export type FacturaIva = {
  Id_Factura: number;
  tipo: "compra" | "venta";
  Fecha: string;
  Id_TipoComprobante: number | null;
  PuntoVenta: string | null;
  Numero: string | null;
  Subtotal: number;
  Iva10_5: number;
  Iva21: number;
  Total: number;
  EntidadLegal: { RazonSocial: string } | null;
};

export type ResumenIva = {
  creditoFiscal: number;
  debitoFiscal: number;
  saldoTecnico: number;
};

function primerDiaDelMes() {
  const hoy = new Date();
  return toDateStr(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
}

const FACTURA_SELECT = "Id_Factura, Fecha, Id_TipoComprobante, PuntoVenta, Numero, Subtotal, Iva10_5, Iva21, Total, EntidadLegal(RazonSocial)";

type FacturaRow = Omit<FacturaIva, "tipo">;

export default function PosicionIvaReporteContainer() {
  const { campoActivo } = useCampoContext();
  const [fechaDesde, setFechaDesde] = useState(primerDiaDelMes());
  const [fechaHasta, setFechaHasta] = useState(hoyStr());
  const [facturas, setFacturas] = useState<FacturaIva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDatos = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Compras: no están ligadas a un campo. Ventas: sí, pero a nivel de
    // ítem (ItemHacienda), no de Factura.
    const comprasQuery = supabase
      .from("Factura")
      .select(FACTURA_SELECT)
      .eq("Id_TipoOperacion", TIPO_OPERACION.COMPRA)
      .gte("Fecha", fechaDesde)
      .lte("Fecha", fechaHasta);

    let ventasQuery = supabase
      .from("Factura")
      .select(`${FACTURA_SELECT}, ItemHacienda!inner(Id_Campo)`)
      .eq("Id_TipoOperacion", TIPO_OPERACION.VENTA)
      .gte("Fecha", fechaDesde)
      .lte("Fecha", fechaHasta);

    if (campoActivo) ventasQuery = ventasQuery.eq("ItemHacienda.Id_Campo", campoActivo.Id_Campo);

    const [{ data: compras, error: comprasError }, { data: ventas, error: ventasError }] =
      await Promise.all([comprasQuery, ventasQuery]);

    if (comprasError || ventasError) {
      setError((comprasError ?? ventasError)!.message);
    } else {
      const comprasFilas: FacturaIva[] = ((compras ?? []) as FacturaRow[]).map((f) => ({ ...f, tipo: "compra" }));
      const ventasFilas: FacturaIva[] = ((ventas ?? []) as FacturaRow[]).map((f) => ({ ...f, tipo: "venta" }));
      setFacturas([...comprasFilas, ...ventasFilas].sort((a, b) => a.Fecha.localeCompare(b.Fecha)));
    }

    setLoading(false);
  }, [campoActivo, fechaDesde, fechaHasta]);

  useEffect(() => { fetchDatos(); }, [fetchDatos]);

  const sumIva = (filas: FacturaIva[]) => filas.reduce((s, f) => s + (f.Iva10_5 ?? 0) + (f.Iva21 ?? 0), 0);
  const creditoFiscal = sumIva(facturas.filter((f) => f.tipo === "compra"));
  const debitoFiscal = sumIva(facturas.filter((f) => f.tipo === "venta"));
  const resumen: ResumenIva = { creditoFiscal, debitoFiscal, saldoTecnico: creditoFiscal - debitoFiscal };

  return (
    <PosicionIvaReporteView
      facturas={facturas}
      resumen={resumen}
      loading={loading}
      error={error}
      fechaDesde={fechaDesde}
      fechaHasta={fechaHasta}
      onFechaDesdeChange={setFechaDesde}
      onFechaHastaChange={setFechaHasta}
    />
  );
}
