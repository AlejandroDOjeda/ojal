-- Tablas de categorías: compartidas, con ABM desde la app.
-- Los datos iniciales se insertan en 20260623000005_seed_categorias.sql

create table public."CategoriaHacienda" (
  "Id_CategoriaHacienda" integer      generated always as identity primary key,
  "Nombre"               text         not null unique,
  "Descripcion"          text,
  "TasaIva"              numeric(5,2) not null default 10.5,
  "Activa"               boolean      not null default true,
  "CreatedAt"            timestamptz  not null default now()
);
alter table public."CategoriaHacienda" enable row level security;
create policy "Autenticados gestionan CategoriaHacienda"
  on public."CategoriaHacienda" for all to authenticated using (true) with check (true);


create table public."CategoriaGasto" (
  "Id_CategoriaGasto"  integer      generated always as identity primary key,
  "Nombre"             text         not null unique,
  "Descripcion"        text,
  "TasaIvaHabitual"    numeric(5,2) not null default 21.0,
  "Activa"             boolean      not null default true,
  "CreatedAt"          timestamptz  not null default now()
);
alter table public."CategoriaGasto" enable row level security;
create policy "Autenticados gestionan CategoriaGasto"
  on public."CategoriaGasto" for all to authenticated using (true) with check (true);
