"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import LoteDetalleView from "./LoteDetalleView";

export type StockFila = {
  Id_CategoriaHacienda: number;
  Nombre: string;
  Cabezas: number;
};

export type LoteInfo = {
  Id_Lote:  number;
  Id_Campo: number;
  Nombre:   string;
  Campo:    { Nombre: string } | null;
};

export default function LoteDetalleContainer() {
  const { id, loteId } = useParams<{ id: string; loteId: string }>();
  const campoId = parseInt(id, 10);
  const idLote = parseInt(loteId, 10);

  const [lote, setLote] = useState<LoteInfo | null>(null);
  const [filas, setFilas] = useState<StockFila[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLote = useCallback(async () => {
    const { data, error } = await supabase
      .from("Lote")
      .select("Id_Lote, Id_Campo, Nombre, Campo(Nombre)")
      .eq("Id_Lote", idLote)
      .eq("Id_Campo", campoId)
      .single();
    if (error || !data) { setNotFound(true); return; }
    setLote(data as unknown as LoteInfo);
  }, [idLote, campoId]);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("Rodeo")
      .select("Id_CategoriaHacienda, Cabezas, CategoriaHacienda(Nombre)")
      .eq("Id_Lote", idLote);

    if (error) {
      setError(error.message);
    } else {
      type Fila = {
        Id_CategoriaHacienda: number;
        Cabezas: number;
        CategoriaHacienda: { Nombre: string } | null;
      };
      const mapped = ((data ?? []) as Fila[])
        .map((row) => ({
          Id_CategoriaHacienda: row.Id_CategoriaHacienda,
          Nombre: row.CategoriaHacienda?.Nombre ?? "",
          Cabezas: row.Cabezas,
        }))
        .sort((a, b) => a.Nombre.localeCompare(b.Nombre, "es"));
      setFilas(mapped);
    }

    setLoading(false);
  }, [idLote]);

  useEffect(() => { fetchLote(); fetchStock(); }, [fetchLote, fetchStock]);

  const sinDatos = filas.every((f) => f.Cabezas === 0);

  return (
    <LoteDetalleView
      lote={lote}
      filas={filas}
      loading={loading}
      notFound={notFound}
      error={error}
      sinDatos={sinDatos}
      idLote={idLote}
    />
  );
}
