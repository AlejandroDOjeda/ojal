"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toDateStr } from "@/lib/fecha";
import { useCampoContext } from "@/contexts/CampoContext";
import PosicionIvaCard from "./PosicionIvaCard";

export type PosicionIva = {
  creditoFiscal: number;
  debitoFiscal: number;
  saldoTecnico: number;
  mes: string;
};

function rangoMes(mes: number, anio: number) {
  const inicio = new Date(anio, mes, 1);
  const fin = new Date(anio, mes + 1, 0);
  return { inicio: toDateStr(inicio), fin: toDateStr(fin) };
}

function nombreMes(mes: number, anio: number) {
  const s = new Date(anio, mes, 1).toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

type Props = { mes: number; anio: number };

export default function PosicionIvaContainer({ mes, anio }: Props) {
  const { campoActivo } = useCampoContext();
  const [posicion, setPosicion] = useState<PosicionIva | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDatos = useCallback(async () => {
    setLoading(true);
    const { inicio, fin } = rangoMes(mes, anio);

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
        mes: nombreMes(mes, anio),
      });
    }

    setLoading(false);
  }, [campoActivo, mes, anio]);

  useEffect(() => { fetchDatos(); }, [fetchDatos]);

  return <PosicionIvaCard posicion={posicion} loading={loading} error={error} />;
}
