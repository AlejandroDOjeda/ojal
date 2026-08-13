"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useCampoContext } from "@/contexts/CampoContext";
import NuevoMovimientoView, { type MovimientoFormData } from "./NuevoMovimientoView";

export type CategoriaOption = { Id_CategoriaHacienda: number; Nombre: string };
export type LoteOption = { Id_Lote: number; Nombre: string };

export default function NuevoMovimientoContainer() {
  const router = useRouter();
  const { campoActivo } = useCampoContext();
  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);
  const [lotes, setLotes] = useState<LoteOption[]>([]);
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

  const fetchLotes = useCallback(async () => {
    if (!campoActivo) { setLotes([]); return; }
    const { data } = await supabase
      .from("Lote")
      .select("Id_Lote, Nombre")
      .eq("Id_Campo", campoActivo.Id_Campo)
      .order("Nombre");
    setLotes((data ?? []) as LoteOption[]);
  }, [campoActivo]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCategorias(), fetchLotes()]).then(() => setLoading(false));
  }, [fetchCategorias, fetchLotes]);

  const actualizarStock = async (idLote: number, idCategoriaHacienda: number, delta: number, nombreCategoria: string) => {
    const { data: rodeoRow, error: rodeoError } = await supabase
      .from("Rodeo")
      .select("Id_Rodeo, Cabezas")
      .eq("Id_Lote", idLote)
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
    if (!form.idLoteOrigen || !form.idLoteDestino) throw new Error("Seleccioná el lote origen y el lote destino.");
    if (form.idLoteOrigen === form.idLoteDestino) throw new Error("El lote origen y el lote destino deben ser distintos.");

    // Decrementar origen primero (protegido por el check Cabezas >= 0),
    // recién después incrementar destino.
    await actualizarStock(form.idLoteOrigen, form.idCategoriaHacienda, -form.cabezas, form.nombreCategoria);
    await actualizarStock(form.idLoteDestino, form.idCategoriaHacienda, form.cabezas, form.nombreCategoria);

    const { error: movError } = await supabase.from("MovimientoRodeo").insert([
      {
        Id_Lote: form.idLoteOrigen,
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
        Id_LoteVinculado: form.idLoteOrigen,
      },
    ]);
    if (movError) throw new Error(movError.message);
  };

  const handleGuardar = async (form: MovimientoFormData) => {
    if (!campoActivo) throw new Error("Seleccioná un campo antes de registrar un movimiento.");

    if (form.tipoMovimiento === "traslado") {
      await handleGuardarTraslado(form);
      router.push("/rodeo");
      return;
    }

    if (!form.idLote) throw new Error("Seleccioná un lote.");

    const esResta =
      form.tipoMovimiento === "muerte" ||
      (form.tipoMovimiento === "ajuste_manual" && form.sentidoAjuste === "decremento");
    const delta = esResta ? -form.cabezas : form.cabezas;

    // Verificar stock suficiente antes de registrar nada.
    const { data: rodeoRow, error: rodeoError } = await supabase
      .from("Rodeo")
      .select("Id_Rodeo, Cabezas")
      .eq("Id_Lote", form.idLote)
      .eq("Id_CategoriaHacienda", form.idCategoriaHacienda)
      .single();
    if (rodeoError || !rodeoRow) throw new Error("No se encontró la categoría en el rodeo del lote.");
    const nuevoCabezas = rodeoRow.Cabezas + delta;
    if (nuevoCabezas < 0) {
      throw new Error(`Stock insuficiente. Stock actual de ${form.nombreCategoria}: ${rodeoRow.Cabezas} cabezas.`);
    }

    const { error: movError } = await supabase.from("MovimientoRodeo").insert({
      Id_Lote: form.idLote,
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

    router.push("/rodeo");
  };

  return (
    <NuevoMovimientoView
      categorias={categorias}
      lotes={lotes}
      loading={loading}
      sinCampo={!campoActivo}
      sinLotes={!!campoActivo && lotes.length === 0}
      onGuardar={handleGuardar}
    />
  );
}
