"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import FacturaDetalleView from "./FacturaDetalleView";

export type EntidadInfo = { RazonSocial: string; CuitCuil: string; Id_CondicionIva: number };

export type FacturaAsociadaInfo = { Id_Factura: number; Id_TipoComprobante: number | null; PuntoVenta: string | null; Numero: string | null };

export type DocumentoAsociadoInfo = { Id_Factura: number; Id_TipoComprobante: number | null; PuntoVenta: string | null; Numero: string | null; Fecha: string; Total: number };

export type FacturaDetalle = {
  Id_Factura:          number;
  Id_TipoOperacion:    number;
  Id_TipoComprobante:  number | null;
  PuntoVenta:          string | null;
  Numero:              string | null;
  Fecha:               string;
  EntidadLegal:        EntidadInfo | null;
  Id_CondicionPago:    number;
  FechaVencimiento:    string | null;
  Subtotal:            number;
  Iva10_5:             number;
  Iva21:               number;
  NoGravado:           number;
  Total:               number;
  Id_FacturaAsociada:  number | null;
  FacturaAsociada:     FacturaAsociadaInfo | null;
  Observaciones:       string | null;
};

export type ItemGastoDetalle = {
  Id_ItemGasto:      number;
  Descripcion:       string;
  CategoriaGasto:    { Nombre: string } | null;
  Cantidad:          number;
  PrecioUnitario:    number;
  TasaIva:           number;
  Subtotal:          number;
};

export type ItemHaciendaDetalle = {
  Id_ItemHacienda:   number;
  Campo:             { Nombre: string } | null;
  CategoriaHacienda: { Nombre: string } | null;
  Cabezas:           number;
  KgPromedio:        number | null;
  PrecioPorKg:       number | null;
  PrecioPorCabeza:   number | null;
  TasaIva:           number;
  Subtotal:          number;
};

export default function FacturaDetalleContainer() {
  const { id } = useParams<{ id: string }>();
  const [factura, setFactura] = useState<FacturaDetalle | null>(null);
  const [itemsGasto, setItemsGasto] = useState<ItemGastoDetalle[]>([]);
  const [itemsHacienda, setItemsHacienda] = useState<ItemHaciendaDetalle[]>([]);
  const [documentosAsociados, setDocumentosAsociados] = useState<DocumentoAsociadoInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("Factura")
        .select("*, EntidadLegal(RazonSocial, CuitCuil, Id_CondicionIva), FacturaAsociada:Id_FacturaAsociada(Id_Factura, Id_TipoComprobante, PuntoVenta, Numero)")
        .eq("Id_Factura", parseInt(id))
        .single();

      if (error || !data) { setNotFound(true); setLoading(false); return; }

      const factura = data as unknown as FacturaDetalle;
      setFactura(factura);

      // Documentos que corrigen esta factura (Notas de Crédito/Débito con
      // Id_FacturaAsociada = esta factura). Se busca siempre: aplica a
      // cualquier comprobante, no solo a facturas propiamente dichas.
      const documentosPromise = supabase
        .from("Factura")
        .select("Id_Factura, Id_TipoComprobante, PuntoVenta, Numero, Fecha, Total")
        .eq("Id_FacturaAsociada", parseInt(id))
        .order("Fecha", { ascending: false });

      if (factura.Id_TipoOperacion === 1) { // Compra: puede tener gastos genéricos y/o compras de hacienda
        const [{ data: itemsGasto }, { data: itemsHacienda }, { data: documentos }] = await Promise.all([
          supabase.from("ItemGasto").select("*, CategoriaGasto(Nombre)").eq("Id_Factura", parseInt(id)).order("CreatedAt"),
          supabase.from("ItemHacienda").select("*, CategoriaHacienda(Nombre), Campo(Nombre)").eq("Id_Factura", parseInt(id)).order("CreatedAt"),
          documentosPromise,
        ]);
        setItemsGasto((itemsGasto ?? []) as unknown as ItemGastoDetalle[]);
        setItemsHacienda((itemsHacienda ?? []) as unknown as ItemHaciendaDetalle[]);
        setDocumentosAsociados((documentos ?? []) as DocumentoAsociadoInfo[]);
      } else { // Venta
        const [{ data: items }, { data: documentos }] = await Promise.all([
          supabase.from("ItemHacienda").select("*, CategoriaHacienda(Nombre), Campo(Nombre)").eq("Id_Factura", parseInt(id)).order("CreatedAt"),
          documentosPromise,
        ]);
        setItemsHacienda((items ?? []) as unknown as ItemHaciendaDetalle[]);
        setDocumentosAsociados((documentos ?? []) as DocumentoAsociadoInfo[]);
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
      documentosAsociados={documentosAsociados}
      loading={loading}
      notFound={notFound}
    />
  );
}
