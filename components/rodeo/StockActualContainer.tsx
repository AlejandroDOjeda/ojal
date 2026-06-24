"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import StockActualView from "./StockActualView";

export type StockFila = {
  Id_CategoriaHacienda: number;
  Nombre: string;
  Cabezas: number;
};

export default function StockActualContainer() {
  const [filas, setFilas] = useState<StockFila[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("Rodeo")
      .select("Id_CategoriaHacienda, Cabezas, CategoriaHacienda(Nombre)");

    if (error) {
      setError(error.message);
    } else {
      const mapped: StockFila[] = (data ?? [])
        .map((row: any) => ({
          Id_CategoriaHacienda: row.Id_CategoriaHacienda,
          Nombre: row.CategoriaHacienda?.Nombre ?? "",
          Cabezas: row.Cabezas,
        }))
        .sort((a: StockFila, b: StockFila) =>
          a.Nombre.localeCompare(b.Nombre, "es")
        );
      setFilas(mapped);
    }

    setLoading(false);
  }, []);

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
