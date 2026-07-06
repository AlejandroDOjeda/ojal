// Tipos y utilidades del módulo de facturas.
// Los campos de referencia (Id_TipoComprobante, Id_CondicionPago) se guardan
// como strings en el estado del formulario para compatibilidad con Select,
// y se parsean a integer al guardar en Supabase.

export type FacturaHeaderData = {
  Id_TipoComprobante: string; // "1","2","3" — vacío si no se eligió
  PuntoVenta: string;
  Numero: string;
  Fecha: string;
  Id_EntidadLegal: string;
  Id_CondicionPago: string;   // "1"=Contado, "2"=Cuenta corriente
  FechaVencimiento: string;
  NoGravado: string;          // monto no gravado (percepciones, etc.) — "" = sin monto
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
  NoGravado: number;
  Total: number;
};

// Valores iniciales
export const EMPTY_HEADER: FacturaHeaderData = {
  Id_TipoComprobante: "",
  PuntoVenta: "00001",
  Numero: "",
  Fecha: new Date().toISOString().split("T")[0],
  Id_EntidadLegal: "",
  Id_CondicionPago: "1", // Contado por defecto
  FechaVencimiento: "",
  NoGravado: "",
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

export function calcTotalesGasto(items: ItemGastoForm[], noGravado = 0): Totales {
  const acc = { Subtotal: 0, Iva10_5: 0, Iva21: 0 };
  for (const item of items) {
    const sub = calcItemGastoSubtotal(item);
    acc.Subtotal += sub;
    acumularIva(acc, sub, parseFloat(item.TasaIva) || 0);
  }
  return { ...acc, NoGravado: noGravado, Total: acc.Subtotal + acc.Iva10_5 + acc.Iva21 + noGravado };
}

export function calcTotalesHacienda(items: ItemHaciendaForm[], noGravado = 0): Totales {
  const acc = { Subtotal: 0, Iva10_5: 0, Iva21: 0 };
  for (const item of items) {
    const sub = calcItemHaciendaSubtotal(item);
    acc.Subtotal += sub;
    acumularIva(acc, sub, parseFloat(item.TasaIva) || 0);
  }
  return { ...acc, NoGravado: noGravado, Total: acc.Subtotal + acc.Iva10_5 + acc.Iva21 + noGravado };
}

export const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

// Ítem de una factura de compra: puede ser un gasto genérico (ItemGasto) o
// una compra de hacienda (ItemHacienda, la misma tabla que usan las ventas —
// ya trae Campo, CategoriaHacienda y el trigger que suma al Rodeo).
export type ItemCompraGasto    = { _key: string; _tipo: "gasto" }    & Omit<ItemGastoForm, "_key">;
export type ItemCompraHacienda = { _key: string; _tipo: "hacienda" } & Omit<ItemHaciendaForm, "_key">;
export type ItemCompraForm = ItemCompraGasto | ItemCompraHacienda;

export const emptyItemCompraGasto = (key: string): ItemCompraGasto =>
  ({ _key: key, _tipo: "gasto", ...EMPTY_ITEM_GASTO });

export const emptyItemCompraHacienda = (key: string, campoActivoId: number | null): ItemCompraHacienda =>
  ({ _key: key, _tipo: "hacienda", ...EMPTY_ITEM_HACIENDA, Id_Campo: campoActivoId ? String(campoActivoId) : "" });

export function calcItemCompraSubtotal(item: ItemCompraForm): number {
  return item._tipo === "gasto" ? calcItemGastoSubtotal(item) : calcItemHaciendaSubtotal(item);
}

export function calcTotalesCompra(items: ItemCompraForm[], noGravado = 0): Totales {
  const acc = { Subtotal: 0, Iva10_5: 0, Iva21: 0 };
  for (const item of items) {
    const sub = calcItemCompraSubtotal(item);
    acc.Subtotal += sub;
    acumularIva(acc, sub, parseFloat(item.TasaIva) || 0);
  }
  return { ...acc, NoGravado: noGravado, Total: acc.Subtotal + acc.Iva10_5 + acc.Iva21 + noGravado };
}
