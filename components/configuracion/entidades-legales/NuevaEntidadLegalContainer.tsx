"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import NuevaEntidadLegalView from "./NuevaEntidadLegalView";

type FormData = {
  razon_social: string;
  cuit_cuil: string;
  tipo_persona: "fisica" | "juridica";
  condicion_iva: "monotributo" | "responsable_inscripto" | "exento" | "consumidor_final";
};

export default function NuevaEntidadLegalContainer() {
  const { userId } = useAuthContext();
  const router = useRouter();

  const handleSubmit = async (data: FormData) => {
    if (!userId) throw new Error("Usuario no autenticado");
    const { error } = await supabase.from("entidad_legal").insert({
      user_id: userId,
      ...data,
    });
    if (error) throw new Error(error.message);
    router.push("/configuracion/entidades-legales");
  };

  return <NuevaEntidadLegalView onSubmit={handleSubmit} />;
}
