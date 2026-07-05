"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TIPO_OPERACION } from "@/lib/opciones";
import { useCampoContext } from "@/contexts/CampoContext";
import FacturasView from "./FacturasView";

export type FacturaResumen = {
  Id_Factura:          number;
  Id_TipoOperacion:    number;
  Id_TipoComprobante:  number | null;
  PuntoVenta:          string | null;
  Numero:              string | null;
  Fecha:               string;
  Total:               number;
  EntidadLegal:        { RazonSocial: string } | null;
};

export default function FacturasContainer() {
  const { campoActivo } = useCampoContext();
  const [compras, setCompras] = useState<FacturaResumen[]>([]);
  const [ventas, setVentas] = useState<FacturaResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFacturas = useCallback(async () => {
    setLoading(true); setError(null);

    // Las compras no están ligadas a un campo. Las ventas sí, pero a nivel de
    // ítem (ItemHacienda), no de Factura: se filtran vía join con ese campo.
    const comprasQuery = supabase
      .from("Factura")
      .select("Id_Factura, Id_TipoOperacion, Id_TipoComprobante, PuntoVenta, Numero, Fecha, Total, EntidadLegal(RazonSocial)")
      .eq("Id_TipoOperacion", TIPO_OPERACION.COMPRA)
      .order("Fecha", { ascending: false });

    let ventasQuery = supabase
      .from("Factura")
      .select("Id_Factura, Id_TipoOperacion, Id_TipoComprobante, PuntoVenta, Numero, Fecha, Total, EntidadLegal(RazonSocial), ItemHacienda!inner(Id_Campo)")
      .eq("Id_TipoOperacion", TIPO_OPERACION.VENTA)
      .order("Fecha", { ascending: false });

    if (campoActivo) ventasQuery = ventasQuery.eq("ItemHacienda.Id_Campo", campoActivo.Id_Campo);

    const [{ data: comprasData, error: comprasError }, { data: ventasData, error: ventasError }] =
      await Promise.all([comprasQuery, ventasQuery]);

    if (comprasError || ventasError) {
      setError((comprasError ?? ventasError)!.message);
    } else {
      setCompras((comprasData ?? []) as FacturaResumen[]);
      setVentas((ventasData ?? []) as FacturaResumen[]);
    }
    setLoading(false);
  }, [campoActivo]);

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

  return <FacturasView compras={compras} ventas={ventas} loading={loading} error={error} onDelete={handleDelete} />;
}
