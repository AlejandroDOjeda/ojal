"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { registrarMovimientoSimple, registrarTraslado } from "@/lib/rodeoMovimientos";
import NuevoMovimientoView, { type MovimientoFormData } from "./NuevoMovimientoView";

export type CategoriaOption = { Id_CategoriaHacienda: number; Nombre: string };
export type LoteOption = { Id_Lote: number; Nombre: string };

export default function NuevoMovimientoContainer() {
  const router = useRouter();
  const { id, loteId } = useParams<{ id: string; loteId: string }>();
  const campoId = parseInt(id, 10);
  const idLote = parseInt(loteId, 10);

  const [nombreLote, setNombreLote] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);
  const [otrosLotes, setOtrosLotes] = useState<LoteOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategorias = useCallback(async () => {
    const { data } = await supabase
      .from("CategoriaHacienda")
      .select("Id_CategoriaHacienda, Nombre")
      .eq("Activa", true)
      .order("Nombre");
    setCategorias(
      (data ?? []).map((r: CategoriaOption) => ({
        Id_CategoriaHacienda: r.Id_CategoriaHacienda,
        Nombre: r.Nombre,
      }))
    );
  }, []);

  const fetchLote = useCallback(async () => {
    const { data } = await supabase.from("Lote").select("Nombre").eq("Id_Lote", idLote).single();
    setNombreLote(data?.Nombre ?? null);
  }, [idLote]);

  const fetchOtrosLotes = useCallback(async () => {
    const { data } = await supabase
      .from("Lote")
      .select("Id_Lote, Nombre")
      .eq("Id_Campo", campoId)
      .neq("Id_Lote", idLote)
      .order("Nombre");
    setOtrosLotes((data ?? []) as LoteOption[]);
  }, [campoId, idLote]);

  useEffect(() => { fetchCategorias(); fetchLote(); }, [fetchCategorias, fetchLote]);

  useEffect(() => {
    setLoading(true);
    fetchOtrosLotes().then(() => setLoading(false));
  }, [fetchOtrosLotes]);

  const handleGuardar = async (form: MovimientoFormData) => {
    if (form.tipoMovimiento === "traslado") {
      if (!form.idLoteDestino) throw new Error("Seleccioná el lote destino.");
      await registrarTraslado({
        idLoteOrigen: idLote,
        idLoteDestino: form.idLoteDestino,
        idCategoriaHacienda: form.idCategoriaHacienda,
        nombreCategoria: form.nombreCategoria,
        cabezas: form.cabezas,
        fecha: form.fecha,
        observaciones: form.observaciones,
      });
      router.push(`/campos/${campoId}/lotes/${idLote}`);
      return;
    }

    await registrarMovimientoSimple({
      idLote,
      tipoMovimiento: form.tipoMovimiento,
      sentidoAjuste: form.sentidoAjuste,
      idCategoriaHacienda: form.idCategoriaHacienda,
      nombreCategoria: form.nombreCategoria,
      cabezas: form.cabezas,
      fecha: form.fecha,
      observaciones: form.observaciones,
    });
    router.push(`/campos/${campoId}/lotes/${idLote}`);
  };

  return (
    <NuevoMovimientoView
      campoId={campoId}
      loteId={idLote}
      nombreLote={nombreLote}
      categorias={categorias}
      otrosLotes={otrosLotes}
      loading={loading}
      onGuardar={handleGuardar}
    />
  );
}
