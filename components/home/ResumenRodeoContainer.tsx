"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ResumenRodeoCard from "./ResumenRodeoCard";

export type CategoriaStock = { id: number; nombre: string; cabezas: number };

export type ResumenRodeo = {
  total: number;
  categorias: CategoriaStock[];
};

export default function ResumenRodeoContainer() {
  const [resumen, setResumen] = useState<ResumenRodeo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("Rodeo")
        .select("Id_CategoriaHacienda, Cabezas, CategoriaHacienda(Nombre)");

      if (error) {
        setError(error.message);
      } else {
        // Puede haber múltiples filas por categoría (una por campo) —
        // las agrupamos sumando cabezas por Id_CategoriaHacienda.
        type Fila = {
          Id_CategoriaHacienda: number;
          Cabezas: number | null;
          CategoriaHacienda: { Nombre: string } | null;
        };
        const acumulado = new Map<number, CategoriaStock>();
        for (const r of (data ?? []) as Fila[]) {
          const id = r.Id_CategoriaHacienda;
          const prev = acumulado.get(id);
          acumulado.set(id, {
            id,
            nombre: r.CategoriaHacienda?.Nombre ?? "",
            cabezas: (prev?.cabezas ?? 0) + (r.Cabezas ?? 0),
          });
        }
        const categorias = Array.from(acumulado.values()).sort((a, b) =>
          a.nombre.localeCompare(b.nombre, "es")
        );

        setResumen({
          total: categorias.reduce((s, c) => s + c.cabezas, 0),
          categorias,
        });
      }

      setLoading(false);
    };

    fetch();
  }, []);

  return <ResumenRodeoCard resumen={resumen} loading={loading} error={error} />;
}
