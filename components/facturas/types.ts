// Tipos y utilidades del módulo de facturas.
// Los campos de referencia (Id_TipoComprobante, Id_CondicionPago) se guardan
// como strings en el estado del formulario para compatibilidad con Select,
// y se parsean a integer al guardar en Supabase.

import { hoyStr } from "@/lib/fecha";

export type FacturaHeaderData = {
  Id_TipoComprobante: string; // "1","2","3" — vacío si no se eligió
  PuntoVenta: string;
  Numero: string;
  Fecha: string;
  Id_EntidadLegal: string;
  Id_CondicionPago: string;   // "1"=Contado, "2"=Cuenta corriente
  FechaVencimiento: string;
};

export type ItemGastoForm = {
  _key: string;
  Descripcion: string;
  Id_CategoriaGasto: string;
  Cantidad: string;
  PrecioUnitario: string;
  TasaIva: string;
};

export type ItemHaciendaForm = {
  _key: string;
  Id_Campo: string;
  Id_CategoriaHacienda: string;
  Cabezas: string;
  Modalidad: "1" | "2"; // "1"=Por kg, "2"=Por cabeza
  KgPromedio: string;
  PrecioPorKg: string;
  PrecioPorCabeza: string;
  TasaIva: string;
};

export type Totales = {
  Subtotal: number;
  Iva10_5: number;
  Iva21: number;
  Total: number;
};

// Valores iniciales
export const EMPTY_HEADER: FacturaHeaderData = {
  Id_TipoComprobante: "",
  PuntoVenta: "",
  Numero: "",
  Fecha: hoyStr(),
  Id_EntidadLegal: "",
  Id_CondicionPago: "1", // Contado por defecto
  FechaVencimiento: "",
};

export const EMPTY_ITEM_GASTO: Omit<ItemGastoForm, "_key"> = {
  Descripcion: "",
  Id_CategoriaGasto: "",
  Cantidad: "1",
  PrecioUnitario: "",
  TasaIva: "21",
};

export const EMPTY_ITEM_HACIENDA: Omit<ItemHaciendaForm, "_key"> = {
  Id_Campo: "",
  Id_CategoriaHacienda: "",
  Cabezas: "",
  Modalidad: "1", // Por kg por defecto
  KgPromedio: "",
  PrecioPorKg: "",
  PrecioPorCabeza: "",
  TasaIva: "10.5",
};

// Cálculo de subtotales
export function calcItemGastoSubtotal(item: ItemGastoForm): number {
  return (parseFloat(item.Cantidad) || 0) * (parseFloat(item.PrecioUnitario) || 0);
}

export function calcItemHaciendaSubtotal(item: ItemHaciendaForm): number {
  const cabezas = parseInt(item.Cabezas) || 0;
  if (item.Modalidad === "1") { // Por kg
    return cabezas * (parseFloat(item.KgPromedio) || 0) * (parseFloat(item.PrecioPorKg) || 0);
  }
  return cabezas * (parseFloat(item.PrecioPorCabeza) || 0);
}

function acumularIva(acc: { Iva10_5: number; Iva21: number }, subtotal: number, tasa: number) {
  if (tasa === 10.5) acc.Iva10_5 += subtotal * 0.105;
  else if (tasa === 21) acc.Iva21 += subtotal * 0.21;
}

export function calcTotalesGasto(items: ItemGastoForm[]): Totales {
  const acc = { Subtotal: 0, Iva10_5: 0, Iva21: 0 };
  for (const item of items) {
    const sub = calcItemGastoSubtotal(item);
    acc.Subtotal += sub;
    acumularIva(acc, sub, parseFloat(item.TasaIva) || 0);
  }
  return { ...acc, Total: acc.Subtotal + acc.Iva10_5 + acc.Iva21 };
}

export function calcTotalesHacienda(items: ItemHaciendaForm[]): Totales {
  const acc = { Subtotal: 0, Iva10_5: 0, Iva21: 0 };
  for (const item of items) {
    const sub = calcItemHaciendaSubtotal(item);
    acc.Subtotal += sub;
    acumularIva(acc, sub, parseFloat(item.TasaIva) || 0);
  }
  return { ...acc, Total: acc.Subtotal + acc.Iva10_5 + acc.Iva21 };
}

export const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);
