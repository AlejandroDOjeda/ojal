-- Rodeo: stock actual de hacienda por categoría.
-- Una fila por categoría. Se actualiza al confirmar/anular facturas de hacienda.

create table public."Rodeo" (
  "Id_Rodeo"             integer      generated always as identity primary key,
  "Id_CategoriaHacienda" integer      not null unique references public."CategoriaHacienda"("Id_CategoriaHacienda"),
  "Cabezas"              integer      not null default 0 check ("Cabezas" >= 0),
  "CreatedAt"            timestamptz  not null default now(),
  "UpdatedAt"            timestamptz  not null default now()
);
alter table public."Rodeo" enable row level security;
create policy "Autenticados gestionan Rodeo"
  on public."Rodeo" for all to authenticated using (true) with check (true);

create trigger trg_rodeo_updated_at
  before update on public."Rodeo"
  for each row execute procedure public.set_updated_at();


-- MovimientoRodeo: historial de cada cambio en el stock.
-- TipoMovimiento: compra | venta | nacimiento | muerte | ajuste_manual
-- Cabezas: cantidad involucrada (siempre positivo; la dirección la determina el tipo).
-- Id_Factura: referencia a la factura origen cuando corresponde (compra/venta).

create table public."MovimientoRodeo" (
  "Id_MovimientoRodeo"   integer      generated always as identity primary key,
  "TipoMovimiento"       text         not null check ("TipoMovimiento" in ('compra','venta','nacimiento','muerte','ajuste_manual')),
  "Id_CategoriaHacienda" integer      not null references public."CategoriaHacienda"("Id_CategoriaHacienda"),
  "Cabezas"              integer      not null check ("Cabezas" > 0),
  "Fecha"                date         not null,
  "Id_Factura"           integer      references public."Factura"("Id_Factura"),
  "Observaciones"        text,
  "CreatedAt"            timestamptz  not null default now()
);
alter table public."MovimientoRodeo" enable row level security;
create policy "Autenticados gestionan MovimientoRodeo"
  on public."MovimientoRodeo" for all to authenticated using (true) with check (true);

create index idx_movimiento_rodeo_categoria on public."MovimientoRodeo" ("Id_CategoriaHacienda");
create index idx_movimiento_rodeo_fecha     on public."MovimientoRodeo" ("Fecha" desc);
create index idx_movimiento_rodeo_factura   on public."MovimientoRodeo" ("Id_Factura");
