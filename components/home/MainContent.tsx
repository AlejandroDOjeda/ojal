"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import ResumenMensualContainer from "./ResumenMensualContainer";
import PosicionIvaContainer from "./PosicionIvaContainer";

export default function MainContent() {
  const { userEmail } = useAuthContext();

  return (
    <main className="flex-1 p-8">
      <div className="max-w-6xl">
        <h2 className="text-3xl font-bold text-foreground">Bienvenido</h2>
        <p className="mt-2 text-muted-foreground">Iniciaste sesión como: {userEmail}</p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ResumenMensualContainer />
        </div>

        <div className="mt-6">
          <PosicionIvaContainer />
        </div>
      </div>
    </main>
  );
}
