// Validaciones para campos del sistema

/**
 * Valida un CUIT/CUIL argentino verificando:
 * - Exactamente 11 dígitos
 * - Prefijo válido (20, 23, 24, 27, 30, 33, 34)
 * - Dígito verificador correcto (módulo 11)
 */
export function validarCuit(cuit: string): boolean {
  const digits = cuit.replace(/\D/g, "");
  if (digits.length !== 11) return false;

  const prefijosValidos = ["20", "23", "24", "27", "30", "33", "34"];
  if (!prefijosValidos.includes(digits.slice(0, 2))) return false;

  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const suma = pesos.reduce((acc, p, i) => acc + p * parseInt(digits[i]), 0);
  let verificador = 11 - (suma % 11);
  if (verificador === 11) verificador = 0;
  if (verificador === 10) return false;

  return verificador === parseInt(digits[10]);
}

/**
 * Valida formato de email básico.
 */
export function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Valida un número de teléfono argentino.
 * Extrae solo los dígitos y verifica que tenga entre 8 y 12.
 */
export function validarTelefono(telefono: string): boolean {
  const digits = telefono.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 12;
}

/**
 * Filtra caracteres no permitidos en un teléfono.
 * Solo acepta: dígitos, espacios, guiones, paréntesis y el signo +
 */
export function formatTelefono(raw: string): string {
  return raw.replace(/[^\d\s\-\(\)\+]/g, "");
}

/**
 * Valida que el RENSPA tenga exactamente 13 dígitos (XX.XXX.X.XXXXX/XX).
 */
export function validarRenspa(renspa: string): boolean {
  return renspa.replace(/\D/g, "").length === 13;
}
