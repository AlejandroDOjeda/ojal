"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  calcItemHaciendaSubtotal,
  calcTotalesHacienda,
  type FacturaHeaderData,
  type ItemHaciendaForm,
} from "@/components/facturas/types";
import NuevaVentaView from "./NuevaVentaView";

export type CategoriaHaciendaOption = {
  id: string;
  nombre: string;
  tasa_iva: number;
};

export type EntidadOption = {
  id: string;
  razon_social: string;
};

export default function NuevaVentaContainer() {
  const { userId } = useAuthContext();
  const router = useRouter();
  const [entidades, setEntidades] = useState<EntidadOption[]>([]);
  const [categorias, setCategorias] = useState<CategoriaHaciendaOption[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchData = useCallback(async () => {
    const [{ data: ents }, { data: cats }] = await Promise.all([
      supabase.from("entidad_legal").select("id, razon_social").order("razon_social"),
      supabase.from("categoria_hacienda").select("id, nombre, tasa_iva").eq("activa", true).order("nombre"),
    ]);
    setEntidades(ents ?? []);
    setCategorias(cats ?? []);
    setLoadingData(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (header: FacturaHeaderData, items: ItemHaciendaForm[]) => {
    if (!userId) throw new Error("Usuario no autenticado");

    const totales = calcTotalesHacienda(items);

    const { data: facturaData, error: facturaError } = await supabase
      .from("factura")
      .insert({
        user_id: userId,
        tipo_operacion: "venta",
        tipo_comprobante: (header.tipo_comprobante as "A" | "B" | "C") || null,
        punto_venta: header.punto_venta ? header.punto_venta.padStart(4, "0") : null,
        numero: header.numero ? header.numero.padStart(8, "0") : null,
        fecha: header.fecha,
        entidad_legal_id: header.entidad_legal_id,
        condicion_pago: header.condicion_pago,
        fecha_vencimiento: header.condicion_pago === "cuenta_corriente" ? header.fecha_vencimiento || null : null,
        estado: "confirmada",
        subtotal: totales.subtotal,
        iva_10_5: totales.iva_10_5,
        iva_21: totales.iva_21,
        total: totales.total,
      })
      .select("id")
      .single();

    if (facturaError) throw new Error(facturaError.message);

    const itemsPayload = items.map((item) => ({
      factura_id: facturaData.id,
      categoria_hacienda_id: item.categoria_hacienda_id,
      cabezas: parseInt(item.cabezas),
      kg_promedio: item.modalidad === "por_kg" ? parseFloat(item.kg_promedio) : null,
      precio_por_kg: item.modalidad === "por_kg" ? parseFloat(item.precio_por_kg) : null,
      precio_por_cabeza: item.modalidad === "por_cabeza" ? parseFloat(item.precio_por_cabeza) : null,
      tasa_iva: parseFloat(item.tasa_iva),
      subtotal: calcItemHaciendaSubtotal(item),
    }));

    const { error: itemsError } = await supabase.from("item_hacienda").insert(itemsPayload);

    if (itemsError) {
      await supabase.from("factura").delete().eq("id", facturaData.id);
      throw new Error(itemsError.message);
    }

    router.push("/facturas");
  };

  return (
    <NuevaVentaView
      entidades={entidades}
      categorias={categorias}
      loadingData={loadingData}
      onSave={handleSave}
    />
  );
}
