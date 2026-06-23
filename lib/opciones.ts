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
  { value: 1, label: "Factura A"       },
  { value: 2, label: "Factura B"       },
  { value: 3, label: "Factura C"       },
  { value: 4, label: "Liq. de Hacienda" },
] as const;

export const TIPO_COMPROBANTE_ITEMS = toSelectItems(TIPO_COMPROBANTE_OPTIONS);

// ─── CondicionPago ────────────────────────────────────────────────────────────

export const CONDICION_PAGO_OPTIONS = [
  { value: 1, label: "Contado"          },
  { value: 2, label: "Cuenta corriente" },
] as const;

export const CONDICION_PAGO_ITEMS = toSelectItems(CONDICION_PAGO_OPTIONS);

// ─── EstadoFactura ────────────────────────────────────────────────────────────

export const ESTADO_FACTURA_OPTIONS = [
  { value: 1, label: "Borrador"   },
  { value: 2, label: "Confirmada" },
  { value: 3, label: "Pagada"     },
  { value: 4, label: "Cobrada"    },
  { value: 5, label: "Anulada"    },
] as const;

export const ESTADO_FACTURA_ITEMS = toSelectItems(ESTADO_FACTURA_OPTIONS);

// ─── TipoOperacion (constantes, no dropdown) ─────────────────────────────────

export const TIPO_OPERACION = { COMPRA: 1, VENTA: 2 } as const;

// ─── TasaIva ─────────────────────────────────────────────────────────────────

export const TASA_IVA_OPTIONS = [
  { value: 0,    label: "0%"    },
  { value: 10.5, label: "10.5%" },
  { value: 21,   label: "21%"   },
] as const;

export const TASA_IVA_ITEMS = toSelectItems(TASA_IVA_OPTIONS);

// ─── ModalidadPrecio (solo UI, no se almacena en DB) ─────────────────────────

export const MODALIDAD_PRECIO_OPTIONS = [
  { value: 1, label: "Por kg"     },
  { value: 2, label: "Por cabeza" },
] as const;

export const MODALIDAD_PRECIO_ITEMS = toSelectItems(MODALIDAD_PRECIO_OPTIONS);
