"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ResumenRodeo } from "./ResumenRodeoContainer";

type Props = {
  resumen: ResumenRodeo | null;
  loading: boolean;
  error: string | null;
};

export default function ResumenRodeoCard({ resumen, loading, error }: Props) {
  if (error) {
    return (
      <div className="rounded-lg bg-card border border-border p-6 shadow-sm">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  const conStock = resumen?.categorias.filter((c) => c.cabezas > 0) ?? [];
  const sinDatos = !loading && resumen?.total === 0;

  return (
    <div className="rounded-lg bg-card border border-border p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-baseline gap-3">
          <h3 className="text-sm font-semibold text-foreground">Rodeo</h3>
          {!loading && resumen && (
            <span className="text-xs text-muted-foreground">
              {resumen.total} cab. totales
            </span>
          )}
          {loading && (
            <span className="text-xs text-muted-foreground opacity-40">—</span>
          )}
        </div>
        <Link
          href="/rodeo"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Ver rodeo
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* Contenido */}
      {loading && (
        <div className="h-8 flex items-center">
          <span className="text-sm text-muted-foreground opacity-40">Cargando…</span>
        </div>
      )}

      {sinDatos && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Sin stock inicial cargado.</p>
          <Link
            href="/rodeo/carga-inicial"
            className="text-xs font-medium text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity"
          >
            Configurar ahora
          </Link>
        </div>
      )}

      {!loading && !sinDatos && (
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {conStock.map((c) => (
            <div key={c.id} className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {c.cabezas}
              </span>
              <span className="text-xs text-muted-foreground">{c.nombre}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
