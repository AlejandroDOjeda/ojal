-- Datos iniciales de las tablas de referencia.
-- IDs asignados por el autoincremental en el orden de inserción.
-- Estos valores están hardcodeados en el frontend (lib/opciones.ts).

insert into public."TipoPersona" ("Nombre") values
  ('Persona Física'),    -- 1
  ('Persona Jurídica');  -- 2

insert into public."CondicionIva" ("Nombre") values
  ('Responsable Inscripto'),  -- 1
  ('Monotributo'),            -- 2
  ('Exento'),                 -- 3
  ('Consumidor Final');       -- 4

insert into public."TipoOperacion" ("Nombre") values
  ('Compra'),  -- 1
  ('Venta');   -- 2

insert into public."TipoComprobante" ("Nombre") values
  ('Factura A'),         -- 1
  ('Factura B'),         -- 2
  ('Factura C'),         -- 3
  ('Liq. de Hacienda'); -- 4

insert into public."CondicionPago" ("Nombre") values
  ('Contado'),           -- 1
  ('Cuenta corriente');  -- 2

insert into public."EstadoFactura" ("Nombre") values
  ('Borrador'),    -- 1
  ('Confirmada'),  -- 2
  ('Pagada'),      -- 3
  ('Cobrada'),     -- 4
  ('Anulada');     -- 5
