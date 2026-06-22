"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import FacturasView from "./FacturasView";

export type FacturaResumen = {
  id: string;
  tipo_operacion: "compra" | "venta";
  tipo_comprobante: "A" | "B" | "C" | "liquidacion_hacienda";
  punto_venta: string | null;
  numero: string | null;
  fecha: string;
  estado: "borrador" | "confirmada" | "pagada" | "cobrada" | "anulada";
  total: number;
  entidad_legal: { razon_social: string } | null;
};

export default function FacturasContainer() {
  const [compras, setCompras] = useState<FacturaResumen[]>([]);
  const [ventas, setVentas] = useState<FacturaResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFacturas = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("factura")
      .select("id, tipo_operacion, tipo_comprobante, punto_venta, numero, fecha, estado, total, entidad_legal(razon_social)")
      .order("fecha", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      const rows = (data ?? []) as FacturaResumen[];
      setCompras(rows.filter((f) => f.tipo_operacion === "compra"));
      setVentas(rows.filter((f) => f.tipo_operacion === "venta"));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFacturas();
  }, [fetchFacturas]);

  return (
    <FacturasView
      compras={compras}
      ventas={ventas}
      loading={loading}
      error={error}
    />
  );
}
