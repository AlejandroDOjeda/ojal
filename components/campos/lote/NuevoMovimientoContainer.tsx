"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
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

  const actualizarStock = async (idLoteObjetivo: number, idCategoriaHacienda: number, delta: number, nombreCategoria: string) => {
    const { data: rodeoRow, error: rodeoError } = await supabase
      .from("Rodeo")
      .select("Id_Rodeo, Cabezas")
      .eq("Id_Lote", idLoteObjetivo)
      .eq("Id_CategoriaHacienda", idCategoriaHacienda)
      .single();

    if (rodeoError || !rodeoRow) {
      throw new Error("No se encontró la categoría en el rodeo del lote.");
    }

    const nuevoCabezas = rodeoRow.Cabezas + delta;
    if (nuevoCabezas < 0) {
      throw new Error(`Stock insuficiente. Stock actual de ${nombreCategoria}: ${rodeoRow.Cabezas} cabezas.`);
    }

    const { error: updateError } = await supabase
      .from("Rodeo")
      .update({ Cabezas: nuevoCabezas })
      .eq("Id_Rodeo", rodeoRow.Id_Rodeo);
    if (updateError) throw new Error(updateError.message);
  };

  const handleGuardarTraslado = async (form: MovimientoFormData) => {
    if (!form.idLoteDestino) throw new Error("Seleccioná el lote destino.");

    // Decrementar origen primero (protegido por el check Cabezas >= 0),
    // recién después incrementar destino.
    await actualizarStock(idLote, form.idCategoriaHacienda, -form.cabezas, form.nombreCategoria);
    await actualizarStock(form.idLoteDestino, form.idCategoriaHacienda, form.cabezas, form.nombreCategoria);

    const { error: movError } = await supabase.from("MovimientoRodeo").insert([
      {
        Id_Lote: idLote,
        TipoMovimiento: "traslado",
        Sentido: "decremento",
        Id_CategoriaHacienda: form.idCategoriaHacienda,
        Cabezas: form.cabezas,
        Fecha: form.fecha,
        Observaciones: form.observaciones || null,
        Id_LoteVinculado: form.idLoteDestino,
      },
      {
        Id_Lote: form.idLoteDestino,
        TipoMovimiento: "traslado",
        Sentido: "incremento",
        Id_CategoriaHacienda: form.idCategoriaHacienda,
        Cabezas: form.cabezas,
        Fecha: form.fecha,
        Observaciones: form.observaciones || null,
        Id_LoteVinculado: idLote,
      },
    ]);
    if (movError) throw new Error(movError.message);
  };

  const handleGuardar = async (form: MovimientoFormData) => {
    if (form.tipoMovimiento === "traslado") {
      await handleGuardarTraslado(form);
      router.push(`/campos/${campoId}/lotes/${idLote}`);
      return;
    }

    const esResta =
      form.tipoMovimiento === "muerte" ||
      (form.tipoMovimiento === "ajuste_manual" && form.sentidoAjuste === "decremento");
    const delta = esResta ? -form.cabezas : form.cabezas;

    // Verificar stock suficiente antes de registrar nada.
    const { data: rodeoRow, error: rodeoError } = await supabase
      .from("Rodeo")
      .select("Id_Rodeo, Cabezas")
      .eq("Id_Lote", idLote)
      .eq("Id_CategoriaHacienda", form.idCategoriaHacienda)
      .single();
    if (rodeoError || !rodeoRow) throw new Error("No se encontró la categoría en el rodeo del lote.");
    const nuevoCabezas = rodeoRow.Cabezas + delta;
    if (nuevoCabezas < 0) {
      throw new Error(`Stock insuficiente. Stock actual de ${form.nombreCategoria}: ${rodeoRow.Cabezas} cabezas.`);
    }

    const { error: movError } = await supabase.from("MovimientoRodeo").insert({
      Id_Lote: idLote,
      TipoMovimiento: form.tipoMovimiento,
      Id_CategoriaHacienda: form.idCategoriaHacienda,
      Cabezas: form.cabezas,
      Fecha: form.fecha,
      Observaciones: form.observaciones || null,
      Sentido: form.tipoMovimiento === "ajuste_manual" ? form.sentidoAjuste : null,
    });
    if (movError) throw new Error(movError.message);

    const { error: updateError } = await supabase
      .from("Rodeo")
      .update({ Cabezas: nuevoCabezas })
      .eq("Id_Rodeo", rodeoRow.Id_Rodeo);
    if (updateError) throw new Error(updateError.message);

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
