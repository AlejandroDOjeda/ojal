"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import CategoriaHaciendaView from "./CategoriaHaciendaView";

export type CategoriaHacienda = {
  id: string;
  nombre: string;
  descripcion: string | null;
  tasa_iva: number;
  activa: boolean;
  created_at: string;
};

export type CategoriaHaciendaFormData = {
  nombre: string;
  descripcion: string;
  tasa_iva: number;
};

export default function CategoriaHaciendaContainer() {
  const [categorias, setCategorias] = useState<CategoriaHacienda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("categoria_hacienda")
      .select("*")
      .eq("activa", true)
      .order("nombre");

    if (error) setError(error.message);
    else setCategorias(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const handleCreate = async (formData: CategoriaHaciendaFormData) => {
    const { error } = await supabase
      .from("categoria_hacienda")
      .insert({ ...formData, activa: true });
    if (error) throw new Error(error.message);
    await fetchCategorias();
  };

  const handleUpdate = async (id: string, formData: CategoriaHaciendaFormData) => {
    const { error } = await supabase
      .from("categoria_hacienda")
      .update(formData)
      .eq("id", id);
    if (error) throw new Error(error.message);
    await fetchCategorias();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("categoria_hacienda")
      .delete()
      .eq("id", id);
    if (error) {
      // FK violation: la categoría está en uso en alguna factura
      if (error.code === "23503") {
        throw new Error("No se puede eliminar: la categoría está en uso en facturas existentes.");
      }
      throw new Error(error.message);
    }
    await fetchCategorias();
  };

  return (
    <CategoriaHaciendaView
        categorias={categorias}
        loading={loading}
        error={error}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
  );
}
