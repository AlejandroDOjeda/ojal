// Utilidades de fecha calendario local (sin hora), formato YYYY-MM-DD.
//
// No usar toISOString() para esto: convierte a UTC, y en husos horarios
// negativos (ej. Argentina, UTC-3) puede devolver el día siguiente según
// la hora del día en que se ejecute.

export function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function hoyStr(): string {
  return toDateStr(new Date());
}
