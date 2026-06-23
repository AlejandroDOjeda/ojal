-- Factura: cabecera del comprobante. Usa FKs a todas las tablas de referencia.
-- ItemHacienda / ItemGasto: líneas de cada factura.

create table public."Factura" (
  "Id_Factura"         integer       generated always as identity primary key,
  "Id_TipoOperacion"   integer       not null references public."TipoOperacion"("Id_TipoOperacion"),
  "Id_TipoComprobante" integer       references public."TipoComprobante"("Id_TipoComprobante"),
  "PuntoVenta"         char(4),
  "Numero"             char(8),
  "Fecha"              date          not null,
  "Id_EntidadLegal"    integer       not null references public."EntidadLegal"("Id_EntidadLegal"),
  "Id_CondicionPago"   integer       not null default 1 references public."CondicionPago"("Id_CondicionPago"),
  "FechaVencimiento"   date,
  "Id_EstadoFactura"   integer       not null default 1 references public."EstadoFactura"("Id_EstadoFactura"),
  "Subtotal"           numeric(15,2) not null default 0,
  "Iva10_5"            numeric(15,2) not null default 0,
  "Iva21"              numeric(15,2) not null default 0,
  "Total"              numeric(15,2) not null default 0,
  "Observaciones"      text,
  "CreatedAt"          timestamptz   not null default now(),
  "UpdatedAt"          timestamptz   not null default now()
);
alter table public."Factura" enable row level security;
create policy "Autenticados gestionan Factura"
  on public."Factura" for all to authenticated using (true) with check (true);

create trigger trg_factura_updated_at
  before update on public."Factura"
  for each row execute procedure public.set_updated_at();

create index idx_factura_fecha         on public."Factura" ("Fecha" desc);
create index idx_factura_estado        on public."Factura" ("Id_EstadoFactura");
create index idx_factura_entidad_legal on public."Factura" ("Id_EntidadLegal");


-- Modalidad de precio: por peso (KgPromedio × PrecioPorKg) o por cabeza.
-- El constraint PrecioValido fuerza que se use exactamente una modalidad.
create table public."ItemHacienda" (
  "Id_ItemHacienda"      integer       generated always as identity primary key,
  "Id_Factura"           integer       not null references public."Factura"("Id_Factura") on delete cascade,
  "Id_CategoriaHacienda" integer       not null references public."CategoriaHacienda"("Id_CategoriaHacienda"),
  "Cabezas"              integer       not null check ("Cabezas" > 0),
  "KgPromedio"           numeric(8,2),
  "PrecioPorKg"          numeric(10,4),
  "PrecioPorCabeza"      numeric(12,2),
  "TasaIva"              numeric(5,2)  not null default 10.5,
  "Subtotal"             numeric(15,2) not null,
  "CreatedAt"            timestamptz   not null default now(),

  constraint "PrecioValido" check (
    ("KgPromedio" is not null and "PrecioPorKg"    is not null and "PrecioPorCabeza" is null)
    or
    ("KgPromedio" is null     and "PrecioPorKg"    is null     and "PrecioPorCabeza" is not null)
  )
);
alter table public."ItemHacienda" enable row level security;
create policy "Autenticados gestionan ItemHacienda"
  on public."ItemHacienda" for all to authenticated using (true) with check (true);

create index idx_item_hacienda_factura   on public."ItemHacienda" ("Id_Factura");
create index idx_item_hacienda_categoria on public."ItemHacienda" ("Id_CategoriaHacienda");


-- Id_CategoriaGasto nullable: el ítem puede quedar sin categoría.
-- Subtotal = Cantidad × PrecioUnitario (sin IVA).
create table public."ItemGasto" (
  "Id_ItemGasto"      integer       generated always as identity primary key,
  "Id_Factura"        integer       not null references public."Factura"("Id_Factura") on delete cascade,
  "Descripcion"       text          not null,
  "Id_CategoriaGasto" integer       references public."CategoriaGasto"("Id_CategoriaGasto"),
  "Cantidad"          numeric(10,3) not null default 1 check ("Cantidad" > 0),
  "PrecioUnitario"    numeric(12,2) not null check ("PrecioUnitario" >= 0),
  "TasaIva"           numeric(5,2)  not null default 21.0,
  "Subtotal"          numeric(15,2) not null,
  "CreatedAt"         timestamptz   not null default now()
);
alter table public."ItemGasto" enable row level security;
create policy "Autenticados gestionan ItemGasto"
  on public."ItemGasto" for all to authenticated using (true) with check (true);

create index idx_item_gasto_factura   on public."ItemGasto" ("Id_Factura");
create index idx_item_gasto_categoria on public."ItemGasto" ("Id_CategoriaGasto");
