"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { formatRenspa } from "@/lib/formato";
import CampoDetalleView from "./CampoDetalleView";
import type { CampoRow } from "../CamposContainer";
import type { CampoFormData } from "../CampoFormDialog";

export type LoteRow = {
  Id_Lote: number;
  Nombre:  string;
  Cabezas: number;
};

export type LoteFormData = { Nombre: string };

export default function CampoDetalleContainer() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const campoId = parseInt(id, 10);

  const [campo, setCampo] = useState<CampoRow | null>(null);
  const [lotes, setLotes] = useState<LoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampo = useCallback(async () => {
    const { data, error } = await supabase
      .from("Campo")
      .select("Id_Campo, Nombre, Renspa, Ubicacion, Superficie, CreatedAt")
      .eq("Id_Campo", campoId)
      .single();
    if (error || !data) { setNotFound(true); return; }
    setCampo(data);
  }, [campoId]);

  const fetchLotes = useCallback(async () => {
    setLoading(true); setError(null);

    const { data: lotesData, error: lotesError } = await supabase
      .from("Lote")
      .select("Id_Lote, Nombre")
      .eq("Id_Campo", campoId)
      .order("Nombre");
    if (lotesError) { setError(lotesError.message); setLoading(false); return; }

    const idsLote = (lotesData ?? []).map((l) => l.Id_Lote);
    const stockPorLote = new Map<number, number>();
    if (idsLote.length > 0) {
      const { data: rodeoData, error: rodeoError } = await supabase
        .from("Rodeo")
        .select("Id_Lote, Cabezas")
        .in("Id_Lote", idsLote);
      if (rodeoError) { setError(rodeoError.message); setLoading(false); return; }
      for (const row of rodeoData ?? []) {
        stockPorLote.set(row.Id_Lote, (stockPorLote.get(row.Id_Lote) ?? 0) + row.Cabezas);
      }
    }

    setLotes(
      (lotesData ?? []).map((l) => ({
        Id_Lote: l.Id_Lote,
        Nombre:  l.Nombre,
        Cabezas: stockPorLote.get(l.Id_Lote) ?? 0,
      }))
    );
    setLoading(false);
  }, [campoId]);

  useEffect(() => { fetchCampo(); fetchLotes(); }, [fetchCampo, fetchLotes]);

  const handleUpdateCampo = async (f: CampoFormData) => {
    const renspaFormateado = f.Renspa ? formatRenspa(f.Renspa) : null;
    const { error } = await supabase.from("Campo").update({
      Nombre:     f.Nombre.trim(),
      Renspa:     renspaFormateado && renspaFormateado.length > 0 ? renspaFormateado : null,
      Ubicacion:  f.Ubicacion.trim() || null,
      Superficie: f.Superficie ? parseFloat(f.Superficie) : null,
    }).eq("Id_Campo", campoId);
    if (error) throw new Error(error.message);
    await fetchCampo();
  };

  const handleDeleteCampo = async () => {
    const { error } = await supabase.from("Campo").delete().eq("Id_Campo", campoId);
    if (error) {
      if (error.code === "23503") throw new Error("No se puede eliminar: el campo tiene facturas o movimientos asociados.");
      throw new Error(error.message);
    }
    router.push("/campos");
  };

  const handleCreateLote = async (f: LoteFormData) => {
    const { error } = await supabase.from("Lote").insert({
      Id_Campo: campoId,
      Nombre:   f.Nombre.trim(),
    });
    if (error) throw new Error(error.message);
    await fetchLotes();
  };

  const handleUpdateLote = async (loteId: number, f: LoteFormData) => {
    const { error } = await supabase.from("Lote").update({
      Nombre: f.Nombre.trim(),
    }).eq("Id_Lote", loteId);
    if (error) throw new Error(error.message);
    await fetchLotes();
  };

  const handleDeleteLote = async (loteId: number) => {
    const { error } = await supabase.from("Lote").delete().eq("Id_Lote", loteId);
    if (error) {
      if (error.code === "23503") throw new Error("No se puede eliminar: el lote tiene rodeo, movimientos o facturas asociadas.");
      throw new Error(error.message);
    }
    await fetchLotes();
  };

  return (
    <CampoDetalleView
      campo={campo}
      lotes={lotes}
      loading={loading}
      notFound={notFound}
      error={error}
      onUpdateCampo={handleUpdateCampo}
      onDeleteCampo={handleDeleteCampo}
      onCreateLote={handleCreateLote}
      onUpdateLote={handleUpdateLote}
      onDeleteLote={handleDeleteLote}
    />
  );
}
