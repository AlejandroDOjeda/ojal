"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { signoComprobante } from "@/lib/opciones";
import { toDateStr } from "@/lib/fecha";
import { useCampoContext } from "@/contexts/CampoContext";
import ResumenMensualCards from "./ResumenMensualCards";

export type ResumenMensual = {
  totalCompras: number;
  totalVentas: number;
  mes: string;
};

function rangoMes(mes: number, anio: number) {
  const inicio = new Date(anio, mes, 1);
  const fin = new Date(anio, mes + 1, 0);
  return { inicio: toDateStr(inicio), fin: toDateStr(fin) };
}

function nombreMes(mes: number, anio: number) {
  const s = new Date(anio, mes, 1).toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

type Props = { mes: number; anio: number };

export default function ResumenMensualContainer({ mes, anio }: Props) {
  const { campoActivo } = useCampoContext();
  const [resumen, setResumen] = useState<ResumenMensual | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDatos = useCallback(async () => {
    setLoading(true);
    const { inicio, fin } = rangoMes(mes, anio);

    // Compras: no están ligadas a un campo. Ventas: sí, pero a nivel de
    // ítem (ItemHacienda), no de Factura.
    const comprasQuery = supabase
      .from("Factura")
      .select("Total, Id_TipoComprobante")
      .eq("Id_TipoOperacion", 1)
      .gte("Fecha", inicio)
      .lte("Fecha", fin);

    let ventasQuery = supabase
      .from("Factura")
      .select("Total, Id_TipoComprobante, ItemHacienda!inner(Id_Campo)")
      .eq("Id_TipoOperacion", 2)
      .gte("Fecha", inicio)
      .lte("Fecha", fin);

    if (campoActivo) ventasQuery = ventasQuery.eq("ItemHacienda.Id_Campo", campoActivo.Id_Campo);

    const [{ data: compras, error: comprasError }, { data: ventas, error: ventasError }] =
      await Promise.all([comprasQuery, ventasQuery]);

    if (comprasError || ventasError) {
      setError((comprasError ?? ventasError)!.message);
    } else {
      // Una Nota de Crédito resta del período, una Nota de Débito suma —
      // igual que una Factura común.
      type FilaTotal = { Total: number; Id_TipoComprobante: number | null };
      const sumTotal = (filas: FilaTotal[]) =>
        filas.reduce((sum, f) => sum + signoComprobante(f.Id_TipoComprobante) * (f.Total ?? 0), 0);
      const totalCompras = sumTotal((compras ?? []) as FilaTotal[]);
      const totalVentas = sumTotal((ventas ?? []) as FilaTotal[]);

      setResumen({ totalCompras, totalVentas, mes: nombreMes(mes, anio) });
    }

    setLoading(false);
  }, [campoActivo, mes, anio]);

  useEffect(() => { fetchDatos(); }, [fetchDatos]);

  return <ResumenMensualCards resumen={resumen} loading={loading} error={error} />;
}
