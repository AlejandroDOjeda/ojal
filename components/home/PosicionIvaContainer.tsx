"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCampoContext } from "@/contexts/CampoContext";
import PosicionIvaCard from "./PosicionIvaCard";

export type PosicionIva = {
  creditoFiscal: number;
  debitoFiscal: number;
  saldoTecnico: number;
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

export default function PosicionIvaContainer() {
  const { campoActivo } = useCampoContext();
  const [posicion, setPosicion] = useState<PosicionIva | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { inicio, fin } = rangoMesActual();

      let query = supabase
        .from("Factura")
        .select("Id_TipoOperacion, Iva10_5, Iva21")
        .gte("Fecha", inicio)
        .lte("Fecha", fin);

      if (campoActivo) query = query.eq("Id_Campo", campoActivo.Id_Campo);

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        const filas = data ?? [];

        // Compras: el negocio paga IVA → crédito fiscal
        const creditoFiscal = filas
          .filter((f: any) => f.Id_TipoOperacion === 1)
          .reduce((s: number, f: any) => s + (f.Iva10_5 ?? 0) + (f.Iva21 ?? 0), 0);

        // Ventas: el negocio cobra IVA → débito fiscal
        const debitoFiscal = filas
          .filter((f: any) => f.Id_TipoOperacion === 2)
          .reduce((s: number, f: any) => s + (f.Iva10_5 ?? 0) + (f.Iva21 ?? 0), 0);

        setPosicion({
          creditoFiscal,
          debitoFiscal,
          saldoTecnico: creditoFiscal - debitoFiscal,
          mes: nombreMes(),
        });
      }

      setLoading(false);
    };

    fetch();
  }, [campoActivo]);

  return <PosicionIvaCard posicion={posicion} loading={loading} error={error} />;
}
