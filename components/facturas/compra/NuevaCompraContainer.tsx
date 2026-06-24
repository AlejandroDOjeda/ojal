"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { TIPO_OPERACION } from "@/lib/opciones";
import { calcItemGastoSubtotal, calcTotalesGasto, type FacturaHeaderData, type ItemGastoForm } from "@/components/facturas/types";
import NuevaCompraView from "./NuevaCompraView";

export type CategoriaGastoOption = { id: number; Nombre: string; TasaIvaHabitual: number };
export type EntidadOption = { id: number; RazonSocial: string; CuitCuil: string };

export default function NuevaCompraContainer() {
  const router = useRouter();
  const [entidades, setEntidades] = useState<EntidadOption[]>([]);
  const [categorias, setCategorias] = useState<CategoriaGastoOption[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchData = useCallback(async () => {
    const [{ data: ents }, { data: cats }] = await Promise.all([
      supabase.from("EntidadLegal").select("Id_EntidadLegal, RazonSocial, CuitCuil").order("RazonSocial"),
      supabase.from("CategoriaGasto").select("Id_CategoriaGasto, Nombre, TasaIvaHabitual").eq("Activa", true).order("Nombre"),
    ]);
    setEntidades((ents ?? []).map((e: { Id_EntidadLegal: number; RazonSocial: string; CuitCuil: string }) => ({ id: e.Id_EntidadLegal, RazonSocial: e.RazonSocial, CuitCuil: e.CuitCuil })));
    setCategorias((cats ?? []).map((c: { Id_CategoriaGasto: number; Nombre: string; TasaIvaHabitual: number }) => ({ id: c.Id_CategoriaGasto, Nombre: c.Nombre, TasaIvaHabitual: c.TasaIvaHabitual })));
    setLoadingData(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (header: FacturaHeaderData, items: ItemGastoForm[]) => {
    const totales = calcTotalesGasto(items);
    const esCuentaCorriente = header.Id_CondicionPago === "2";

    const { data: facturaData, error: facturaError } = await supabase
      .from("Factura")
      .insert({
        Id_TipoOperacion:   TIPO_OPERACION.COMPRA,
        Id_TipoComprobante: header.Id_TipoComprobante ? parseInt(header.Id_TipoComprobante) : null,
        PuntoVenta:         header.PuntoVenta ? header.PuntoVenta.padStart(4, "0") : null,
        Numero:             header.Numero ? header.Numero.padStart(8, "0") : null,
        Fecha:              header.Fecha,
        Id_EntidadLegal:    parseInt(header.Id_EntidadLegal),
        Id_CondicionPago:   parseInt(header.Id_CondicionPago),
        FechaVencimiento:   esCuentaCorriente ? header.FechaVencimiento || null : null,
        Subtotal:           totales.Subtotal,
        Iva10_5:            totales.Iva10_5,
        Iva21:              totales.Iva21,
        Total:              totales.Total,
      })
      .select("Id_Factura")
      .single();

    if (facturaError) throw new Error(facturaError.message);

    const itemsPayload = items.map((item) => ({
      Id_Factura:         facturaData.Id_Factura,
      Descripcion:        item.Descripcion,
      Id_CategoriaGasto:  item.Id_CategoriaGasto ? parseInt(item.Id_CategoriaGasto) : null,
      Cantidad:           parseFloat(item.Cantidad),
      PrecioUnitario:     parseFloat(item.PrecioUnitario),
      TasaIva:            parseFloat(item.TasaIva),
      Subtotal:           calcItemGastoSubtotal(item),
    }));

    const { error: itemsError } = await supabase.from("ItemGasto").insert(itemsPayload);
    if (itemsError) {
      await supabase.from("Factura").delete().eq("Id_Factura", facturaData.Id_Factura);
      throw new Error(itemsError.message);
    }
    router.push("/facturas");
  };

  return <NuevaCompraView entidades={entidades} categorias={categorias} loadingData={loadingData} onSave={handleSave} />;
}
