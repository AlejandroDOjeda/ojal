// Utilidades de formato para inputs de la app

/**
 * Muestra un CUIT/CUIL con el formato XX-XXXXXXXX-X para visualización.
 * El dato en DB se guarda como 11 dígitos sin guiones.
 * Esta función se usa en el `value` del input para mostrar la máscara.
 */
export function formatCuit(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10)}`;
}

/**
 * Extrae solo los dígitos de un CUIT/CUIL para guardar en DB.
 * Se usa en el `onChange` del input.
 */
export function cuitToDigits(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 11);
}

/**
 * Aplica la máscara del RENSPA argentino: XX.XXX.X.XXXXX/XX
 * 13 dígitos en total. Se usa en el `value` del input.
 */
export function formatRenspa(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 13);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 6) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 11) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 6)}.${d.slice(6, 11)}/${d.slice(11)}`;
}

/**
 * Extrae solo los dígitos del RENSPA para guardar en DB.
 */
export function renspaToDigits(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 13);
}
