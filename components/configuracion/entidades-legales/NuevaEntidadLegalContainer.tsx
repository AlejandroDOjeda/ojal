"use client";

import NuevaEntidadLegalView from "./NuevaEntidadLegalView";

export default function NuevaEntidadLegalContainer() {
  const handleSubmit = async (data: unknown) => {
    console.log("Guardar entidad:", data);
  };

  return <NuevaEntidadLegalView onSubmit={handleSubmit} />;
}
