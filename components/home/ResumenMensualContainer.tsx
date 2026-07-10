"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCampoContext } from "@/contexts/CampoContext";
import ResumenMensualCards from "./ResumenMensualCards";

export type ResumenMensual = {
  totalCompras: number;
  totalVentas: number;
  mes: string;
};

function rangoMesActual() {
  const hoy = new Date();
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { inicio: fmt(inicio), fin: fmt(fin) };
}

function nombreMes() {
  const s = new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function ResumenMensualContainer() {
  const { campoActivo } = useCampoContext();
  const [resumen, setResumen] = useState<ResumenMensual | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { inicio, fin } = rangoMesActual();

      // Compras: no están ligadas a un campo. Ventas: sí, pero a nivel de
      // ítem (ItemHacienda), no de Factura.
      const comprasQuery = supabase
        .from("Factura")
        .select("Total")
        .eq("Id_TipoOperacion", 1)
        .gte("Fecha", inicio)
        .lte("Fecha", fin);

      let ventasQuery = supabase
        .from("Factura")
        .select("Total, ItemHacienda!inner(Id_Campo)")
        .eq("Id_TipoOperacion", 2)
        .gte("Fecha", inicio)
        .lte("Fecha", fin);

      if (campoActivo) ventasQuery = ventasQuery.eq("ItemHacienda.Id_Campo", campoActivo.Id_Campo);

      const [{ data: compras, error: comprasError }, { data: ventas, error: ventasError }] =
        await Promise.all([comprasQuery, ventasQuery]);

      if (comprasError || ventasError) {
        setError((comprasError ?? ventasError)!.message);
      } else {
        const sumTotal = (filas: { Total: number }[]) => filas.reduce((sum, f) => sum + (f.Total ?? 0), 0);
        const totalCompras = sumTotal((compras ?? []) as { Total: number }[]);
        const totalVentas = sumTotal((ventas ?? []) as { Total: number }[]);

        setResumen({ totalCompras, totalVentas, mes: nombreMes() });
      }

      setLoading(false);
    };

    fetch();
  }, [campoActivo]);

  return <ResumenMensualCards resumen={resumen} loading={loading} error={error} />;
}
