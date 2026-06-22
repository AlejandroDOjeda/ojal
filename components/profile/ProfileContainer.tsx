"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import ProfileView from "./ProfileView";
import type { CondicionIva, TipoPersona } from "@/lib/database.types";

export type ProfileFormData = {
  nombre: string;
  apellido: string;
  razon_social: string;
  cuit_cuil: string;
  tipo_persona: TipoPersona | "";
  condicion_iva: CondicionIva | "";
  telefono: string;
};

const EMPTY_FORM: ProfileFormData = {
  nombre: "",
  apellido: "",
  razon_social: "",
  cuit_cuil: "",
  tipo_persona: "",
  condicion_iva: "",
  telefono: "",
};

export default function ProfileContainer() {
  const { userId, userEmail } = useAuthContext();
  const [form, setForm] = useState<ProfileFormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from("profile")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      setForm({
        nombre: data.nombre ?? "",
        apellido: data.apellido ?? "",
        razon_social: data.razon_social ?? "",
        cuit_cuil: data.cuit_cuil ?? "",
        tipo_persona: data.tipo_persona ?? "",
        condicion_iva: data.condicion_iva ?? "",
        telefono: data.telefono ?? "",
      });
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async (data: ProfileFormData) => {
    if (!userId) return;
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const { error } = await supabase
      .from("profile")
      .update({
        nombre: data.nombre || null,
        apellido: data.apellido || null,
        razon_social: data.razon_social || null,
        cuit_cuil: data.cuit_cuil || null,
        tipo_persona: data.tipo_persona || null,
        condicion_iva: data.condicion_iva || null,
        telefono: data.telefono || null,
      })
      .eq("id", userId);

    if (error) {
      setErrorMessage("No se pudo guardar el perfil. Intentá de nuevo.");
    } else {
      setSuccessMessage("Perfil actualizado correctamente.");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
    setSaving(false);
  };

  return (
    <ProfileView
      userEmail={userEmail}
      form={form}
      setForm={setForm}
      loading={loading}
      saving={saving}
      successMessage={successMessage}
      errorMessage={errorMessage}
      onSave={handleSave}
    />
  );
}
