// Opciones de las tablas de referencia.
// Los `value` coinciden exactamente con los IDs en la base de datos (integer).
// Son estables: seeded una sola vez, sin ABM desde la app.

type Option = { value: number; label: string };

export const toSelectItems = (opts: readonly Option[]): Record<string, string> =>
  Object.fromEntries(opts.map(({ value, label }) => [String(value), label]));

// ─── TipoPersona ─────────────────────────────────────────────────────────────

export const TIPO_PERSONA_OPTIONS = [
  { value: 1, label: "Persona Física"   },
  { value: 2, label: "Persona Jurídica" },
] as const;

export const TIPO_PERSONA_ITEMS = toSelectItems(TIPO_PERSONA_OPTIONS);

// ─── CondicionIva ─────────────────────────────────────────────────────────────

export const CONDICION_IVA_OPTIONS = [
  { value: 1, label: "Responsable Inscripto" },
  { value: 2, label: "Monotributo"           },
  { value: 3, label: "Exento"                },
  { value: 4, label: "Consumidor Final"      },
] as const;

export const CONDICION_IVA_ITEMS = toSelectItems(CONDICION_IVA_OPTIONS);

// ─── TipoComprobante ─────────────────────────────────────────────────────────

export const TIPO_COMPROBANTE_OPTIONS = [
  { value: 1, label: "Factura A"        },
  { value: 2, label: "Factura B"        },
  { value: 3, label: "Factura C"        },
  { value: 4, label: "Liq. de Hacienda" },
  { value: 5, label: "Nota de Crédito"  },
  { value: 6, label: "Nota de Débito"   },
] as const;

export const TIPO_COMPROBANTE_ITEMS = toSelectItems(TIPO_COMPROBANTE_OPTIONS);

// Notas de Crédito/Débito: corrigen una factura ya cargada. No tienen letra
// propia (A/B/C) — heredan la de la factura que corrigen (Id_FacturaAsociada),
// inferida en pantalla con `letraComprobante`. Una Nota de Crédito resta del
// período (reduce IVA débito/crédito y resultado), una Nota de Débito suma —
// igual que una Factura común.
export const NOTA_CREDITO_ID = 5;
export const NOTA_DEBITO_ID = 6;

export const esNotaCredito = (idTipoComprobante: number | null): boolean =>
  idTipoComprobante === NOTA_CREDITO_ID;

export const esNotaDebito = (idTipoComprobante: number | null): boolean =>
  idTipoComprobante === NOTA_DEBITO_ID;

export const esNotaCreditoDebito = (idTipoComprobante: number | null): boolean =>
  esNotaCredito(idTipoComprobante) || esNotaDebito(idTipoComprobante);

// Signo a aplicar sobre los montos de una factura al acumular totales
// (posición IVA, resultado del ejercicio, listado de facturas).
export const signoComprobante = (idTipoComprobante: number | null): 1 | -1 =>
  esNotaCredito(idTipoComprobante) ? -1 : 1;

// Letra (A/B/C) de una Factura — usada para armar el label de una Nota de
// Crédito/Débito, que no tiene letra propia: "Nota de Crédito A" toma la
// letra de la factura asociada, no de sí misma.
const LETRA_POR_FACTURA: Record<number, string> = { 1: "A", 2: "B", 3: "C" };

// Label a mostrar para un comprobante. `idTipoComprobanteAsociada` es el
// Id_TipoComprobante de la factura asociada (solo aplica si `idTipoComprobante`
// es una Nota de Crédito/Débito); se ignora en cualquier otro caso.
export const labelComprobante = (idTipoComprobante: number | null, idTipoComprobanteAsociada?: number | null): string => {
  if (idTipoComprobante === null) return "";
  const base = TIPO_COMPROBANTE_ITEMS[String(idTipoComprobante)] ?? "";
  if (!esNotaCreditoDebito(idTipoComprobante)) return base;
  const letra = idTipoComprobanteAsociada != null ? LETRA_POR_FACTURA[idTipoComprobanteAsociada] : undefined;
  return letra ? `${base} ${letra}` : base;
};

// ─── CondicionPago ────────────────────────────────────────────────────────────

export const CONDICION_PAGO_OPTIONS = [
  { value: 1, label: "Contado"          },
  { value: 2, label: "Cuenta corriente" },
] as const;

export const CONDICION_PAGO_ITEMS = toSelectItems(CONDICION_PAGO_OPTIONS);

// ─── TipoOperacion (constantes, no dropdown) ─────────────────────────────────

export const TIPO_OPERACION = { COMPRA: 1, VENTA: 2 } as const;

// ─── TasaIva ─────────────────────────────────────────────────────────────────

export const TASA_IVA_OPTIONS = [
  { value: 0,    label: "0%"    },
  { value: 10.5, label: "10.5%" },
  { value: 21,   label: "21%"   },
  { value: 27,   label: "27%"   },
] as const;

export const TASA_IVA_ITEMS = toSelectItems(TASA_IVA_OPTIONS);

// ─── ModalidadPrecio (solo UI, no se almacena en DB) ─────────────────────────

export const MODALIDAD_PRECIO_OPTIONS = [
  { value: 1, label: "Por kg"     },
  { value: 2, label: "Por cabeza" },
] as const;

export const MODALIDAD_PRECIO_ITEMS = toSelectItems(MODALIDAD_PRECIO_OPTIONS);

// ─── TipoMovimiento (MovimientoRodeo) ────────────────────────────────────────

export const TIPO_MOVIMIENTO_LABELS: Record<string, string> = {
  compra: "Compra",
  venta: "Venta",
  nacimiento: "Nacimiento",
  muerte: "Muerte",
  ajuste_manual: "Ajuste manual",
  traslado: "Traslado",
};

// Signo a aplicar sobre Cabezas al mostrar el historial de movimientos.
// compra/nacimiento suman al rodeo, venta/muerte restan. ajuste_manual y
// traslado no tienen signo fijo: dependen de Sentido (columna agregada
// 2026-07-31, reutilizada por traslado desde 2026-08-13 — cada traslado
// genera dos filas de MovimientoRodeo, una por lote, con Sentido opuesto).
// Los ajuste_manual cargados antes de esa fecha no tienen Sentido y se
// muestran neutros (0) porque no hay forma de saber su dirección real.
export const signoMovimientoRodeo = (
  tipoMovimiento: string,
  sentido: string | null
): 1 | -1 | 0 => {
  if (tipoMovimiento === "compra" || tipoMovimiento === "nacimiento") return 1;
  if (tipoMovimiento === "venta" || tipoMovimiento === "muerte") return -1;
  if (tipoMovimiento === "ajuste_manual" || tipoMovimiento === "traslado") {
    if (sentido === "incremento") return 1;
    if (sentido === "decremento") return -1;
  }
  return 0;
};
