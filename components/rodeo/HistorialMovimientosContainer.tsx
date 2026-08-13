"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toDateStr, hoyStr } from "@/lib/fecha";
import { useCampoContext } from "@/contexts/CampoContext";
import HistorialMovimientosView from "./HistorialMovimientosView";

export type MovimientoFila = {
  Id_MovimientoRodeo: number;
  TipoMovimiento: string;
  Cabezas: number;
  Fecha: string;
  Id_Factura: number | null;
  Observaciones: string | null;
  Sentido: string | null;
  CategoriaHacienda: { Nombre: string } | null;
  Campo: { Nombre: string } | null;
};

function primerDiaDelMes() {
  const hoy = new Date();
  return toDateStr(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
}

const MOVIMIENTO_SELECT =
  "Id_MovimientoRodeo, TipoMovimiento, Cabezas, Fecha, Id_Factura, Observaciones, Sentido, CategoriaHacienda(Nombre), Campo(Nombre)";

export default function HistorialMovimientosContainer() {
  const { campoActivo } = useCampoContext();
  const [fechaDesde, setFechaDesde] = useState(primerDiaDelMes());
  const [fechaHasta, setFechaHasta] = useState(hoyStr());
  const [movimientos, setMovimientos] = useState<MovimientoFila[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovimientos = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("MovimientoRodeo")
      .select(MOVIMIENTO_SELECT)
      .gte("Fecha", fechaDesde)
      .lte("Fecha", fechaHasta)
      .order("Fecha", { ascending: false })
      .order("Id_MovimientoRodeo", { ascending: false });

    if (campoActivo) query = query.eq("Id_Campo", campoActivo.Id_Campo);

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setMovimientos((data ?? []) as MovimientoFila[]);
    }
    setLoading(false);
  }, [campoActivo, fechaDesde, fechaHasta]);

  useEffect(() => {
    fetchMovimientos();
  }, [fetchMovimientos]);

  return (
    <HistorialMovimientosView
      movimientos={movimientos}
      loading={loading}
      error={error}
      fechaDesde={fechaDesde}
      fechaHasta={fechaHasta}
      onFechaDesdeChange={setFechaDesde}
      onFechaHastaChange={setFechaHasta}
      mostrarCampo={!campoActivo}
    />
  );
}
