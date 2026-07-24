"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TIPO_OPERACION } from "@/lib/opciones";
import { toDateStr, hoyStr } from "@/lib/fecha";
import { useCampoContext } from "@/contexts/CampoContext";
import ResultadoReporteView from "./ResultadoReporteView";

export type GastoCategoria = {
  Id_CategoriaGasto: number | null;
  nombre: string;
  monto: number;
};

export type ResultadoResumen = {
  ingresos: number;
  totalGastos: number;
  resultado: number;
};

function primerDiaDelMes() {
  const hoy = new Date();
  return toDateStr(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
}

type VentaRow = { Subtotal: number };
type ItemGastoRow = {
  Subtotal: number;
  Id_CategoriaGasto: number | null;
  CategoriaGasto: { Nombre: string } | null;
};

export default function ResultadoReporteContainer() {
  const { campoActivo } = useCampoContext();
  const [fechaDesde, setFechaDesde] = useState(primerDiaDelMes());
  const [fechaHasta, setFechaHasta] = useState(hoyStr());
  const [ingresos, setIngresos] = useState(0);
  const [gastos, setGastos] = useState<GastoCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDatos = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Ingresos: ventas de hacienda, filtradas por campo vía ItemHacienda
    // (igual que el resto de los reportes — la venta se liga al campo a
    // nivel de ítem, no de factura).
    let ventasQuery = supabase
      .from("Factura")
      .select("Subtotal, ItemHacienda!inner(Id_Campo)")
      .eq("Id_TipoOperacion", TIPO_OPERACION.VENTA)
      .gte("Fecha", fechaDesde)
      .lte("Fecha", fechaHasta);
    if (campoActivo) ventasQuery = ventasQuery.eq("ItemHacienda.Id_Campo", campoActivo.Id_Campo);

    // Gastos: ItemGasto (combustible, veterinaria, arrendamiento, etc.), no
    // ligados a campo. Las compras de hacienda (ItemHacienda en facturas de
    // compra) quedan afuera: no tienen categoría de gasto, son compra de
    // stock, no un gasto del período.
    const gastosQuery = supabase
      .from("ItemGasto")
      .select("Subtotal, Id_CategoriaGasto, CategoriaGasto(Nombre), Factura!inner(Fecha, Id_TipoOperacion)")
      .eq("Factura.Id_TipoOperacion", TIPO_OPERACION.COMPRA)
      .gte("Factura.Fecha", fechaDesde)
      .lte("Factura.Fecha", fechaHasta);

    const [{ data: ventas, error: ventasError }, { data: itemsGasto, error: gastosError }] =
      await Promise.all([ventasQuery, gastosQuery]);

    if (ventasError || gastosError) {
      setError((ventasError ?? gastosError)!.message);
    } else {
      const totalIngresos = ((ventas ?? []) as VentaRow[]).reduce((s, f) => s + (f.Subtotal ?? 0), 0);
      setIngresos(totalIngresos);

      const acumulado = new Map<string, GastoCategoria>();
      for (const item of (itemsGasto ?? []) as ItemGastoRow[]) {
        const key = item.Id_CategoriaGasto === null ? "sin-categoria" : String(item.Id_CategoriaGasto);
        const prev = acumulado.get(key);
        acumulado.set(key, {
          Id_CategoriaGasto: item.Id_CategoriaGasto,
          nombre: item.CategoriaGasto?.Nombre ?? "Sin categoría",
          monto: (prev?.monto ?? 0) + (item.Subtotal ?? 0),
        });
      }
      setGastos(Array.from(acumulado.values()).sort((a, b) => b.monto - a.monto));
    }

    setLoading(false);
  }, [campoActivo, fechaDesde, fechaHasta]);

  useEffect(() => { fetchDatos(); }, [fetchDatos]);

  const totalGastos = gastos.reduce((s, g) => s + g.monto, 0);
  const resumen: ResultadoResumen = { ingresos, totalGastos, resultado: ingresos - totalGastos };

  return (
    <ResultadoReporteView
      gastos={gastos}
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
