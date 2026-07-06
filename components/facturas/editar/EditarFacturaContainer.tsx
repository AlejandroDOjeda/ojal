"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { TIPO_OPERACION } from "@/lib/opciones";
import {
  calcItemGastoSubtotal, calcItemHaciendaSubtotal, calcTotalesCompra, calcTotalesHacienda,
  type FacturaHeaderData, type ItemCompraForm, type ItemHaciendaForm,
} from "@/components/facturas/types";
import type { CategoriaGastoOption, EntidadOption } from "@/components/facturas/compra/NuevaCompraContainer";
import type { CategoriaHaciendaOption } from "@/components/facturas/venta/NuevaVentaContainer";
import NuevaCompraView from "@/components/facturas/compra/NuevaCompraView";
import NuevaVentaView from "@/components/facturas/venta/NuevaVentaView";
import { PageShell } from "@/components/app";
import { useCampoContext } from "@/contexts/CampoContext";

let keyCounter = 0;
const newKey = () => String(++keyCounter);

export default function EditarFacturaContainer() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { campos, campoActivo } = useCampoContext();

  const [tipoOperacion, setTipoOperacion] = useState<number | null>(null);
  const [initialHeader, setInitialHeader] = useState<FacturaHeaderData | null>(null);
  const [initialItemsCompra, setInitialItemsCompra] = useState<ItemCompraForm[] | null>(null);
  const [initialItemsHacienda, setInitialItemsHacienda] = useState<ItemHaciendaForm[] | null>(null);
  const [entidades, setEntidades] = useState<EntidadOption[]>([]);
  const [categoriasGasto, setCategoriasGasto] = useState<CategoriaGastoOption[]>([]);
  const [categoriasHacienda, setCategoriasHacienda] = useState<CategoriaHaciendaOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    const facId = parseInt(id);

    const [
      { data: facturaData, error: facturaError },
      { data: ents },
      { data: catsGasto },
      { data: catsHacienda },
    ] = await Promise.all([
      supabase.from("Factura").select("*").eq("Id_Factura", facId).single(),
      supabase.from("EntidadLegal").select("Id_EntidadLegal, RazonSocial, CuitCuil").order("RazonSocial"),
      supabase.from("CategoriaGasto").select("Id_CategoriaGasto, Nombre, TasaIvaHabitual").eq("Activa", true).order("Nombre"),
      supabase.from("CategoriaHacienda").select("Id_CategoriaHacienda, Nombre, TasaIva").eq("Activa", true).order("Nombre"),
    ]);

    if (facturaError || !facturaData) { setNotFound(true); setLoading(false); return; }

    const f = facturaData as {
      Id_TipoOperacion: number; Id_TipoComprobante: number | null; PuntoVenta: string | null; Numero: string | null;
      Fecha: string; Id_EntidadLegal: number; Id_CondicionPago: number; FechaVencimiento: string | null; NoGravado: number;
    };

    setTipoOperacion(f.Id_TipoOperacion);
    setInitialHeader({
      Id_TipoComprobante: f.Id_TipoComprobante ? String(f.Id_TipoComprobante) : "",
      PuntoVenta: f.PuntoVenta ?? "00001",
      Numero: f.Numero ?? "",
      Fecha: f.Fecha,
      Id_EntidadLegal: String(f.Id_EntidadLegal),
      Id_CondicionPago: String(f.Id_CondicionPago),
      FechaVencimiento: f.FechaVencimiento ?? "",
      NoGravado: f.NoGravado ? String(f.NoGravado) : "",
    });

    setEntidades((ents ?? []).map((e: { Id_EntidadLegal: number; RazonSocial: string; CuitCuil: string }) => ({ id: e.Id_EntidadLegal, RazonSocial: e.RazonSocial, CuitCuil: e.CuitCuil })));
    setCategoriasGasto((catsGasto ?? []).map((c: { Id_CategoriaGasto: number; Nombre: string; TasaIvaHabitual: number }) => ({ id: c.Id_CategoriaGasto, Nombre: c.Nombre, TasaIvaHabitual: c.TasaIvaHabitual })));
    setCategoriasHacienda((catsHacienda ?? []).map((c: { Id_CategoriaHacienda: number; Nombre: string; TasaIva: number }) => ({ id: c.Id_CategoriaHacienda, Nombre: c.Nombre, TasaIva: c.TasaIva })));

    if (f.Id_TipoOperacion === TIPO_OPERACION.COMPRA) {
      const [{ data: itemsGasto }, { data: itemsHacienda }] = await Promise.all([
        supabase.from("ItemGasto").select("*").eq("Id_Factura", facId).order("CreatedAt"),
        supabase.from("ItemHacienda").select("*").eq("Id_Factura", facId).order("CreatedAt"),
      ]);
      const gasto: ItemCompraForm[] = (itemsGasto ?? []).map((item: {
        Id_CategoriaGasto: number | null; Descripcion: string; Cantidad: number; PrecioUnitario: number; TasaIva: number;
      }) => ({
        _key: newKey(),
        _tipo: "gasto",
        Descripcion: item.Descripcion,
        Id_CategoriaGasto: item.Id_CategoriaGasto ? String(item.Id_CategoriaGasto) : "",
        Cantidad: String(item.Cantidad),
        PrecioUnitario: String(item.PrecioUnitario),
        TasaIva: String(item.TasaIva),
      }));
      const hacienda: ItemCompraForm[] = (itemsHacienda ?? []).map((item: {
        Id_Campo: number; Id_CategoriaHacienda: number; Cabezas: number; KgPromedio: number | null; PrecioPorKg: number | null; PrecioPorCabeza: number | null; TasaIva: number;
      }) => ({
        _key: newKey(),
        _tipo: "hacienda",
        Id_Campo: String(item.Id_Campo),
        Id_CategoriaHacienda: String(item.Id_CategoriaHacienda),
        Cabezas: String(item.Cabezas),
        Modalidad: item.KgPromedio !== null ? "1" as const : "2" as const,
        KgPromedio: item.KgPromedio ? String(item.KgPromedio) : "",
        PrecioPorKg: item.PrecioPorKg ? String(item.PrecioPorKg) : "",
        PrecioPorCabeza: item.PrecioPorCabeza ? String(item.PrecioPorCabeza) : "",
        TasaIva: String(item.TasaIva),
      }));
      setInitialItemsCompra([...gasto, ...hacienda]);
    } else {
      const { data: items } = await supabase.from("ItemHacienda").select("*").eq("Id_Factura", facId).order("CreatedAt");
      setInitialItemsHacienda((items ?? []).map((item: {
        Id_Campo: number; Id_CategoriaHacienda: number; Cabezas: number; KgPromedio: number | null; PrecioPorKg: number | null; PrecioPorCabeza: number | null; TasaIva: number;
      }) => ({
        _key: newKey(),
        Id_Campo: String(item.Id_Campo),
        Id_CategoriaHacienda: String(item.Id_CategoriaHacienda),
        Cabezas: String(item.Cabezas),
        Modalidad: item.KgPromedio !== null ? "1" as const : "2" as const,
        KgPromedio: item.KgPromedio ? String(item.KgPromedio) : "",
        PrecioPorKg: item.PrecioPorKg ? String(item.PrecioPorKg) : "",
        PrecioPorCabeza: item.PrecioPorCabeza ? String(item.PrecioPorCabeza) : "",
        TasaIva: String(item.TasaIva),
      })));
    }

    setLoading(false);
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpdateCompra = async (header: FacturaHeaderData, items: ItemCompraForm[]) => {
    const facId = parseInt(id);
    const totales = calcTotalesCompra(items, parseFloat(header.NoGravado) || 0);
    const esCuentaCorriente = header.Id_CondicionPago === "2";

    const { error: updateError } = await supabase.from("Factura").update({
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
    }).eq("Id_Factura", facId);

    if (updateError) throw new Error(updateError.message);

    const [{ error: deleteGastoError }, { error: deleteHaciendaError }] = await Promise.all([
      supabase.from("ItemGasto").delete().eq("Id_Factura", facId),
      supabase.from("ItemHacienda").delete().eq("Id_Factura", facId),
    ]);
    if (deleteGastoError) throw new Error(deleteGastoError.message);
    if (deleteHaciendaError) throw new Error(deleteHaciendaError.message);

    const itemsGasto = items.filter((i) => i._tipo === "gasto");
    const itemsHacienda = items.filter((i) => i._tipo === "hacienda");

    const gastoPayload = itemsGasto.map((item) => ({
      Id_Factura:        facId,
      Descripcion:       item.Descripcion,
      Id_CategoriaGasto: item.Id_CategoriaGasto ? parseInt(item.Id_CategoriaGasto) : null,
      Cantidad:          parseFloat(item.Cantidad),
      PrecioUnitario:    parseFloat(item.PrecioUnitario),
      TasaIva:           parseFloat(item.TasaIva),
      Subtotal:          calcItemGastoSubtotal(item),
    }));

    const haciendaPayload = itemsHacienda.map((item) => ({
      Id_Factura:           facId,
      Id_Campo:             parseInt(item.Id_Campo),
      Id_CategoriaHacienda: parseInt(item.Id_CategoriaHacienda),
      Cabezas:              parseInt(item.Cabezas),
      KgPromedio:           item.Modalidad === "1" ? parseFloat(item.KgPromedio) : null,
      PrecioPorKg:          item.Modalidad === "1" ? parseFloat(item.PrecioPorKg) : null,
      PrecioPorCabeza:      item.Modalidad === "2" ? parseFloat(item.PrecioPorCabeza) : null,
      TasaIva:              parseFloat(item.TasaIva),
      Subtotal:             calcItemHaciendaSubtotal(item),
    }));

    const [{ error: insertGastoError }, { error: insertHaciendaError }] = await Promise.all([
      gastoPayload.length > 0 ? supabase.from("ItemGasto").insert(gastoPayload) : Promise.resolve({ error: null }),
      haciendaPayload.length > 0 ? supabase.from("ItemHacienda").insert(haciendaPayload) : Promise.resolve({ error: null }),
    ]);
    if (insertGastoError) throw new Error(insertGastoError.message);
    if (insertHaciendaError) throw new Error(insertHaciendaError.message);

    toast.success("Factura de compra actualizada.");
    router.push("/facturas?tab=compras");
  };

  const handleUpdateVenta = async (header: FacturaHeaderData, items: ItemHaciendaForm[]) => {
    const facId = parseInt(id);
    const totales = calcTotalesHacienda(items, parseFloat(header.NoGravado) || 0);
    const esCuentaCorriente = header.Id_CondicionPago === "2";

    const { error: updateError } = await supabase.from("Factura").update({
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
    }).eq("Id_Factura", facId);

    if (updateError) throw new Error(updateError.message);

    const { error: deleteError } = await supabase.from("ItemHacienda").delete().eq("Id_Factura", facId);
    if (deleteError) throw new Error(deleteError.message);

    const { error: insertError } = await supabase.from("ItemHacienda").insert(
      items.map((item) => ({
        Id_Factura:           facId,
        Id_Campo:             parseInt(item.Id_Campo),
        Id_CategoriaHacienda: parseInt(item.Id_CategoriaHacienda),
        Cabezas:              parseInt(item.Cabezas),
        KgPromedio:           item.Modalidad === "1" ? parseFloat(item.KgPromedio) : null,
        PrecioPorKg:          item.Modalidad === "1" ? parseFloat(item.PrecioPorKg) : null,
        PrecioPorCabeza:      item.Modalidad === "2" ? parseFloat(item.PrecioPorCabeza) : null,
        TasaIva:              parseFloat(item.TasaIva),
        Subtotal:             calcItemHaciendaSubtotal(item),
      }))
    );
    if (insertError) throw new Error(insertError.message);

    toast.success("Factura de venta actualizada.");
    router.push("/facturas?tab=ventas");
  };

  if (loading) {
    return (
      <PageShell title="Editar Factura" className="max-w-none">
        <p className="text-muted-foreground">Cargando...</p>
      </PageShell>
    );
  }

  if (notFound) {
    return (
      <PageShell title="Editar Factura" className="max-w-none">
        <p className="text-muted-foreground">Factura no encontrada.</p>
      </PageShell>
    );
  }

  if (tipoOperacion === TIPO_OPERACION.COMPRA) {
    return (
      <NuevaCompraView
        entidades={entidades}
        categorias={categoriasGasto}
        categoriasHacienda={categoriasHacienda}
        campos={campos}
        campoActivoId={campoActivo?.Id_Campo ?? null}
        loadingData={false}
        initialHeader={initialHeader!}
        initialItems={initialItemsCompra!}
        title="Editar Factura de Compra"
        cancelPath="/facturas?tab=compras"
        onSave={handleUpdateCompra}
      />
    );
  }

  return (
    <NuevaVentaView
      entidades={entidades}
      categorias={categoriasHacienda}
      campos={campos}
      campoActivoId={campoActivo?.Id_Campo ?? null}
      loadingData={false}
      initialHeader={initialHeader!}
      initialItems={initialItemsHacienda!}
      title="Editar Factura de Venta"
      cancelPath="/facturas?tab=ventas"
      onSave={handleUpdateVenta}
    />
  );
}
