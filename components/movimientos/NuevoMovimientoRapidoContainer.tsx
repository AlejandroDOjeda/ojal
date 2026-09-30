"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { registrarMovimientoSimple, registrarTraslado } from "@/lib/rodeoMovimientos";
import NuevoMovimientoRapidoView, { type MovimientoFormData } from "./NuevoMovimientoRapidoView";

export type CategoriaOption = { Id_CategoriaHacienda: number; Nombre: string };
export type LoteOption = { Id_Lote: number; Nombre: string; Id_Campo: number; CampoNombre: string };

export default function NuevoMovimientoRapidoContainer() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);
  const [lotes, setLotes] = useState<LoteOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const [{ data: cats }, { data: lots }] = await Promise.all([
      supabase.from("CategoriaHacienda").select("Id_CategoriaHacienda, Nombre").eq("Activa", true).order("Nombre"),
      supabase.from("Lote").select("Id_Lote, Nombre, Id_Campo, Campo(Nombre)"),
    ]);
    setCategorias(
      (cats ?? []).map((r: CategoriaOption) => ({ Id_CategoriaHacienda: r.Id_CategoriaHacienda, Nombre: r.Nombre }))
    );
    type LoteRow = { Id_Lote: number; Nombre: string; Id_Campo: number; Campo: { Nombre: string } | null };
    setLotes(
      ((lots ?? []) as LoteRow[])
        .map((l) => ({ Id_Lote: l.Id_Lote, Nombre: l.Nombre, Id_Campo: l.Id_Campo, CampoNombre: l.Campo?.Nombre ?? "" }))
        .sort((a, b) => a.CampoNombre.localeCompare(b.CampoNombre, "es") || a.Nombre.localeCompare(b.Nombre, "es"))
    );
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleGuardar = async (form: MovimientoFormData) => {
    if (form.tipoMovimiento === "traslado") {
      if (!form.idLoteDestino) throw new Error("Seleccioná el lote destino.");
      await registrarTraslado({
        idLoteOrigen: form.idLote,
        idLoteDestino: form.idLoteDestino,
        idCategoriaHacienda: form.idCategoriaHacienda,
        nombreCategoria: form.nombreCategoria,
        cabezas: form.cabezas,
        fecha: form.fecha,
        observaciones: form.observaciones,
      });
    } else {
      await registrarMovimientoSimple({
        idLote: form.idLote,
        tipoMovimiento: form.tipoMovimiento,
        sentidoAjuste: form.sentidoAjuste,
        idCategoriaHacienda: form.idCategoriaHacienda,
        nombreCategoria: form.nombreCategoria,
        cabezas: form.cabezas,
        fecha: form.fecha,
        observaciones: form.observaciones,
      });
    }

    const lote = lotes.find((l) => l.Id_Lote === form.idLote);
    router.push(lote ? `/campos/${lote.Id_Campo}/lotes/${lote.Id_Lote}` : "/campos");
  };

  return (
    <NuevoMovimientoRapidoView
      categorias={categorias}
      lotes={lotes}
      loading={loading}
      onGuardar={handleGuardar}
    />
  );
}
