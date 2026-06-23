-- Datos iniciales de las categorías de hacienda y gasto.

insert into public."CategoriaHacienda" ("Nombre", "Descripcion", "TasaIva") values
  ('Ternero',       'Macho menor de 1 año',          10.5),
  ('Ternera',       'Hembra menor de 1 año',         10.5),
  ('Novillito',     'Macho de 1 a 2 años',           10.5),
  ('Novillo',       'Macho castrado de 2 a 4 años',  10.5),
  ('Vaquillona',    'Hembra de 1 a 3 años',          10.5),
  ('Vaca',          'Hembra adulta mayor de 3 años', 10.5),
  ('Vaca con cría', 'Vaca con ternero al pie',       10.5),
  ('Toro',          'Macho reproductor entero',      10.5),
  ('Buey',          'Macho castrado adulto',         10.5);

insert into public."CategoriaGasto" ("Nombre", "Descripcion", "TasaIvaHabitual") values
  ('Combustible',                'Gasoil, nafta y lubricantes',                       21.0),
  ('Veterinaria - Insumos',      'Medicamentos, vacunas y material veterinario',      21.0),
  ('Veterinaria - Servicios',    'Honorarios profesionales veterinarios',             21.0),
  ('Alimentación y Forrajes',    'Rollos, granos, suplementos, sales minerales',      10.5),
  ('Semillas y Agroquímicos',    'Semillas, herbicidas, insecticidas, fertilizantes', 10.5),
  ('Maquinaria y Repuestos',     'Equipos, repuestos, herramientas y accesorios',     21.0),
  ('Almacén / Ferretería',       'Gastos generales de almacén y ferretería',          21.0),
  ('Arrendamiento',              'Alquiler de campos y pasturas',                      0.0),
  ('Flete / Transporte',         'Transporte de hacienda e insumos',                  21.0),
  ('Gastos de Comercialización', 'Comisiones, guías de traslado, gastos de remate',   21.0),
  ('Personal / Jornales',        'Sueldos, jornales y cargas sociales',                0.0),
  ('Impuestos y Tasas',          'IIBB, inmobiliario rural, tasas municipales',        0.0),
  ('Servicios',                  'Electricidad, telefonía, internet, seguros',         21.0),
  ('Otros',                      'Gastos varios no categorizados',                    21.0);
