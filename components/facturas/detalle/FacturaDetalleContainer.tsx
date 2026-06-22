"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import FacturaDetalleView from "./FacturaDetalleView";

export type EntidadInfo = {
  razon_social: string;
  cuit_cuil: string;
  condicion_iva: string;
};

export type FacturaDetalle = {
  id: string;
  tipo_operacion: "compra" | "venta";
  tipo_comprobante: "A" | "B" | "C" | "liquidacion_hacienda" | null;
  punto_venta: string | null;
  numero: string | null;
  fecha: string;
  entidad_legal: EntidadInfo | null;
  condicion_pago: "contado" | "cuenta_corriente";
  fecha_vencimiento: string | null;
  estado: "borrador" | "confirmada" | "pagada" | "cobrada" | "anulada";
  subtotal: number;
  iva_10_5: number;
  iva_21: number;
  total: number;
  observaciones: string | null;
};

export type ItemGastoDetalle = {
  id: string;
  descripcion: string;
  categoria_gasto: { nombre: string } | null;
  cantidad: number;
  precio_unitario: number;
  tasa_iva: number;
  subtotal: number;
};

export type ItemHaciendaDetalle = {
  id: string;
  categoria_hacienda: { nombre: string } | null;
  cabezas: number;
  kg_promedio: number | null;
  precio_por_kg: number | null;
  precio_por_cabeza: number | null;
  tasa_iva: number;
  subtotal: number;
};

export default function FacturaDetalleContainer() {
  const { id } = useParams<{ id: string }>();
  const [factura, setFactura] = useState<FacturaDetalle | null>(null);
  const [itemsGasto, setItemsGasto] = useState<ItemGastoDetalle[]>([]);
  const [itemsHacienda, setItemsHacienda] = useState<ItemHaciendaDetalle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      setLoading(true);

      const { data: facturaData, error } = await supabase
        .from("factura")
        .select("*, entidad_legal(razon_social, cuit_cuil, condicion_iva)")
        .eq("id", id)
        .single();

      if (error || !facturaData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const factura = facturaData as unknown as FacturaDetalle;
      setFactura(factura);

      if (factura.tipo_operacion === "compra") {
        const { data: items } = await supabase
          .from("item_gasto")
          .select("*, categoria_gasto(nombre)")
          .eq("factura_id", id)
          .order("created_at");
        setItemsGasto((items ?? []) as unknown as ItemGastoDetalle[]);
      } else {
        const { data: items } = await supabase
          .from("item_hacienda")
          .select("*, categoria_hacienda(nombre)")
          .eq("factura_id", id)
          .order("created_at");
        setItemsHacienda((items ?? []) as unknown as ItemHaciendaDetalle[]);
      }

      setLoading(false);
    };

    fetch();
  }, [id]);

  return (
    <FacturaDetalleView
      factura={factura}
      itemsGasto={itemsGasto}
      itemsHacienda={itemsHacienda}
      loading={loading}
      notFound={notFound}
    />
  );
}
