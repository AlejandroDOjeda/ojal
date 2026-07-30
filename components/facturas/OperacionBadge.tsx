"use client";

import { ShoppingCart, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function OperacionBadge({ isCompra }: { isCompra: boolean }) {
  return (
    <Badge variant="outline" className="gap-1.5">
      {isCompra ? <ShoppingCart size={12} /> : <TrendingUp size={12} />}
      {isCompra ? "Compra" : "Venta"}
    </Badge>
  );
}
