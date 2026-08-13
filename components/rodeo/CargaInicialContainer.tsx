"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCampoContext } from "@/contexts/CampoContext";
import CargaInicialView from "./CargaInicialView";

export type RodeoFila = {
  Id_Rodeo: number;
  Id_CategoriaHacienda: number;
  Cabezas: number;
  Nombre: string;
};

export type LoteOption = { Id_Lote: number; Nombre: string };

export default function CargaInicialContainer() {
  const { campos } = useCampoContext();
  const [campoId, setCampoId] = useState<number | null>(null);
  const [lotes, setLotes] = useState<LoteOption[]>([]);
  const [loteId, setLoteId] = useState<number | null>(null);
  const [filas, setFilas] = useState<RodeoFila[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLotes = useCallback(async () => {
    if (!campoId) {
      setLotes([]); setLoteId(null); setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("Lote")
      .select("Id_Lote, Nombre")
      .eq("Id_Campo", campoId)
      .order("Nombre");
    const lista = (data ?? []) as LoteOption[];
    setLotes(lista);
    setLoteId(lista.length === 1 ? lista[0].Id_Lote : null);
  }, [campoId]);

  const fetchRodeo = useCallback(async () => {
    if (!loteId) {
      setFilas([]); setLoading(false); return;
    }
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("Rodeo")
      .select("Id_Rodeo, Id_CategoriaHacienda, Cabezas, CategoriaHacienda(Nombre)")
      .eq("Id_Lote", loteId);

    if (error) {
      setError(error.message);
    } else {
      type Fila = {
        Id_Rodeo: number;
        Id_CategoriaHacienda: number;
        Cabezas: number;
        CategoriaHacienda: { Nombre: string } | null;
      };
      const mapped: RodeoFila[] = ((data ?? []) as Fila[])
        .map((row) => ({
          Id_Rodeo: row.Id_Rodeo,
          Id_CategoriaHacienda: row.Id_CategoriaHacienda,
          Cabezas: row.Cabezas,
          Nombre: row.CategoriaHacienda?.Nombre ?? "",
        }))
        .sort((a: RodeoFila, b: RodeoFila) => a.Nombre.localeCompare(b.Nombre, "es"));
      setFilas(mapped);
    }

    setLoading(false);
  }, [loteId]);

  useEffect(() => { fetchLotes(); }, [fetchLotes]);
  useEffect(() => { fetchRodeo(); }, [fetchRodeo]);

  const yaConfigurado = filas.some((f) => f.Cabezas > 0);

  const handleGuardar = async (cabezasMap: Record<number, number>) => {
    const updates = filas.map((fila) =>
      supabase
        .from("Rodeo")
        .update({ Cabezas: cabezasMap[fila.Id_CategoriaHacienda] ?? 0 })
        .eq("Id_Rodeo", fila.Id_Rodeo)
    );

    const results = await Promise.all(updates);
    const primerError = results.find((r) => r.error)?.error;
    if (primerError) throw new Error(primerError.message);

    await fetchRodeo();
  };

  return (
    <CargaInicialView
      filas={filas}
      campos={campos}
      campoId={campoId}
      onCampoChange={setCampoId}
      lotes={lotes}
      loteId={loteId}
      onLoteChange={setLoteId}
      loading={loading}
      error={error}
      yaConfigurado={yaConfigurado}
      sinLotes={!!campoId && lotes.length === 0}
      onGuardar={handleGuardar}
    />
  );
}
