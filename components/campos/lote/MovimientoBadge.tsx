"use client";

import { ShoppingCart, TrendingUp, Baby, Skull, SlidersHorizontal, ArrowRightLeft, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TIPO_MOVIMIENTO_LABELS } from "@/lib/opciones";

const ICONOS: Record<string, LucideIcon> = {
  compra: ShoppingCart,
  venta: TrendingUp,
  nacimiento: Baby,
  muerte: Skull,
  ajuste_manual: SlidersHorizontal,
  traslado: ArrowRightLeft,
};

export function MovimientoBadge({ tipo }: { tipo: string }) {
  const Icono = ICONOS[tipo] ?? SlidersHorizontal;
  return (
    <Badge variant="outline" className="gap-1.5">
      <Icono size={12} />
      {TIPO_MOVIMIENTO_LABELS[tipo] ?? tipo}
    </Badge>
  );
}
