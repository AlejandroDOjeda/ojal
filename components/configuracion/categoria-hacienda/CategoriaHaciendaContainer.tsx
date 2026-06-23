"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import CategoriaHaciendaView from "./CategoriaHaciendaView";

export type CategoriaHacienda = {
  Id_CategoriaHacienda: number;
  Nombre: string;
  Descripcion: string | null;
  TasaIva: number;
  Activa: boolean;
  CreatedAt: string;
};

export type CategoriaHaciendaFormData = {
  Nombre: string;
  Descripcion: string;
  TasaIva: number;
};

export default function CategoriaHaciendaContainer() {
  const [categorias, setCategorias] = useState<CategoriaHacienda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(async () => {
    setLoading(true); setError(null);
    const { data, error } = await supabase
      .from("CategoriaHacienda")
      .select("*")
      .eq("Activa", true)
      .order("Nombre");
    if (error) setError(error.message);
    else setCategorias(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCategorias(); }, [fetchCategorias]);

  const handleCreate = async (formData: CategoriaHaciendaFormData) => {
    const { error } = await supabase.from("CategoriaHacienda").insert({ ...formData, Activa: true });
    if (error) throw new Error(error.message);
    await fetchCategorias();
  };

  const handleUpdate = async (id: number, formData: CategoriaHaciendaFormData) => {
    const { error } = await supabase.from("CategoriaHacienda").update(formData).eq("Id_CategoriaHacienda", id);
    if (error) throw new Error(error.message);
    await fetchCategorias();
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("CategoriaHacienda").delete().eq("Id_CategoriaHacienda", id);
    if (error) {
      if (error.code === "23503") throw new Error("No se puede eliminar: la categoría está en uso en facturas existentes.");
      throw new Error(error.message);
    }
    await fetchCategorias();
  };

  return (
    <CategoriaHaciendaView
      categorias={categorias} loading={loading} error={error}
      onCreate={handleCreate} onUpdate={handleUpdate} onDelete={handleDelete}
    />
  );
}
