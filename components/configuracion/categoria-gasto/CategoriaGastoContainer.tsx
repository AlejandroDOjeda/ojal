"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import CategoriaGastoView from "./CategoriaGastoView";

export type CategoriaGasto = {
  Id_CategoriaGasto: number;
  Nombre: string;
  Descripcion: string | null;
  TasaIvaHabitual: number;
  Activa: boolean;
  CreatedAt: string;
};

export type CategoriaGastoFormData = {
  Nombre: string;
  Descripcion: string;
  TasaIvaHabitual: number;
};

export default function CategoriaGastoContainer() {
  const [categorias, setCategorias] = useState<CategoriaGasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(async () => {
    setLoading(true); setError(null);
    const { data, error } = await supabase
      .from("CategoriaGasto")
      .select("*")
      .eq("Activa", true)
      .order("Nombre");
    if (error) setError(error.message);
    else setCategorias(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCategorias(); }, [fetchCategorias]);

  const handleCreate = async (formData: CategoriaGastoFormData) => {
    const { error } = await supabase.from("CategoriaGasto").insert({ ...formData, Activa: true });
    if (error) throw new Error(error.message);
    await fetchCategorias();
  };

  const handleUpdate = async (id: number, formData: CategoriaGastoFormData) => {
    const { error } = await supabase.from("CategoriaGasto").update(formData).eq("Id_CategoriaGasto", id);
    if (error) throw new Error(error.message);
    await fetchCategorias();
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("CategoriaGasto").delete().eq("Id_CategoriaGasto", id);
    if (error) {
      if (error.code === "23503") throw new Error("No se puede eliminar: la categoría está en uso en facturas existentes.");
      throw new Error(error.message);
    }
    await fetchCategorias();
  };

  return (
    <CategoriaGastoView
      categorias={categorias} loading={loading} error={error}
      onCreate={handleCreate} onUpdate={handleUpdate} onDelete={handleDelete}
    />
  );
}
