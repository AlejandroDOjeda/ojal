// Tipos y utilidades compartidas del módulo de facturas

export type FacturaHeaderData = {
  tipo_comprobante: "A" | "B" | "C" | "";
  punto_venta: string;
  numero: string;
  fecha: string;
  entidad_legal_id: string;
  condicion_pago: "contado" | "cuenta_corriente";
  fecha_vencimiento: string;
};

export type ItemGastoForm = {
  _key: string;
  descripcion: string;
  categoria_gasto_id: string;
  cantidad: string;
  precio_unitario: string;
  tasa_iva: string;
};

export type ItemHaciendaForm = {
  _key: string;
  categoria_hacienda_id: string;
  cabezas: string;
  modalidad: "por_kg" | "por_cabeza";
  kg_promedio: string;
  precio_por_kg: string;
  precio_por_cabeza: string;
  tasa_iva: string;
};

export type Totales = {
  subtotal: number;
  iva_10_5: number;
  iva_21: number;
  total: number;
};

// Valores iniciales
export const EMPTY_HEADER: FacturaHeaderData = {
  tipo_comprobante: "",
  punto_venta: "0001",
  numero: "",
  fecha: new Date().toISOString().split("T")[0],
  entidad_legal_id: "",
  condicion_pago: "contado",
  fecha_vencimiento: "",
};

export const EMPTY_ITEM_GASTO: Omit<ItemGastoForm, "_key"> = {
  descripcion: "",
  categoria_gasto_id: "",
  cantidad: "1",
  precio_unitario: "",
  tasa_iva: "21",
};

export const EMPTY_ITEM_HACIENDA: Omit<ItemHaciendaForm, "_key"> = {
  categoria_hacienda_id: "",
  cabezas: "",
  modalidad: "por_kg",
  kg_promedio: "",
  precio_por_kg: "",
  precio_por_cabeza: "",
  tasa_iva: "10.5",
};

// Cálculo de subtotal por ítem
export function calcItemGastoSubtotal(item: ItemGastoForm): number {
  return (parseFloat(item.cantidad) || 0) * (parseFloat(item.precio_unitario) || 0);
}

export function calcItemHaciendaSubtotal(item: ItemHaciendaForm): number {
  const cabezas = parseInt(item.cabezas) || 0;
  if (item.modalidad === "por_kg") {
    return cabezas * (parseFloat(item.kg_promedio) || 0) * (parseFloat(item.precio_por_kg) || 0);
  }
  return cabezas * (parseFloat(item.precio_por_cabeza) || 0);
}

// Cálculo de totales generales
function acumularIva(totales: { iva_10_5: number; iva_21: number }, subtotal: number, tasa: number) {
  if (tasa === 10.5) totales.iva_10_5 += subtotal * 0.105;
  else if (tasa === 21) totales.iva_21 += subtotal * 0.21;
}

export function calcTotalesGasto(items: ItemGastoForm[]): Totales {
  const acc = { subtotal: 0, iva_10_5: 0, iva_21: 0 };
  for (const item of items) {
    const sub = calcItemGastoSubtotal(item);
    acc.subtotal += sub;
    acumularIva(acc, sub, parseFloat(item.tasa_iva) || 0);
  }
  return { ...acc, total: acc.subtotal + acc.iva_10_5 + acc.iva_21 };
}

export function calcTotalesHacienda(items: ItemHaciendaForm[]): Totales {
  const acc = { subtotal: 0, iva_10_5: 0, iva_21: 0 };
  for (const item of items) {
    const sub = calcItemHaciendaSubtotal(item);
    acc.subtotal += sub;
    acumularIva(acc, sub, parseFloat(item.tasa_iva) || 0);
  }
  return { ...acc, total: acc.subtotal + acc.iva_10_5 + acc.iva_21 };
}

export const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);
