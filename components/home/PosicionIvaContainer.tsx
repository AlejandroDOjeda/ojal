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

      // Compras: no están ligadas a un campo. Ventas: sí, pero a nivel de
      // ítem (ItemHacienda), no de Factura.
      const comprasQuery = supabase
        .from("Factura")
        .select("Iva10_5, Iva21")
        .eq("Id_TipoOperacion", 1)
        .gte("Fecha", inicio)
        .lte("Fecha", fin);

      let ventasQuery = supabase
        .from("Factura")
        .select("Iva10_5, Iva21, ItemHacienda!inner(Id_Campo)")
        .eq("Id_TipoOperacion", 2)
        .gte("Fecha", inicio)
        .lte("Fecha", fin);

      if (campoActivo) ventasQuery = ventasQuery.eq("ItemHacienda.Id_Campo", campoActivo.Id_Campo);

      const [{ data: compras, error: comprasError }, { data: ventas, error: ventasError }] =
        await Promise.all([comprasQuery, ventasQuery]);

      if (comprasError || ventasError) {
        setError((comprasError ?? ventasError)!.message);
      } else {
        const sumIva = (filas: { Iva10_5: number; Iva21: number }[]) =>
          filas.reduce((s, f) => s + (f.Iva10_5 ?? 0) + (f.Iva21 ?? 0), 0);

        // Compras: el negocio paga IVA → crédito fiscal
        const creditoFiscal = sumIva((compras ?? []) as { Iva10_5: number; Iva21: number }[]);

        // Ventas: el negocio cobra IVA → débito fiscal
        const debitoFiscal = sumIva((ventas ?? []) as { Iva10_5: number; Iva21: number }[]);

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
