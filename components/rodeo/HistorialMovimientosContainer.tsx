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
  Id_Lote: number;
  Lote: { Nombre: string; Campo: { Nombre: string } | null } | null;
  LoteVinculado: { Nombre: string } | null;
  CategoriaHacienda: { Nombre: string } | null;
};

export type LoteOption = { Id_Lote: number; Nombre: string };

function primerDiaDelMes() {
  const hoy = new Date();
  return toDateStr(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
}

// MovimientoRodeo tiene dos FK a Lote (Id_Lote y Id_LoteVinculado, esta
// última solo para traslados) — hay que desambiguar el embed. El hint por
// nombre de columna (Lote!Id_Lote) no lo reconoce PostgREST en runtime
// (aunque el tipado de supabase-js lo acepta), así que se usa el nombre de
// la constraint FK, que es la forma canónica y sin ambigüedad posible. El
// filtro por campo se hace vía Id_Lote IN (...) en vez de un embedded
// filter — se resuelven los lotes del campo activo aparte (ya se hace para
// el filtro de la UI) y se filtra por esa lista.
const MOVIMIENTO_SELECT =
  "Id_MovimientoRodeo, TipoMovimiento, Cabezas, Fecha, Id_Factura, Observaciones, Sentido, Id_Lote, CategoriaHacienda(Nombre), Lote!MovimientoRodeo_Id_Lote_fkey(Nombre, Campo(Nombre)), LoteVinculado:Lote!MovimientoRodeo_Id_LoteVinculado_fkey(Nombre)";

export default function HistorialMovimientosContainer() {
  const { campoActivo } = useCampoContext();
  const [fechaDesde, setFechaDesde] = useState(primerDiaDelMes());
  const [fechaHasta, setFechaHasta] = useState(hoyStr());
  const [movimientos, setMovimientos] = useState<MovimientoFila[]>([]);
  const [lotes, setLotes] = useState<LoteOption[]>([]);
  const [loteFiltro, setLoteFiltro] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLotes = useCallback(async () => {
    if (!campoActivo) { setLotes([]); return; }
    const { data } = await supabase
      .from("Lote")
      .select("Id_Lote, Nombre")
      .eq("Id_Campo", campoActivo.Id_Campo)
      .order("Nombre");
    setLotes((data ?? []) as LoteOption[]);
  }, [campoActivo]);

  const fetchMovimientos = useCallback(async () => {
    // Con campo activo pero sin lotes todavía (fetchLotes no terminó, o el
    // campo no tiene lotes), no hay nada que traer.
    if (campoActivo && lotes.length === 0) {
      setMovimientos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let query = supabase
      .from("MovimientoRodeo")
      .select(MOVIMIENTO_SELECT)
      .gte("Fecha", fechaDesde)
      .lte("Fecha", fechaHasta)
      .order("Fecha", { ascending: false })
      .order("Id_MovimientoRodeo", { ascending: false });

    if (loteFiltro) {
      query = query.eq("Id_Lote", loteFiltro);
    } else if (campoActivo) {
      query = query.in("Id_Lote", lotes.map((l) => l.Id_Lote));
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setMovimientos((data ?? []) as MovimientoFila[]);
    }
    setLoading(false);
  }, [campoActivo, lotes, loteFiltro, fechaDesde, fechaHasta]);

  useEffect(() => {
    setLoteFiltro(null);
    fetchLotes();
  }, [fetchLotes]);

  useEffect(() => {
    fetchMovimientos();
  }, [fetchMovimientos]);

  return (
    <HistorialMovimientosView
      movimientos={movimientos}
      lotes={lotes}
      loteFiltro={loteFiltro}
      onLoteFiltroChange={setLoteFiltro}
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
