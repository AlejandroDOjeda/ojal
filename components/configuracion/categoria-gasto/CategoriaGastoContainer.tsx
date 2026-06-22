"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import CategoriaGastoView from "./CategoriaGastoView";

export type CategoriaGasto = {
  id: string;
  nombre: string;
  descripcion: string | null;
  tasa_iva_habitual: number;
  activa: boolean;
  created_at: string;
};

export type CategoriaGastoFormData = {
  nombre: string;
  descripcion: string;
  tasa_iva_habitual: number;
};

export default function CategoriaGastoContainer() {
  const [categorias, setCategorias] = useState<CategoriaGasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("categoria_gasto")
      .select("*")
      .eq("activa", true)
      .order("nombre");

    if (error) setError(error.message);
    else setCategorias(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCategorias(); }, [fetchCategorias]);

  const handleCreate = async (formData: CategoriaGastoFormData) => {
    const { error } = await supabase
      .from("categoria_gasto")
      .insert({ ...formData, activa: true });
    if (error) throw new Error(error.message);
    await fetchCategorias();
  };

  const handleUpdate = async (id: string, formData: CategoriaGastoFormData) => {
    const { error } = await supabase
      .from("categoria_gasto")
      .update(formData)
      .eq("id", id);
    if (error) throw new Error(error.message);
    await fetchCategorias();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("categoria_gasto")
      .delete()
      .eq("id", id);
    if (error) {
      if (error.code === "23503")
        throw new Error("No se puede eliminar: la categoría está en uso en facturas existentes.");
      throw new Error(error.message);
    }
    await fetchCategorias();
  };

  return (
    <CategoriaGastoView
      categorias={categorias}
      loading={loading}
      error={error}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
