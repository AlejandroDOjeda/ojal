"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import EntidadesLegalesView from "./EntidadesLegalesView";

export type EntidadLegal = {
  id: string;
  razon_social: string;
  cuit_cuil: string;
  tipo_persona: "fisica" | "juridica";
  condicion_iva: "responsable_inscripto" | "monotributo" | "exento" | "consumidor_final";
  email: string | null;
  telefono: string | null;
  created_at: string;
};

export type EntidadLegalFormData = {
  razon_social: string;
  cuit_cuil: string;
  tipo_persona: "fisica" | "juridica" | "";
  condicion_iva: "responsable_inscripto" | "monotributo" | "exento" | "consumidor_final" | "";
  email: string;
  telefono: string;
};

export default function EntidadesLegalesContainer() {
  const { userId } = useAuthContext();
  const [entidades, setEntidades] = useState<EntidadLegal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntidades = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("entidad_legal")
      .select("*")
      .order("razon_social");

    if (error) setError(error.message);
    else setEntidades(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEntidades();
  }, [fetchEntidades]);

  const handleCreate = async (formData: EntidadLegalFormData) => {
    if (!userId) throw new Error("Usuario no autenticado");
    const { error } = await supabase.from("entidad_legal").insert({
      user_id: userId,
      razon_social: formData.razon_social,
      cuit_cuil: formData.cuit_cuil,
      tipo_persona: (formData.tipo_persona as EntidadLegal["tipo_persona"]) || null,
      condicion_iva: (formData.condicion_iva as EntidadLegal["condicion_iva"]) || null,
      email: formData.email || null,
      telefono: formData.telefono || null,
    });
    if (error) throw new Error(error.message);
    await fetchEntidades();
  };

  const handleUpdate = async (id: string, formData: EntidadLegalFormData) => {
    const { error } = await supabase
      .from("entidad_legal")
      .update({
        razon_social: formData.razon_social,
        cuit_cuil: formData.cuit_cuil,
        tipo_persona: (formData.tipo_persona as EntidadLegal["tipo_persona"]) || null,
        condicion_iva: (formData.condicion_iva as EntidadLegal["condicion_iva"]) || null,
        email: formData.email || null,
        telefono: formData.telefono || null,
      })
      .eq("id", id);
    if (error) throw new Error(error.message);
    await fetchEntidades();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("entidad_legal")
      .delete()
      .eq("id", id);
    if (error) {
      if (error.code === "23503")
        throw new Error("No se puede eliminar: la entidad está en uso en facturas existentes.");
      throw new Error(error.message);
    }
    await fetchEntidades();
  };

  return (
    <EntidadesLegalesView
      entidades={entidades}
      loading={loading}
      error={error}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
