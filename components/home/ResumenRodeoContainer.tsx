"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ResumenRodeoCard from "./ResumenRodeoCard";

export type CategoriaStock = { nombre: string; cabezas: number };

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
        .select("Cabezas, CategoriaHacienda(Nombre)");

      if (error) {
        setError(error.message);
      } else {
        const categorias: CategoriaStock[] = (data ?? [])
          .map((r: any) => ({
            nombre: r.CategoriaHacienda?.Nombre ?? "",
            cabezas: r.Cabezas ?? 0,
          }))
          .sort((a: CategoriaStock, b: CategoriaStock) =>
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
