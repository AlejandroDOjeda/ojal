"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { TIPO_OPERACION } from "@/lib/opciones";
import { calcItemHaciendaSubtotal, calcTotalesHacienda, type FacturaHeaderData, type ItemHaciendaForm } from "@/components/facturas/types";
import NuevaVentaView from "./NuevaVentaView";

export type CategoriaHaciendaOption = { id: number; Nombre: string; TasaIva: number };
export type EntidadOption = { id: number; RazonSocial: string; CuitCuil: string };

export default function NuevaVentaContainer() {
  const router = useRouter();
  const [entidades, setEntidades] = useState<EntidadOption[]>([]);
  const [categorias, setCategorias] = useState<CategoriaHaciendaOption[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchData = useCallback(async () => {
    const [{ data: ents }, { data: cats }] = await Promise.all([
      supabase.from("EntidadLegal").select("Id_EntidadLegal, RazonSocial, CuitCuil").order("RazonSocial"),
      supabase.from("CategoriaHacienda").select("Id_CategoriaHacienda, Nombre, TasaIva").eq("Activa", true).order("Nombre"),
    ]);
    setEntidades((ents ?? []).map((e: { Id_EntidadLegal: number; RazonSocial: string; CuitCuil: string }) => ({ id: e.Id_EntidadLegal, RazonSocial: e.RazonSocial, CuitCuil: e.CuitCuil })));
    setCategorias((cats ?? []).map((c: { Id_CategoriaHacienda: number; Nombre: string; TasaIva: number }) => ({ id: c.Id_CategoriaHacienda, Nombre: c.Nombre, TasaIva: c.TasaIva })));
    setLoadingData(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (header: FacturaHeaderData, items: ItemHaciendaForm[]) => {
    const totales = calcTotalesHacienda(items);
    const esCuentaCorriente = header.Id_CondicionPago === "2";

    const { data: facturaData, error: facturaError } = await supabase
      .from("Factura")
      .insert({
        Id_TipoOperacion:   TIPO_OPERACION.VENTA,
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
      Id_Factura:           facturaData.Id_Factura,
      Id_CategoriaHacienda: parseInt(item.Id_CategoriaHacienda),
      Cabezas:              parseInt(item.Cabezas),
      KgPromedio:           item.Modalidad === "1" ? parseFloat(item.KgPromedio) : null,
      PrecioPorKg:          item.Modalidad === "1" ? parseFloat(item.PrecioPorKg) : null,
      PrecioPorCabeza:      item.Modalidad === "2" ? parseFloat(item.PrecioPorCabeza) : null,
      TasaIva:              parseFloat(item.TasaIva),
      Subtotal:             calcItemHaciendaSubtotal(item),
    }));

    const { error: itemsError } = await supabase.from("ItemHacienda").insert(itemsPayload);
    if (itemsError) {
      await supabase.from("Factura").delete().eq("Id_Factura", facturaData.Id_Factura);
      throw new Error(itemsError.message);
    }
    toast.success("Factura de venta guardada.");
    router.push("/facturas?tab=ventas");
  };

  return <NuevaVentaView entidades={entidades} categorias={categorias} loadingData={loadingData} onSave={handleSave} />;
}
