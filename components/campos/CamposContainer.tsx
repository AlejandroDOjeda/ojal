"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import { formatRenspa } from "@/lib/formato";
import CamposView from "./CamposView";
import type { CampoFormData } from "./CampoFormDialog";

export type CampoRow = {
  Id_Campo:   number;
  Nombre:     string;
  Renspa:     string | null;
  Ubicacion:  string | null;
  Superficie: number | null;
  CreatedAt:  string;
};

export type CampoListRow = CampoRow & { Cabezas: number };

export default function CamposContainer() {
  const { userId } = useAuthContext();
  const [campos, setCampos] = useState<CampoListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampos = useCallback(async () => {
    setLoading(true); setError(null);

    const { data: camposData, error: camposError } = await supabase
      .from("Campo")
      .select("Id_Campo, Nombre, Renspa, Ubicacion, Superficie, CreatedAt")
      .order("Nombre");
    if (camposError) { setError(camposError.message); setLoading(false); return; }

    const idsCampo = (camposData ?? []).map((c) => c.Id_Campo);
    const stockPorCampo = new Map<number, number>();
    if (idsCampo.length > 0) {
      const { data: lotesData, error: lotesError } = await supabase
        .from("Lote")
        .select("Id_Lote, Id_Campo")
        .in("Id_Campo", idsCampo);
      if (lotesError) { setError(lotesError.message); setLoading(false); return; }

      const campoPorLote = new Map((lotesData ?? []).map((l) => [l.Id_Lote, l.Id_Campo]));
      const idsLote = (lotesData ?? []).map((l) => l.Id_Lote);
      if (idsLote.length > 0) {
        const { data: rodeoData, error: rodeoError } = await supabase
          .from("Rodeo")
          .select("Id_Lote, Cabezas")
          .in("Id_Lote", idsLote);
        if (rodeoError) { setError(rodeoError.message); setLoading(false); return; }

        for (const row of rodeoData ?? []) {
          const idCampo = campoPorLote.get(row.Id_Lote);
          if (idCampo == null) continue;
          stockPorCampo.set(idCampo, (stockPorCampo.get(idCampo) ?? 0) + row.Cabezas);
        }
      }
    }

    setCampos(
      (camposData ?? []).map((c) => ({ ...c, Cabezas: stockPorCampo.get(c.Id_Campo) ?? 0 }))
    );
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
  };

  return (
    <CamposView
      campos={campos}
      loading={loading}
      error={error}
      onCreate={handleCreate}
    />
  );
}
