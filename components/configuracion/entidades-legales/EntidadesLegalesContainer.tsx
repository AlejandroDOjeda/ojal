"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import EntidadesLegalesView from "./EntidadesLegalesView";

export type EntidadLegal = {
  Id_EntidadLegal: number;
  RazonSocial:     string;
  CuitCuil:        string;
  Id_TipoPersona:  number;
  Id_CondicionIva: number;
  Email:           string | null;
  Telefono:        string | null;
  CreatedAt:       string;
};

export type EntidadLegalFormData = {
  RazonSocial:     string;
  CuitCuil:        string;
  Id_TipoPersona:  string; // string para Select
  Id_CondicionIva: string; // string para Select
  Email:           string;
  Telefono:        string;
};

export default function EntidadesLegalesContainer() {
  const [entidades, setEntidades] = useState<EntidadLegal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntidades = useCallback(async () => {
    setLoading(true); setError(null);
    const { data, error } = await supabase.from("EntidadLegal").select("*").order("RazonSocial");
    if (error) setError(error.message); else setEntidades(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEntidades(); }, [fetchEntidades]);

  const handleCreate = async (f: EntidadLegalFormData) => {
    const { error } = await supabase.from("EntidadLegal").insert({
      RazonSocial:    f.RazonSocial,
      CuitCuil:       f.CuitCuil,
      Id_TipoPersona: parseInt(f.Id_TipoPersona),
      Id_CondicionIva:parseInt(f.Id_CondicionIva),
      Email:          f.Email || null,
      Telefono:       f.Telefono || null,
    });
    if (error) {
      if (error.code === "23505") throw new Error("Ya existe una entidad con este CUIT/CUIL.");
      throw new Error(error.message);
    }
    await fetchEntidades();
  };

  const handleUpdate = async (id: number, f: EntidadLegalFormData) => {
    const { error } = await supabase.from("EntidadLegal").update({
      RazonSocial:    f.RazonSocial,
      CuitCuil:       f.CuitCuil,
      Id_TipoPersona: parseInt(f.Id_TipoPersona),
      Id_CondicionIva:parseInt(f.Id_CondicionIva),
      Email:          f.Email || null,
      Telefono:       f.Telefono || null,
    }).eq("Id_EntidadLegal", id);
    if (error) {
      if (error.code === "23505") throw new Error("Ya existe una entidad con este CUIT/CUIL.");
      throw new Error(error.message);
    }
    await fetchEntidades();
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("EntidadLegal").delete().eq("Id_EntidadLegal", id);
    if (error) {
      if (error.code === "23503") throw new Error("No se puede eliminar: la entidad está en uso en facturas existentes.");
      throw new Error(error.message);
    }
    await fetchEntidades();
  };

  return (
    <EntidadesLegalesView entidades={entidades} loading={loading} error={error}
      onCreate={handleCreate} onUpdate={handleUpdate} onDelete={handleDelete} />
  );
}
