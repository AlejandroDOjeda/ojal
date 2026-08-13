"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { StockFila } from "./StockActualContainer";

type Props = {
  filas: StockFila[];
  loading: boolean;
  error: string | null;
  sinDatos: boolean;
};

export default function StockActualView({ filas, loading, error, sinDatos }: Props) {
  const [expandido, setExpandido] = useState(true);
  const total = filas.reduce((sum, f) => sum + f.Cabezas, 0);
  const max = Math.max(1, ...filas.map((f) => f.Cabezas));
  const ordenadas = [...filas].sort((a, b) => b.Cabezas - a.Cabezas);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div>
      {sinDatos && (
        <div className="mb-5 rounded-md border border-border bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
          Todavía no cargaste el stock inicial.{" "}
          <Link href="/rodeo/carga-inicial" className="font-medium text-foreground underline underline-offset-2">
            Hacelo ahora
          </Link>
          .
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-6">
        <button
          type="button"
          onClick={() => setExpandido((v) => !v)}
          aria-expanded={expandido}
          className="flex w-full items-center gap-2 text-left"
        >
          {expandido ? (
            <ChevronDown size={18} className="shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight size={18} className="shrink-0 text-muted-foreground" />
          )}
          <p className="text-3xl font-bold tabular-nums text-foreground">
            {total}
            <span className="ml-2 text-base font-normal text-muted-foreground">cabezas totales</span>
          </p>
        </button>

        {expandido && (
          <div className="mt-6 space-y-3">
            {ordenadas.map((fila) => (
              <div key={fila.Id_CategoriaHacienda} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate text-sm text-muted-foreground">{fila.Nombre}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-[width]"
                    style={{ width: `${(fila.Cabezas / max) * 100}%` }}
                  />
                </div>
                <span
                  className={`w-10 shrink-0 text-right text-sm font-semibold tabular-nums ${
                    fila.Cabezas > 0 ? "text-foreground" : "text-muted-foreground/40"
                  }`}
                >
                  {fila.Cabezas}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
