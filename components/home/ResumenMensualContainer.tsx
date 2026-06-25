"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ResumenMensualCards from "./ResumenMensualCards";

export type ResumenMensual = {
  totalCompras: number;
  totalVentas: number;
  mes: string;
};

function rangoMesActual() {
  const hoy = new Date();
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { inicio: fmt(inicio), fin: fmt(fin) };
}

function nombreMes() {
  const s = new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function ResumenMensualContainer() {
  const [resumen, setResumen] = useState<ResumenMensual | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { inicio, fin } = rangoMesActual();

      const { data, error } = await supabase
        .from("Factura")
        .select("Id_TipoOperacion, Total")
        .gte("Fecha", inicio)
        .lte("Fecha", fin);

      if (error) {
        setError(error.message);
      } else {
        const filas = data ?? [];
        const totalCompras = filas
          .filter((f: any) => f.Id_TipoOperacion === 1)
          .reduce((sum: number, f: any) => sum + (f.Total ?? 0), 0);
        const totalVentas = filas
          .filter((f: any) => f.Id_TipoOperacion === 2)
          .reduce((sum: number, f: any) => sum + (f.Total ?? 0), 0);

        setResumen({ totalCompras, totalVentas, mes: nombreMes() });
      }

      setLoading(false);
    };

    fetch();
  }, []);

  return <ResumenMensualCards resumen={resumen} loading={loading} error={error} />;
}
