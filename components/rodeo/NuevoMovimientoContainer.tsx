"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useCampoContext } from "@/contexts/CampoContext";
import NuevoMovimientoView, { type MovimientoFormData } from "./NuevoMovimientoView";

export type CategoriaOption = { Id_CategoriaHacienda: number; Nombre: string };

export default function NuevoMovimientoContainer() {
  const router = useRouter();
  const { campoActivo } = useCampoContext();
  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategorias = useCallback(async () => {
    const { data } = await supabase
      .from("CategoriaHacienda")
      .select("Id_CategoriaHacienda, Nombre")
      .eq("Activa", true)
      .order("Nombre");
    setCategorias(
      (data ?? []).map((r: any) => ({
        Id_CategoriaHacienda: r.Id_CategoriaHacienda,
        Nombre: r.Nombre,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const handleGuardar = async (form: MovimientoFormData) => {
    if (!campoActivo) throw new Error("Seleccioná un campo antes de registrar un movimiento.");

    // 1. Obtener stock actual de la categoría en este campo
    const { data: rodeoRow, error: rodeoError } = await supabase
      .from("Rodeo")
      .select("Id_Rodeo, Cabezas")
      .eq("Id_Campo", campoActivo.Id_Campo)
      .eq("Id_CategoriaHacienda", form.idCategoriaHacienda)
      .single();

    if (rodeoError || !rodeoRow) {
      throw new Error("No se encontró la categoría en el rodeo.");
    }

    // 2. Calcular nuevo stock
    const esResta =
      form.tipoMovimiento === "muerte" ||
      (form.tipoMovimiento === "ajuste_manual" && form.sentidoAjuste === "decremento");

    const delta = esResta ? -form.cabezas : form.cabezas;
    const nuevoCabezas = rodeoRow.Cabezas + delta;

    if (nuevoCabezas < 0) {
      throw new Error(
        `Stock insuficiente. Stock actual de ${form.nombreCategoria}: ${rodeoRow.Cabezas} cabezas.`
      );
    }

    // 3. Registrar movimiento
    const { error: movError } = await supabase.from("MovimientoRodeo").insert({
      Id_Campo: campoActivo.Id_Campo,
      TipoMovimiento: form.tipoMovimiento,
      Id_CategoriaHacienda: form.idCategoriaHacienda,
      Cabezas: form.cabezas,
      Fecha: form.fecha,
      Observaciones: form.observaciones || null,
    });
    if (movError) throw new Error(movError.message);

    // 4. Actualizar stock
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
      loading={loading}
      sinCampo={!campoActivo}
      onGuardar={handleGuardar}
    />
  );
}
