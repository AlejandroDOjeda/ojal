"use client";

import EntidadesLegalesView from "./EntidadesLegalesView";

export type EntidadLegal = {
  id: string;
  razon_social: string;
  cuit_cuil: string;
  tipo_persona: "fisica" | "juridica";
  condicion_iva: "monotributo" | "responsable_inscripto" | "exento" | "consumidor_final";
  created_at: string;
};

export default function EntidadesLegalesContainer() {
  const entidades: EntidadLegal[] = [];
  return <EntidadesLegalesView entidades={entidades} />;
}
