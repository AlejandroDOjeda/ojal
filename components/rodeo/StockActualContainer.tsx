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

export default function StockActualContainer() {
  const { campoActivo } = useCampoContext();
  const [filas, setFilas] = useState<StockFila[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("Rodeo")
      .select("Id_CategoriaHacienda, Cabezas, CategoriaHacienda(Nombre)");

    if (campoActivo) query = query.eq("Id_Campo", campoActivo.Id_Campo);

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      // En modo "Todos" pueden llegar múltiples filas por categoría (una por campo).
      // Las agrupamos sumando cabezas por categoría.
      type Fila = {
        Id_CategoriaHacienda: number;
        Cabezas: number;
        CategoriaHacienda: { Nombre: string } | null;
      };
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
  }, [campoActivo]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const sinDatos = filas.every((f) => f.Cabezas === 0);

  return (
    <StockActualView
      filas={filas}
      loading={loading}
      error={error}
      sinDatos={sinDatos}
    />
  );
}
