"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCampoContext } from "@/contexts/CampoContext";
import StockActualView from "./StockActualView";

export type StockFila = {
  Id_CategoriaHacienda: number;
  Nombre: string;
  Cabezas: number;
};

export type LoteOption = { Id_Lote: number; Nombre: string };

export default function StockActualContainer() {
  const { campoActivo } = useCampoContext();
  const [filas, setFilas] = useState<StockFila[]>([]);
  const [lotes, setLotes] = useState<LoteOption[]>([]);
  const [loteFiltro, setLoteFiltro] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLotes = useCallback(async () => {
    if (!campoActivo) {
      setLotes([]);
      return;
    }
    const { data } = await supabase
      .from("Lote")
      .select("Id_Lote, Nombre")
      .eq("Id_Campo", campoActivo.Id_Campo)
      .order("Nombre");
    setLotes((data ?? []) as LoteOption[]);
  }, [campoActivo]);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    setError(null);

    type Fila = {
      Id_CategoriaHacienda: number;
      Cabezas: number;
      CategoriaHacienda: { Nombre: string } | null;
    };

    const SELECT_CON_LOTE = "Id_CategoriaHacienda, Cabezas, CategoriaHacienda(Nombre), Lote!inner(Id_Campo)";
    const SELECT_SIN_LOTE = "Id_CategoriaHacienda, Cabezas, CategoriaHacienda(Nombre)";

    let query = campoActivo
      ? supabase.from("Rodeo").select(SELECT_CON_LOTE).eq("Lote.Id_Campo", campoActivo.Id_Campo)
      : supabase.from("Rodeo").select(SELECT_SIN_LOTE);
    if (campoActivo && loteFiltro) query = query.eq("Id_Lote", loteFiltro);

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      // Pueden llegar múltiples filas por categoría (una por lote). Las
      // agrupamos sumando cabezas por categoría.
      const acumulado = new Map<number, StockFila>();
      for (const row of (data ?? []) as Fila[]) {
        const id = row.Id_CategoriaHacienda;
        const nombre = row.CategoriaHacienda?.Nombre ?? "";
        const prev = acumulado.get(id);
        acumulado.set(id, {
          Id_CategoriaHacienda: id,
          Nombre: nombre,
          Cabezas: (prev?.Cabezas ?? 0) + row.Cabezas,
        });
      }
      const mapped = Array.from(acumulado.values()).sort((a, b) =>
        a.Nombre.localeCompare(b.Nombre, "es")
      );
      setFilas(mapped);
    }

    setLoading(false);
  }, [campoActivo, loteFiltro]);

  useEffect(() => {
    setLoteFiltro(null);
    fetchLotes();
  }, [fetchLotes]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const sinDatos = filas.every((f) => f.Cabezas === 0);

  return (
    <StockActualView
      filas={filas}
      lotes={lotes}
      loteFiltro={loteFiltro}
      onLoteFiltroChange={setLoteFiltro}
      loading={loading}
      error={error}
      sinDatos={sinDatos}
    />
  );
}
