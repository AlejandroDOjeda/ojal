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

export default function CargaInicialContainer() {
  const { campoActivo } = useCampoContext();
  const [filas, setFilas] = useState<RodeoFila[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRodeo = useCallback(async () => {
    if (!campoActivo) {
      setFilas([]); setLoading(false); return;
    }
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("Rodeo")
      .select("Id_Rodeo, Id_CategoriaHacienda, Cabezas, CategoriaHacienda(Nombre)")
      .eq("Id_Campo", campoActivo.Id_Campo);

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
  }, [campoActivo]);

  useEffect(() => {
    fetchRodeo();
  }, [fetchRodeo]);

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
      loading={loading}
      error={error}
      yaConfigurado={yaConfigurado}
      sinCampo={!campoActivo}
      onGuardar={handleGuardar}
    />
  );
}
