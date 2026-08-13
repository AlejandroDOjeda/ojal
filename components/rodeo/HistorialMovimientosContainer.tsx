"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toDateStr, hoyStr } from "@/lib/fecha";
import HistorialMovimientosView from "./HistorialMovimientosView";

export type MovimientoFila = {
  Id_MovimientoRodeo: number;
  TipoMovimiento: string;
  Cabezas: number;
  Fecha: string;
  Id_Factura: number | null;
  Observaciones: string | null;
  Sentido: string | null;
  Id_Lote: number;
  Lote: { Nombre: string; Campo: { Nombre: string } | null } | null;
  LoteVinculado: { Nombre: string } | null;
  CategoriaHacienda: { Nombre: string } | null;
};

function primerDiaDelMes() {
  const hoy = new Date();
  return toDateStr(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
}

// MovimientoRodeo tiene dos FK a Lote (Id_Lote y Id_LoteVinculado, esta
// última solo para traslados) — hay que desambiguar el embed. Se usa el
// nombre de la constraint FK (forma canónica de PostgREST); el hint por
// nombre de columna (Lote!Id_Lote) tipaba bien pero PostgREST lo rechazaba
// en runtime con "more than one relationship was found".
const MOVIMIENTO_SELECT =
  "Id_MovimientoRodeo, TipoMovimiento, Cabezas, Fecha, Id_Factura, Observaciones, Sentido, Id_Lote, CategoriaHacienda(Nombre), Lote!MovimientoRodeo_Id_Lote_fkey(Nombre, Campo(Nombre)), LoteVinculado:Lote!MovimientoRodeo_Id_LoteVinculado_fkey(Nombre)";

export default function HistorialMovimientosContainer() {
  const [fechaDesde, setFechaDesde] = useState(primerDiaDelMes());
  const [fechaHasta, setFechaHasta] = useState(hoyStr());
  const [movimientos, setMovimientos] = useState<MovimientoFila[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovimientos = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("MovimientoRodeo")
      .select(MOVIMIENTO_SELECT)
      .gte("Fecha", fechaDesde)
      .lte("Fecha", fechaHasta)
      .order("Fecha", { ascending: false })
      .order("Id_MovimientoRodeo", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setMovimientos((data ?? []) as MovimientoFila[]);
    }
    setLoading(false);
  }, [fechaDesde, fechaHasta]);

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
    />
  );
}
