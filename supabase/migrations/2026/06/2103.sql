-- =============================================================
-- 2103: categoria_gasto
-- Categorías de gastos de compra típicos de una empresa ganadera.
-- Tabla global (sin user_id): todos los usuarios las comparten.
-- La tasa_iva_habitual es orientativa; cada ítem puede sobrescribirla.
-- =============================================================

create table if not exists public.categoria_gasto (
  id                uuid         primary key default gen_random_uuid(),
  nombre            text         not null unique,
  descripcion       text,
  tasa_iva_habitual numeric(5,2) not null default 21.0,
  activa            boolean      not null default true,
  created_at        timestamptz  not null default now()
);

alter table public.categoria_gasto enable row level security;

create policy "Usuarios autenticados pueden ver categoria de gasto"
  on public.categoria_gasto for select
  to authenticated
  using (activa = true);

-- ---------------------------------------------------------------
-- Datos iniciales
-- Notas sobre IVA:
--   21%  → regla general para servicios y bienes
--   10.5% → algunos insumos agropecuarios (semillas, fertilizantes)
--   0%   → arrendamientos, sueldos/jornales, impuestos y tasas
-- ---------------------------------------------------------------
insert into public.categoria_gasto (nombre, descripcion, tasa_iva_habitual) values
  ('Combustible',               'Gasoil, nafta y lubricantes',                       21.0),
  ('Veterinaria - Insumos',     'Medicamentos, vacunas y material veterinario',      21.0),
  ('Veterinaria - Servicios',   'Honorarios profesionales veterinarios',             21.0),
  ('Alimentación y Forrajes',   'Rollos, granos, suplementos, sales minerales',      10.5),
  ('Semillas y Agroquímicos',   'Semillas, herbicidas, insecticidas, fertilizantes', 10.5),
  ('Maquinaria y Repuestos',    'Equipos, repuestos, herramientas y accesorios',     21.0),
  ('Almacén / Ferretería',      'Gastos generales de almacén y ferretería',          21.0),
  ('Arrendamiento',             'Alquiler de campos y pasturas',                      0.0),
  ('Flete / Transporte',        'Transporte de hacienda e insumos',                  21.0),
  ('Gastos de Comercialización','Comisiones, guías de traslado, gastos de remate',   21.0),
  ('Personal / Jornales',       'Sueldos, jornales y cargas sociales',                0.0),
  ('Impuestos y Tasas',         'IIBB, inmobiliario rural, tasas municipales',        0.0),
  ('Servicios',                 'Electricidad, telefonía, internet, seguros',         21.0),
  ('Otros',                     'Gastos varios no categorizados',                    21.0);
