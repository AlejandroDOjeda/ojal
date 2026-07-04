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
    let query = supabase
      .from("Factura")
      .select("Id_Factura, Id_TipoOperacion, Id_TipoComprobante, PuntoVenta, Numero, Fecha, Total, EntidadLegal(RazonSocial)")
      .order("Fecha", { ascending: false });

    if (campoActivo) query = query.eq("Id_Campo", campoActivo.Id_Campo);

    const { data, error } = await query;

    if (error) { setError(error.message); }
    else {
      const rows = (data ?? []) as FacturaResumen[];
      setCompras(rows.filter((f) => f.Id_TipoOperacion === TIPO_OPERACION.COMPRA));
      setVentas(rows.filter((f) => f.Id_TipoOperacion === TIPO_OPERACION.VENTA));
    }
    setLoading(false);
  }, [campoActivo]);

  useEffect(() => { fetchFacturas(); }, [fetchFacturas]);

  return <FacturasView compras={compras} ventas={ventas} loading={loading} error={error} />;
}
