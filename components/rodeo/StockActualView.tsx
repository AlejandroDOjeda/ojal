"use client";

import Link from "next/link";
import { Settings, Plus } from "lucide-react";
import type { StockFila } from "./StockActualContainer";

type Props = {
  filas: StockFila[];
  loading: boolean;
  error: string | null;
  sinDatos: boolean;
};

export default function StockActualView({ filas, loading, error, sinDatos }: Props) {
  const total = filas.reduce((sum, f) => sum + f.Cabezas, 0);

  if (loading) {
    return (
      <main className="p-8 max-w-2xl">
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8 max-w-2xl">
        <p className="text-sm text-destructive">{error}</p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-2xl">
      <div className="mb-6 flex items-start justify-between">
        <h1 className="text-2xl font-bold text-foreground">Rodeo</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/rodeo/carga-inicial"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Settings size={14} />
            Editar stock inicial
          </Link>
          <Link
            href="/rodeo/nuevo-movimiento"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus size={14} />
            Registrar movimiento
          </Link>
        </div>
      </div>

      {sinDatos && (
        <div className="mb-5 rounded-md border border-border bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
          Todavía no cargaste el stock inicial.{" "}
          <Link href="/rodeo/carga-inicial" className="font-medium text-foreground underline underline-offset-2">
            Hacelo ahora
          </Link>
          .
        </div>
      )}

      <div className="rounded-lg border border-border bg-card">
        <div className="grid grid-cols-2 border-b border-border px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span>Categoría</span>
          <span className="text-right">Cabezas</span>
        </div>

        {filas.map((fila, idx) => (
          <div
            key={fila.Id_CategoriaHacienda}
            className={`grid grid-cols-2 items-center px-5 py-3.5 ${
              idx < filas.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="text-sm font-medium text-foreground">{fila.Nombre}</span>
            <span
              className={`text-right text-sm tabular-nums ${
                fila.Cabezas > 0 ? "font-semibold text-foreground" : "text-muted-foreground"
              }`}
            >
              {fila.Cabezas}
            </span>
          </div>
        ))}

        <div className="grid grid-cols-2 items-center border-t border-border bg-muted/30 px-5 py-3">
          <span className="text-sm font-semibold text-foreground">Total</span>
          <span className="text-right text-sm font-bold tabular-nums text-foreground">
            {total}
          </span>
        </div>
      </div>
    </main>
  );
}
