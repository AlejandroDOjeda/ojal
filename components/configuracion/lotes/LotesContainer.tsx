"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCampoContext } from "@/contexts/CampoContext";
import LotesView from "./LotesView";

export type LoteRow = {
  Id_Lote:   number;
  Id_Campo:  number;
  Nombre:    string;
  CreatedAt: string;
  Campo:     { Nombre: string } | null;
};

export type LoteFormData = {
  Id_Campo: string;
  Nombre:   string;
};

export default function LotesContainer() {
  const { campos } = useCampoContext();
  const [lotes, setLotes] = useState<LoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLotes = useCallback(async () => {
    setLoading(true); setError(null);
    const { data, error } = await supabase
      .from("Lote")
      .select("Id_Lote, Id_Campo, Nombre, CreatedAt, Campo(Nombre)");
    if (error) {
      setError(error.message);
    } else {
      const ordenados = ((data ?? []) as LoteRow[]).sort((a, b) => {
        const campoCmp = (a.Campo?.Nombre ?? "").localeCompare(b.Campo?.Nombre ?? "", "es");
        return campoCmp !== 0 ? campoCmp : a.Nombre.localeCompare(b.Nombre, "es");
      });
      setLotes(ordenados);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchLotes(); }, [fetchLotes]);

  const handleCreate = async (f: LoteFormData) => {
    const { error } = await supabase.from("Lote").insert({
      Id_Campo: parseInt(f.Id_Campo, 10),
      Nombre:   f.Nombre.trim(),
    });
    if (error) throw new Error(error.message);
    await fetchLotes();
  };

  const handleUpdate = async (id: number, f: LoteFormData) => {
    const { error } = await supabase.from("Lote").update({
      Nombre: f.Nombre.trim(),
    }).eq("Id_Lote", id);
    if (error) throw new Error(error.message);
    await fetchLotes();
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("Lote").delete().eq("Id_Lote", id);
    if (error) {
      if (error.code === "23503") throw new Error("No se puede eliminar: el lote tiene rodeo, movimientos o facturas asociadas.");
      throw new Error(error.message);
    }
    await fetchLotes();
  };

  return (
    <LotesView
      lotes={lotes}
      campos={campos}
      loading={loading}
      error={error}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
