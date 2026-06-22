"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  calcItemGastoSubtotal,
  calcTotalesGasto,
  type FacturaHeaderData,
  type ItemGastoForm,
} from "@/components/facturas/types";
import NuevaCompraView from "./NuevaCompraView";

export type CategoriaGastoOption = {
  id: string;
  nombre: string;
  tasa_iva_habitual: number;
};

export type EntidadOption = {
  id: string;
  razon_social: string;
};

export default function NuevaCompraContainer() {
  const { userId } = useAuthContext();
  const router = useRouter();
  const [entidades, setEntidades] = useState<EntidadOption[]>([]);
  const [categorias, setCategorias] = useState<CategoriaGastoOption[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchData = useCallback(async () => {
    const [{ data: ents }, { data: cats }] = await Promise.all([
      supabase.from("entidad_legal").select("id, razon_social").order("razon_social"),
      supabase.from("categoria_gasto").select("id, nombre, tasa_iva_habitual").eq("activa", true).order("nombre"),
    ]);
    setEntidades(ents ?? []);
    setCategorias(cats ?? []);
    setLoadingData(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (header: FacturaHeaderData, items: ItemGastoForm[]) => {
    if (!userId) throw new Error("Usuario no autenticado");

    const totales = calcTotalesGasto(items);

    const { data: facturaData, error: facturaError } = await supabase
      .from("factura")
      .insert({
        user_id: userId,
        tipo_operacion: "compra",
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
      descripcion: item.descripcion,
      categoria_gasto_id: item.categoria_gasto_id || null,
      cantidad: parseFloat(item.cantidad),
      precio_unitario: parseFloat(item.precio_unitario),
      tasa_iva: parseFloat(item.tasa_iva),
      subtotal: calcItemGastoSubtotal(item),
    }));

    const { error: itemsError } = await supabase.from("item_gasto").insert(itemsPayload);

    if (itemsError) {
      await supabase.from("factura").delete().eq("id", facturaData.id);
      throw new Error(itemsError.message);
    }

    router.push("/facturas");
  };

  return (
    <NuevaCompraView
      entidades={entidades}
      categorias={categorias}
      loadingData={loadingData}
      onSave={handleSave}
    />
  );
}
