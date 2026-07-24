"use client";

import { useState } from "react";
import ResumenMensualContainer from "./ResumenMensualContainer";
import PosicionIvaContainer from "./PosicionIvaContainer";
import ResumenRodeoContainer from "./ResumenRodeoContainer";
import ResultadoAnualContainer from "./ResultadoAnualContainer";
import { PeriodoSelector } from "./PeriodoSelector";

export default function MainContent() {
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());

  return (
    <main className="flex-1 p-8">
      <div className="max-w-6xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-3xl font-bold text-foreground">Bienvenido</h2>
          <PeriodoSelector mes={mes} anio={anio} onMesChange={setMes} onAnioChange={setAnio} />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ResumenMensualContainer mes={mes} anio={anio} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PosicionIvaContainer mes={mes} anio={anio} />
          <ResumenRodeoContainer />
        </div>

        <div className="mt-6 grid grid-cols-1">
          <ResultadoAnualContainer anio={anio} mesHasta={mes} />
        </div>
      </div>
    </main>
  );
}
