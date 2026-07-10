-- La columna PuntoVenta se creó como char(4), pero el punto de venta de AFIP
-- siempre tiene 5 dígitos (ej. "00001"), que es el formato que usa toda la
-- app (placeholder, padStart y límite de dígitos). Se agranda a char(5).

alter table public."Factura"
  alter column "PuntoVenta" type char(5)
  using lpad(trim("PuntoVenta"), 5, '0');
