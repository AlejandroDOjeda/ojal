"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { SectionCard } from "@/components/app";
import type { Totales } from "./types";
import { formatARS } from "./types";

type Props = {
  totales: Totales;
  noGravado: string;
  onNoGravadoChange: (value: string) => void;
};

export function FacturaTotales({ totales, noGravado, onNoGravadoChange }: Props) {
  const [mostrarNoGravado, setMostrarNoGravado] = useState(() => !!noGravado);

  const quitarNoGravado = () => { setMostrarNoGravado(false); onNoGravadoChange(""); };

  return (
    <SectionCard title="Totales">
      <div className="space-y-2 text-sm max-w-xs ml-auto">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal (sin IVA)</span>
          <span className="font-medium text-foreground">{formatARS(totales.Subtotal)}</span>
        </div>
        {totales.Iva10_5 > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">IVA 10.5%</span>
            <span className="font-medium text-foreground">{formatARS(totales.Iva10_5)}</span>
          </div>
        )}
        {totales.Iva21 > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">IVA 21%</span>
            <span className="font-medium text-foreground">{formatARS(totales.Iva21)}</span>
          </div>
        )}

        {mostrarNoGravado ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">No Gravado</span>
              <button type="button" onClick={quitarNoGravado} className="text-muted-foreground hover:text-destructive">
                <X size={12} />
              </button>
            </div>
            <InputGroup>
              <InputGroupAddon>$</InputGroupAddon>
              <InputGroupInput
                type="number" min="0" step="0.01"
                value={noGravado}
                onChange={(e) => onNoGravadoChange(e.target.value)}
                placeholder="0,00"
                className="text-right"
              />
            </InputGroup>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMostrarNoGravado(true)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Plus size={12} />Agregar monto no gravado
          </button>
        )}

        <div className="flex justify-between border-t border-border pt-2">
          <span className="font-semibold text-foreground text-base">Total</span>
          <span className="font-bold text-foreground text-base">{formatARS(totales.Total)}</span>
        </div>
      </div>
    </SectionCard>
  );
}
