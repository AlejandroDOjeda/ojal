"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import ProfileView from "./ProfileView";

export type ProfileFormData = {
  Nombre: string;
  Apellido: string;
  RazonSocial: string;
  CuitCuil: string;
  Id_TipoPersona: string;   // string para Select: "1" o "2"
  Id_CondicionIva: string;  // string para Select: "1"–"4"
  Telefono: string;
};

const EMPTY_FORM: ProfileFormData = {
  Nombre: "", Apellido: "", RazonSocial: "", CuitCuil: "",
  Id_TipoPersona: "", Id_CondicionIva: "", Telefono: "",
};

export default function ProfileContainer() {
  const { userId, userEmail } = useAuthContext();
  const [form, setForm] = useState<ProfileFormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase.from("Profile").select("*").eq("Id_Profile", userId).single();
    if (data) {
      setForm({
        Nombre: data.Nombre ?? "",
        Apellido: data.Apellido ?? "",
        RazonSocial: data.RazonSocial ?? "",
        CuitCuil: data.CuitCuil ?? "",
        Id_TipoPersona: data.Id_TipoPersona ? String(data.Id_TipoPersona) : "",
        Id_CondicionIva: data.Id_CondicionIva ? String(data.Id_CondicionIva) : "",
        Telefono: data.Telefono ?? "",
      });
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleSave = async (data: ProfileFormData) => {
    if (!userId) return;
    setSaving(true);

    const { error } = await supabase.from("Profile").update({
      Nombre: data.Nombre || null,
      Apellido: data.Apellido || null,
      RazonSocial: data.RazonSocial || null,
      CuitCuil: data.CuitCuil || null,
      Id_TipoPersona: data.Id_TipoPersona ? parseInt(data.Id_TipoPersona) : null,
      Id_CondicionIva: data.Id_CondicionIva ? parseInt(data.Id_CondicionIva) : null,
      Telefono: data.Telefono || null,
    }).eq("Id_Profile", userId);

    if (error) toast.error("No se pudo guardar el perfil. Intentá de nuevo.");
    else toast.success("Perfil actualizado correctamente.");
    setSaving(false);
  };

  return (
    <ProfileView
      userEmail={userEmail} form={form} setForm={setForm}
      loading={loading} saving={saving}
      onSave={handleSave}
    />
  );
}
