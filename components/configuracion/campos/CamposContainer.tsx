"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import { useCampoContext } from "@/contexts/CampoContext";
import { formatRenspa } from "@/lib/formato";
import CamposView from "./CamposView";

export type CampoRow = {
  Id_Campo:   number;
  Nombre:     string;
  Renspa:     string | null;
  Ubicacion:  string | null;
  Superficie: number | null;
  CreatedAt:  string;
};

export type CampoFormData = {
  Nombre:     string;
  Renspa:     string;
  Ubicacion:  string;
  Superficie: string;
};

export default function CamposContainer() {
  const { userId } = useAuthContext();
  const { refetch: refetchCampoContext } = useCampoContext();
  const [campos, setCampos] = useState<CampoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampos = useCallback(async () => {
    setLoading(true); setError(null);
    const { data, error } = await supabase
      .from("Campo")
      .select("Id_Campo, Nombre, Renspa, Ubicacion, Superficie, CreatedAt")
      .order("Nombre");
    if (error) setError(error.message); else setCampos(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCampos(); }, [fetchCampos]);

  const handleCreate = async (f: CampoFormData) => {
    if (!userId) throw new Error("Sin sesión activa.");
    const renspaFormateado = f.Renspa ? formatRenspa(f.Renspa) : null;
    const { error } = await supabase.from("Campo").insert({
      Id_Profile:  userId,
      Nombre:      f.Nombre.trim(),
      Renspa:      renspaFormateado && renspaFormateado.length > 0 ? renspaFormateado : null,
      Ubicacion:   f.Ubicacion.trim() || null,
      Superficie:  f.Superficie ? parseFloat(f.Superficie) : null,
    });
    if (error) throw new Error(error.message);
    await fetchCampos();
    refetchCampoContext();
  };

  const handleUpdate = async (id: number, f: CampoFormData) => {
    const renspaFormateado = f.Renspa ? formatRenspa(f.Renspa) : null;
    const { error } = await supabase.from("Campo").update({
      Nombre:     f.Nombre.trim(),
      Renspa:     renspaFormateado && renspaFormateado.length > 0 ? renspaFormateado : null,
      Ubicacion:  f.Ubicacion.trim() || null,
      Superficie: f.Superficie ? parseFloat(f.Superficie) : null,
    }).eq("Id_Campo", id);
    if (error) throw new Error(error.message);
    await fetchCampos();
    refetchCampoContext();
  };

  const handleDelete = async (id: number) => {
    if (campos.length <= 1) throw new Error("No se puede eliminar el único campo existente.");
    const { error } = await supabase.from("Campo").delete().eq("Id_Campo", id);
    if (error) {
      if (error.code === "23503") throw new Error("No se puede eliminar: el campo tiene facturas o movimientos asociados.");
      throw new Error(error.message);
    }
    await fetchCampos();
    refetchCampoContext();
  };

  return (
    <CamposView
      campos={campos}
      loading={loading}
      error={error}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
