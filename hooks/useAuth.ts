"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

type SupabaseSession = {
  user?: {
    id: string;
    email?: string;
    user_metadata?: { email?: string; theme?: string } | null;
  } | null;
} | null;

export default function useAuth() {
  const [session, setSession] = useState<SupabaseSession>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then((result: { data: { session: SupabaseSession } }) => {
      if (!mounted) return;
      setSession(result.data.session ?? null);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((/* event */ _event: string, newSession: SupabaseSession) => {
      if (!mounted) return;
      setSession(newSession ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  // Google OAuth removed for now; we only support email/password auth initially.

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, profileData?: {
    nombre?: string; apellido?: string; telefono?: string;
    razonSocial?: string; cuitCuil?: string; idTipoPersona?: string; idCondicionIva?: string;
  }) => {
    const meta: Record<string, unknown> = {};
    if (profileData?.nombre?.trim())      meta.nombre      = profileData.nombre.trim();
    if (profileData?.apellido?.trim())    meta.apellido    = profileData.apellido.trim();
    if (profileData?.telefono?.trim())    meta.telefono    = profileData.telefono.trim();
    if (profileData?.razonSocial?.trim()) meta.razonSocial = profileData.razonSocial.trim();
    if (profileData?.cuitCuil?.trim())    meta.cuitCuil    = profileData.cuitCuil.trim();
    if (profileData?.idTipoPersona)       meta.idTipoPersona  = parseInt(profileData.idTipoPersona);
    if (profileData?.idCondicionIva)      meta.idCondicionIva = parseInt(profileData.idCondicionIva);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: Object.keys(meta).length > 0 ? meta : undefined,
      },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  const userEmail = session?.user?.email ?? session?.user?.user_metadata?.email ?? null;

  return { session, userEmail, loading, signOut, signInWithEmail, signUpWithEmail } as const;
}
