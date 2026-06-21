-- =============================================================
-- 2102: categoria_hacienda
-- Categorías estándar del ganado vacuno argentino.
-- Tabla global (sin user_id): todos los usuarios las comparten.
-- Tasa de IVA: 10.5% para producción primaria (Resp. Inscripto).
-- =============================================================

create table if not exists public.categoria_hacienda (
  id          uuid         primary key default gen_random_uuid(),
  nombre      text         not null unique,
  descripcion text,
  tasa_iva    numeric(5,2) not null default 10.5,
  activa      boolean      not null default true,
  created_at  timestamptz  not null default now()
);

alter table public.categoria_hacienda enable row level security;

create policy "Usuarios autenticados pueden ver categoria de hacienda"
  on public.categoria_hacienda for select
  to authenticated
  using (activa = true);

-- ---------------------------------------------------------------
-- Datos iniciales: categorías estándar del mercado ganadero AR
-- ---------------------------------------------------------------
insert into public.categoria_hacienda (nombre, descripcion, tasa_iva) values
  ('Ternero',       'Macho menor de 1 año',                10.5),
  ('Ternera',       'Hembra menor de 1 año',               10.5),
  ('Novillito',     'Macho de 1 a 2 años',                 10.5),
  ('Novillo',       'Macho castrado de 2 a 4 años',        10.5),
  ('Vaquillona',    'Hembra de 1 a 3 años',                10.5),
  ('Vaca',          'Hembra adulta mayor de 3 años',       10.5),
  ('Vaca con cría', 'Vaca con ternero al pie',             10.5),
  ('Toro',          'Macho reproductor entero',            10.5),
  ('Buey',          'Macho castrado adulto',               10.5);
