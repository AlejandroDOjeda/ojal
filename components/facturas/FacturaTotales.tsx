import { SectionCard } from "@/components/app";
import type { Totales } from "./types";
import { formatARS } from "./types";

export function FacturaTotales({ totales }: { totales: Totales }) {
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
        <div className="flex justify-between border-t border-border pt-2">
          <span className="font-semibold text-foreground text-base">Total</span>
          <span className="font-bold text-foreground text-base">{formatARS(totales.Total)}</span>
        </div>
      </div>
    </SectionCard>
  );
}
