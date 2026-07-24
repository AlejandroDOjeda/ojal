"use client";

import { useEffect, useState, useCallback } from "react";
import { parseISO } from "date-fns";
import { supabase } from "@/lib/supabaseClient";
import { TIPO_OPERACION } from "@/lib/opciones";
import { toDateStr } from "@/lib/fecha";
import { useCampoContext } from "@/contexts/CampoContext";
import ResultadoAnualChart from "./ResultadoAnualChart";

export type MesResultado = {
  label: string;
  ingresos: number;
  gastos: number;
  resultado: number;
};

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

type VentaRow = { Subtotal: number; Fecha: string };
type ItemGastoRow = { Subtotal: number; Factura: { Fecha: string } };

type Props = { anio: number; mesHasta: number };

export default function ResultadoAnualContainer({ anio, mesHasta }: Props) {
  const { campoActivo } = useCampoContext();
  const [meses, setMeses] = useState<MesResultado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDatos = useCallback(async () => {
    setLoading(true);
    setError(null);

    const desde = toDateStr(new Date(anio, 0, 1));
    const hasta = toDateStr(new Date(anio, mesHasta + 1, 0));

    let ventasQuery = supabase
      .from("Factura")
      .select("Subtotal, Fecha, ItemHacienda!inner(Id_Campo)")
      .eq("Id_TipoOperacion", TIPO_OPERACION.VENTA)
      .gte("Fecha", desde)
      .lte("Fecha", hasta);
    if (campoActivo) ventasQuery = ventasQuery.eq("ItemHacienda.Id_Campo", campoActivo.Id_Campo);

    const gastosQuery = supabase
      .from("ItemGasto")
      .select("Subtotal, Factura!inner(Fecha, Id_TipoOperacion)")
      .eq("Factura.Id_TipoOperacion", TIPO_OPERACION.COMPRA)
      .gte("Factura.Fecha", desde)
      .lte("Factura.Fecha", hasta);

    const [{ data: ventas, error: ventasError }, { data: itemsGasto, error: gastosError }] =
      await Promise.all([ventasQuery, gastosQuery]);

    if (ventasError || gastosError) {
      setError((ventasError ?? gastosError)!.message);
    } else {
      const ingresosPorMes = new Array(mesHasta + 1).fill(0);
      for (const f of (ventas ?? []) as VentaRow[]) {
        ingresosPorMes[parseISO(f.Fecha).getMonth()] += f.Subtotal ?? 0;
      }
      const gastosPorMes = new Array(mesHasta + 1).fill(0);
      for (const g of (itemsGasto ?? []) as ItemGastoRow[]) {
        gastosPorMes[parseISO(g.Factura.Fecha).getMonth()] += g.Subtotal ?? 0;
      }

      setMeses(
        MESES.slice(0, mesHasta + 1).map((label, i) => ({
          label,
          ingresos: ingresosPorMes[i],
          gastos: gastosPorMes[i],
          resultado: ingresosPorMes[i] - gastosPorMes[i],
        }))
      );
    }

    setLoading(false);
  }, [campoActivo, anio, mesHasta]);

  useEffect(() => { fetchDatos(); }, [fetchDatos]);

  return <ResultadoAnualChart meses={meses} loading={loading} error={error} anio={anio} />;
}
