"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import NuevaEntidadLegalView from "./NuevaEntidadLegalView";

type FormData = {
  razon_social: string;
  cuit_cuil: string;
  tipo_persona: "fisica" | "juridica";
  condicion_iva: "monotributo" | "responsable_inscripto" | "exento" | "consumidor_final";
};

// Mapa de valores legacy a IDs numéricos
const TIPO_PERSONA_MAP: Record<string, number> = { fisica: 1, juridica: 2 };
const CONDICION_IVA_MAP: Record<string, number> = {
  responsable_inscripto: 1, monotributo: 2, exento: 3, consumidor_final: 4,
};

export default function NuevaEntidadLegalContainer() {
  const router = useRouter();

  const handleSubmit = async (data: FormData) => {
    const { error } = await supabase.from("EntidadLegal").insert({
      RazonSocial:    data.razon_social,
      CuitCuil:       data.cuit_cuil,
      Id_TipoPersona: TIPO_PERSONA_MAP[data.tipo_persona] ?? 1,
      Id_CondicionIva:CONDICION_IVA_MAP[data.condicion_iva] ?? 1,
    });
    if (error) throw new Error(error.message);
    router.push("/configuracion/entidades-legales");
  };

  return <NuevaEntidadLegalView onSubmit={handleSubmit} />;
}
