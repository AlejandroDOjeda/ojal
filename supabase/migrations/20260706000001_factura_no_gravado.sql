-- Algunas facturas incluyen montos no gravados (percepciones, impuestos
-- internos, etc.) que no forman parte del Subtotal ni de ningún IVA, pero sí
-- suman al Total. Se agrega como un monto único opcional a nivel factura
-- (no se desglosa por concepto).

alter table public."Factura"
  add column "NoGravado" numeric(15,2) not null default 0;
