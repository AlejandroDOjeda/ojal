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
  loading: boolean;
  refetch: () => void;
};

export const CampoContext = createContext<CampoContextValue | null>(null);

export function CampoProvider({ children }: { children: React.ReactNode }) {
  const [campos, setCampos] = useState<Campo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampos = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("Campo")
      .select("*")
      .order("Nombre");
    setCampos(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCampos();
  }, [fetchCampos]);

  return (
    <CampoContext.Provider value={{ campos, loading, refetch: fetchCampos }}>
      {children}
    </CampoContext.Provider>
  );
}

export function useCampoContext(): CampoContextValue {
  const ctx = useContext(CampoContext);
  if (!ctx) throw new Error("useCampoContext debe usarse dentro de CampoProvider");
  return ctx;
}
