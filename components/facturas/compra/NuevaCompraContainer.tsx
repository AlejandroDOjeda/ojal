"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { TIPO_OPERACION } from "@/lib/opciones";
import { calcItemGastoSubtotal, calcItemHaciendaSubtotal, calcTotalesCompra, type FacturaHeaderData, type ItemCompraForm } from "@/components/facturas/types";
import type { CategoriaHaciendaOption } from "@/components/facturas/venta/NuevaVentaContainer";
import { useCampoContext } from "@/contexts/CampoContext";
import NuevaCompraView from "./NuevaCompraView";

export type CategoriaGastoOption = { id: number; Nombre: string; TasaIvaHabitual: number };
export type EntidadOption = { id: number; RazonSocial: string; CuitCuil: string };

export default function NuevaCompraContainer() {
  const router = useRouter();
  const { campoActivo, campos } = useCampoContext();
  const [entidades, setEntidades] = useState<EntidadOption[]>([]);
  const [categorias, setCategorias] = useState<CategoriaGastoOption[]>([]);
  const [categoriasHacienda, setCategoriasHacienda] = useState<CategoriaHaciendaOption[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchData = useCallback(async () => {
    const [{ data: ents }, { data: cats }, { data: catsHacienda }] = await Promise.all([
      supabase.from("EntidadLegal").select("Id_EntidadLegal, RazonSocial, CuitCuil").order("RazonSocial"),
      supabase.from("CategoriaGasto").select("Id_CategoriaGasto, Nombre, TasaIvaHabitual").eq("Activa", true).order("Nombre"),
      supabase.from("CategoriaHacienda").select("Id_CategoriaHacienda, Nombre, TasaIva").eq("Activa", true).order("Nombre"),
    ]);
    setEntidades((ents ?? []).map((e: { Id_EntidadLegal: number; RazonSocial: string; CuitCuil: string }) => ({ id: e.Id_EntidadLegal, RazonSocial: e.RazonSocial, CuitCuil: e.CuitCuil })));
    setCategorias((cats ?? []).map((c: { Id_CategoriaGasto: number; Nombre: string; TasaIvaHabitual: number }) => ({ id: c.Id_CategoriaGasto, Nombre: c.Nombre, TasaIvaHabitual: c.TasaIvaHabitual })));
    setCategoriasHacienda((catsHacienda ?? []).map((c: { Id_CategoriaHacienda: number; Nombre: string; TasaIva: number }) => ({ id: c.Id_CategoriaHacienda, Nombre: c.Nombre, TasaIva: c.TasaIva })));
    setLoadingData(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (header: FacturaHeaderData, items: ItemCompraForm[]) => {
    const totales = calcTotalesCompra(items, parseFloat(header.NoGravado) || 0);
    const esCuentaCorriente = header.Id_CondicionPago === "2";

    const { data: facturaData, error: facturaError } = await supabase
      .from("Factura")
      .insert({
        Id_TipoOperacion:   TIPO_OPERACION.COMPRA,
        Id_TipoComprobante: header.Id_TipoComprobante ? parseInt(header.Id_TipoComprobante) : null,
        PuntoVenta:         header.PuntoVenta || null,
        Numero:             header.Numero || null,
        Fecha:              header.Fecha,
        Id_EntidadLegal:    parseInt(header.Id_EntidadLegal),
        Id_CondicionPago:   parseInt(header.Id_CondicionPago),
        FechaVencimiento:   esCuentaCorriente ? header.FechaVencimiento || null : null,
        Subtotal:           totales.Subtotal,
        Iva10_5:            totales.Iva10_5,
        Iva21:              totales.Iva21,
        NoGravado:          totales.NoGravado,
        Total:              totales.Total,
      })
      .select("Id_Factura")
      .single();

    if (facturaError) throw new Error(facturaError.message);

    const itemsGasto = items.filter((i) => i._tipo === "gasto");
    const itemsHacienda = items.filter((i) => i._tipo === "hacienda");

    const gastoPayload = itemsGasto.map((item) => ({
      Id_Factura:         facturaData.Id_Factura,
      Descripcion:        item.Descripcion,
      Id_CategoriaGasto:  item.Id_CategoriaGasto ? parseInt(item.Id_CategoriaGasto) : null,
      Cantidad:           parseFloat(item.Cantidad),
      PrecioUnitario:     parseFloat(item.PrecioUnitario),
      TasaIva:            parseFloat(item.TasaIva),
      Subtotal:           calcItemGastoSubtotal(item),
    }));

    const haciendaPayload = itemsHacienda.map((item) => ({
      Id_Factura:           facturaData.Id_Factura,
      Id_Campo:             parseInt(item.Id_Campo),
      Id_CategoriaHacienda: parseInt(item.Id_CategoriaHacienda),
      Cabezas:              parseInt(item.Cabezas),
      KgPromedio:           item.Modalidad === "1" ? parseFloat(item.KgPromedio) : null,
      PrecioPorKg:          item.Modalidad === "1" ? parseFloat(item.PrecioPorKg) : null,
      PrecioPorCabeza:      item.Modalidad === "2" ? parseFloat(item.PrecioPorCabeza) : null,
      TasaIva:              parseFloat(item.TasaIva),
      Subtotal:             calcItemHaciendaSubtotal(item),
    }));

    const [{ error: gastoError }, { error: haciendaError }] = await Promise.all([
      gastoPayload.length > 0 ? supabase.from("ItemGasto").insert(gastoPayload) : Promise.resolve({ error: null }),
      haciendaPayload.length > 0 ? supabase.from("ItemHacienda").insert(haciendaPayload) : Promise.resolve({ error: null }),
    ]);
    const itemsError = gastoError ?? haciendaError;
    if (itemsError) {
      await supabase.from("Factura").delete().eq("Id_Factura", facturaData.Id_Factura);
      throw new Error(itemsError.message);
    }
    toast.success("Factura de compra guardada.");
    router.push("/facturas?tab=compras");
  };

  return (
    <NuevaCompraView
      entidades={entidades}
      categorias={categorias}
      categoriasHacienda={categoriasHacienda}
      campos={campos}
      campoActivoId={campoActivo?.Id_Campo ?? null}
      loadingData={loadingData}
      onSave={handleSave}
    />
  );
}
