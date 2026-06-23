-- Tablas de referencia (lookup tables).
-- IDs estables y conocidos en el código. Solo lectura desde la app.
-- Los datos se insertan en 20260623000004_seed_tablas_referencia.sql

create table public."TipoPersona" (
  "Id_TipoPersona" integer generated always as identity primary key,
  "Nombre"         text    not null unique
);
alter table public."TipoPersona" enable row level security;
create policy "Autenticados leen TipoPersona"
  on public."TipoPersona" for select to authenticated using (true);


create table public."CondicionIva" (
  "Id_CondicionIva" integer generated always as identity primary key,
  "Nombre"          text    not null unique
);
alter table public."CondicionIva" enable row level security;
create policy "Autenticados leen CondicionIva"
  on public."CondicionIva" for select to authenticated using (true);


create table public."TipoOperacion" (
  "Id_TipoOperacion" integer generated always as identity primary key,
  "Nombre"           text    not null unique
);
alter table public."TipoOperacion" enable row level security;
create policy "Autenticados leen TipoOperacion"
  on public."TipoOperacion" for select to authenticated using (true);


create table public."TipoComprobante" (
  "Id_TipoComprobante" integer generated always as identity primary key,
  "Nombre"             text    not null unique
);
alter table public."TipoComprobante" enable row level security;
create policy "Autenticados leen TipoComprobante"
  on public."TipoComprobante" for select to authenticated using (true);


create table public."CondicionPago" (
  "Id_CondicionPago" integer generated always as identity primary key,
  "Nombre"           text    not null unique
);
alter table public."CondicionPago" enable row level security;
create policy "Autenticados leen CondicionPago"
  on public."CondicionPago" for select to authenticated using (true);


create table public."EstadoFactura" (
  "Id_EstadoFactura" integer generated always as identity primary key,
  "Nombre"           text    not null unique
);
alter table public."EstadoFactura" enable row level security;
create policy "Autenticados leen EstadoFactura"
  on public."EstadoFactura" for select to authenticated using (true);
