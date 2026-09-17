"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import CargaInicialView from "./CargaInicialView";

export type RodeoFila = {
  Id_Rodeo: number;
  Id_CategoriaHacienda: number;
  Cabezas: number;
  Nombre: string;
};

export default function CargaInicialContainer() {
  const { id, loteId } = useParams<{ id: string; loteId: string }>();
  const campoId = parseInt(id, 10);
  const idLote = parseInt(loteId, 10);

  const [nombreLote, setNombreLote] = useState<string | null>(null);
  const [filas, setFilas] = useState<RodeoFila[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLote = useCallback(async () => {
    const { data } = await supabase.from("Lote").select("Nombre").eq("Id_Lote", idLote).single();
    setNombreLote(data?.Nombre ?? null);
  }, [idLote]);

  const fetchRodeo = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("Rodeo")
      .select("Id_Rodeo, Id_CategoriaHacienda, Cabezas, CategoriaHacienda(Nombre)")
      .eq("Id_Lote", idLote);

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
  }, [idLote]);

  useEffect(() => { fetchLote(); fetchRodeo(); }, [fetchLote, fetchRodeo]);

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
      campoId={campoId}
      loteId={idLote}
      nombreLote={nombreLote}
      filas={filas}
      loading={loading}
      error={error}
      yaConfigurado={yaConfigurado}
      onGuardar={handleGuardar}
    />
  );
}
