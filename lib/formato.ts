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
