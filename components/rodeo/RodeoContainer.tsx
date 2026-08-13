"use client";

import Link from "next/link";
import { Settings, Plus } from "lucide-react";
import { PageShell } from "@/components/app";
import StockActualContainer from "./StockActualContainer";
import HistorialMovimientosContainer from "./HistorialMovimientosContainer";

export default function RodeoContainer() {
  return (
    <PageShell
      title="Rodeo"
      action={
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
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-8">
        <StockActualContainer />
        <HistorialMovimientosContainer />
      </div>
    </PageShell>
  );
}
