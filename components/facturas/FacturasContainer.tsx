"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TIPO_OPERACION } from "@/lib/opciones";
import { toDateStr, hoyStr } from "@/lib/fecha";
import FacturasView from "./FacturasView";

export type FacturaResumen = {
  Id_Factura:          number;
  Id_TipoOperacion:    number;
  Id_TipoComprobante:  number | null;
  PuntoVenta:          string | null;
  Numero:              string | null;
  Fecha:               string;
  Subtotal:            number;
  Iva10_5:             number;
  Iva21:               number;
  Total:               number;
  EntidadLegal:        { RazonSocial: string } | null;
  FacturaAsociada:     { Id_TipoComprobante: number | null } | null;
};

function primerDiaDelMes() {
  const hoy = new Date();
  return toDateStr(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
}

// FacturaAsociada: solo se completa para Notas de Crédito/Débito — se usa
// para inferir la letra (A/B/C) que la nota hereda de la factura corregida.
const FACTURA_SELECT = "Id_Factura, Id_TipoOperacion, Id_TipoComprobante, PuntoVenta, Numero, Fecha, Subtotal, Iva10_5, Iva21, Total, EntidadLegal(RazonSocial), FacturaAsociada:Id_FacturaAsociada(Id_TipoComprobante)";

export default function FacturasContainer() {
  const [fechaDesde, setFechaDesde] = useState(primerDiaDelMes());
  const [fechaHasta, setFechaHasta] = useState(hoyStr());
  const [compras, setCompras] = useState<FacturaResumen[]>([]);
  const [ventas, setVentas] = useState<FacturaResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFacturas = useCallback(async () => {
    setLoading(true); setError(null);

    const comprasQuery = supabase
      .from("Factura")
      .select(FACTURA_SELECT)
      .eq("Id_TipoOperacion", TIPO_OPERACION.COMPRA)
      .gte("Fecha", fechaDesde)
      .lte("Fecha", fechaHasta)
      .order("Fecha", { ascending: false });

    const ventasQuery = supabase
      .from("Factura")
      .select(FACTURA_SELECT)
      .eq("Id_TipoOperacion", TIPO_OPERACION.VENTA)
      .gte("Fecha", fechaDesde)
      .lte("Fecha", fechaHasta)
      .order("Fecha", { ascending: false });

    const [{ data: comprasData, error: comprasError }, { data: ventasData, error: ventasError }] =
      await Promise.all([comprasQuery, ventasQuery]);

    if (comprasError || ventasError) {
      setError((comprasError ?? ventasError)!.message);
    } else {
      setCompras((comprasData ?? []) as FacturaResumen[]);
      setVentas((ventasData ?? []) as FacturaResumen[]);
    }
    setLoading(false);
  }, [fechaDesde, fechaHasta]);

  useEffect(() => { fetchFacturas(); }, [fetchFacturas]);

  const handleDelete = async (id: number) => {
    await Promise.all([
      supabase.from("ItemGasto").delete().eq("Id_Factura", id),
      supabase.from("ItemHacienda").delete().eq("Id_Factura", id),
    ]);
    const { error: delError } = await supabase.from("Factura").delete().eq("Id_Factura", id);
    if (delError) throw new Error(delError.message);
    await fetchFacturas();
  };

  return (
    <FacturasView
      compras={compras}
      ventas={ventas}
      loading={loading}
      error={error}
      fechaDesde={fechaDesde}
      fechaHasta={fechaHasta}
      onFechaDesdeChange={setFechaDesde}
      onFechaHastaChange={setFechaHasta}
      onDelete={handleDelete}
    />
  );
}
