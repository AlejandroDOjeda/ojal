"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/lib/database.types";

export type Campo = Database["public"]["Tables"]["Campo"]["Row"];

type CampoContextValue = {
  campos: Campo[];
  campoActivo: Campo | null;
  setCampoActivo: (campo: Campo | null) => void;
  loading: boolean;
  refetch: () => void;
};

const SESSION_KEY = "ojal_campo_activo_id";

export const CampoContext = createContext<CampoContextValue | null>(null);

export function CampoProvider({ children }: { children: React.ReactNode }) {
  const [campos, setCampos] = useState<Campo[]>([]);
  const [campoActivo, setCampoActivoState] = useState<Campo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCampos = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("Campo")
      .select("*")
      .order("Nombre");

    const lista = data ?? [];
    setCampos(lista);

    // Restaurar campo activo desde sessionStorage
    const savedId = sessionStorage.getItem(SESSION_KEY);
    if (savedId) {
      const encontrado = lista.find((c) => c.Id_Campo === Number(savedId));
      setCampoActivoState(encontrado ?? null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCampos();
  }, [fetchCampos]);

  const setCampoActivo = useCallback((campo: Campo | null) => {
    setCampoActivoState(campo);
    if (campo) {
      sessionStorage.setItem(SESSION_KEY, String(campo.Id_Campo));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, []);

  return (
    <CampoContext.Provider
      value={{ campos, campoActivo, setCampoActivo, loading, refetch: fetchCampos }}
    >
      {children}
    </CampoContext.Provider>
  );
}

export function useCampoContext(): CampoContextValue {
  const ctx = useContext(CampoContext);
  if (!ctx) throw new Error("useCampoContext debe usarse dentro de CampoProvider");
  return ctx;
}
