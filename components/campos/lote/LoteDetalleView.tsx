"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronRight, Layers, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/app";
import HistorialMovimientosContainer from "./HistorialMovimientosContainer";
import type { LoteInfo, StockFila } from "./LoteDetalleContainer";

type Props = {
  lote: LoteInfo | null;
  filas: StockFila[];
  loading: boolean;
  notFound: boolean;
  error: string | null;
  sinDatos: boolean;
  idLote: number;
};

export default function LoteDetalleView({ lote, filas, loading, notFound, error, sinDatos, idLote }: Props) {
  const [expandido, setExpandido] = useState(true);
  const total = filas.reduce((sum, f) => sum + f.Cabezas, 0);
  const max = Math.max(1, ...filas.map((f) => f.Cabezas));
  const ordenadas = [...filas].sort((a, b) => b.Cabezas - a.Cabezas);

  const backLink = (
    <Link href={lote ? `/campos/${lote.Id_Campo}` : "/campos"}>
      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground -ml-2">
        <ArrowLeft size={14} />
        Volver a {lote?.Campo?.Nombre ?? "Campo"}
      </Button>
    </Link>
  );

  if (loading && !lote) {
    return <PageShell title="Lote" back={backLink}><p className="text-muted-foreground">Cargando...</p></PageShell>;
  }

  if (notFound || !lote) {
    return (
      <PageShell title="Lote no encontrado" back={backLink}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Layers size={48} className="text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">Este lote no existe o no tenés acceso a él.</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={lote.Nombre}
      back={backLink}
      action={
        <div className="flex items-center gap-2">
          <Link
            href={`/campos/${lote.Id_Campo}/lotes/${lote.Id_Lote}/carga-inicial`}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Settings size={14} />
            Editar stock inicial
          </Link>
          <Link
            href={`/campos/${lote.Id_Campo}/lotes/${lote.Id_Lote}/nuevo-movimiento`}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus size={14} />
            Registrar movimiento
          </Link>
        </div>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-8">
        <div>
          {sinDatos && !loading && (
            <div className="mb-5 rounded-md border border-border bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
              Todavía no cargaste el stock inicial de este lote.{" "}
              <Link
                href={`/campos/${lote.Id_Campo}/lotes/${lote.Id_Lote}/carga-inicial`}
                className="font-medium text-foreground underline underline-offset-2"
              >
                Hacelo ahora
              </Link>
              .
            </div>
          )}

          {error && (
            <p className="mb-5 text-sm text-destructive">{error}</p>
          )}

          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : (
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
          )}
        </div>

        <HistorialMovimientosContainer idLote={idLote} />
      </div>
    </PageShell>
  );
}
