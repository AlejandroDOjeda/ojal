"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import FacturaDetalleView from "./FacturaDetalleView";

export type EntidadInfo = { RazonSocial: string; CuitCuil: string; Id_CondicionIva: number };

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
  Total:               number;
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
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("Factura")
        .select("*, EntidadLegal(RazonSocial, CuitCuil, Id_CondicionIva)")
        .eq("Id_Factura", parseInt(id))
        .single();

      if (error || !data) { setNotFound(true); setLoading(false); return; }

      const factura = data as unknown as FacturaDetalle;
      setFactura(factura);

      if (factura.Id_TipoOperacion === 1) { // Compra
        const { data: items } = await supabase
          .from("ItemGasto")
          .select("*, CategoriaGasto(Nombre)")
          .eq("Id_Factura", parseInt(id))
          .order("CreatedAt");
        setItemsGasto((items ?? []) as unknown as ItemGastoDetalle[]);
      } else { // Venta
        const { data: items } = await supabase
          .from("ItemHacienda")
          .select("*, CategoriaHacienda(Nombre), Campo(Nombre)")
          .eq("Id_Factura", parseInt(id))
          .order("CreatedAt");
        setItemsHacienda((items ?? []) as unknown as ItemHaciendaDetalle[]);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  return <FacturaDetalleView factura={factura} itemsGasto={itemsGasto} itemsHacienda={itemsHacienda} loading={loading} notFound={notFound} />;
}
