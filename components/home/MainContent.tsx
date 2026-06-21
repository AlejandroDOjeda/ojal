"use client";

import { useAuthContext } from "@/contexts/AuthContext";

export default function MainContent() {
  const { userEmail } = useAuthContext();

  return (
    <main className="flex-1 p-8">
      <div className="max-w-6xl">
        <h2 className="text-3xl font-bold text-foreground">Bienvenido</h2>
        <p className="mt-2 text-muted-foreground">Iniciaste sesión como: {userEmail}</p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">Card 1</h3>
            <p className="mt-2 text-muted-foreground">Contenido del card 1</p>
          </div>
          <div className="rounded-lg bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">Card 2</h3>
            <p className="mt-2 text-muted-foreground">Contenido del card 2</p>
          </div>
          <div className="rounded-lg bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">Card 3</h3>
            <p className="mt-2 text-muted-foreground">Contenido del card 3</p>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground">Sección Principal</h3>
          <p className="mt-2 text-muted-foreground">Aquí puedes agregar el contenido principal de tu aplicación.</p>
        </div>
      </div>
    </main>
  );
}
