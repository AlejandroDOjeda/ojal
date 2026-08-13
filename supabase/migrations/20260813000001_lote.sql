-- Tabla Lote: subdivisión de un Campo (potreros). Un Campo tiene múltiples
-- Lotes; el Rodeo, el historial de movimientos y las líneas de compra/venta
-- de hacienda pasan a escopearse por Lote en vez de por Campo directamente
-- (Campo se deriva vía Lote.Id_Campo). Mismo patrón de normalización que se
-- usó el 2026-07-05 para bajar Id_Campo de Factura a ItemHacienda.

create table public."Lote" (
  "Id_Lote"    integer      generated always as identity primary key,
  "Id_Campo"   integer      not null references public."Campo"("Id_Campo") on delete cascade,
  "Nombre"     text         not null,
  "CreatedAt"  timestamptz  not null default now(),
  "UpdatedAt"  timestamptz  not null default now()
);
alter table public."Lote" enable row level security;

-- Blanket policy igual a Rodeo/MovimientoRodeo/ItemHacienda (no la
-- owner-scoped de Campo) — Lote es un dato operativo de esas tres tablas,
-- no un límite de propiedad como Campo.
create policy "Autenticados gestionan Lote"
  on public."Lote" for all to authenticated using (true) with check (true);

create trigger trg_lote_updated_at
  before update on public."Lote"
  for each row execute procedure public.set_updated_at();

create index idx_lote_campo on public."Lote" ("Id_Campo");


-- Agregar Id_Lote (nullable primero para poder migrar datos existentes)

alter table public."Rodeo"
  add column "Id_Lote" integer references public."Lote"("Id_Lote") on delete cascade;

alter table public."MovimientoRodeo"
  add column "Id_Lote" integer references public."Lote"("Id_Lote");

alter table public."ItemHacienda"
  add column "Id_Lote" integer references public."Lote"("Id_Lote");


-- Un Lote "Lote 1" por cada Campo existente, para no dejar nada huérfano.
insert into public."Lote" ("Id_Campo", "Nombre")
select "Id_Campo", 'Lote 1'
from public."Campo";

-- Reasignar todo lo existente al Lote por defecto de su Campo. Como el
-- backfill anterior crea exactamente un Lote por Campo, el join es 1:1.
update public."Rodeo" r
set    "Id_Lote" = l."Id_Lote"
from   public."Lote" l
where  l."Id_Campo" = r."Id_Campo"
  and  r."Id_Lote" is null;

update public."MovimientoRodeo" m
set    "Id_Lote" = l."Id_Lote"
from   public."Lote" l
where  l."Id_Campo" = m."Id_Campo"
  and  m."Id_Lote" is null;

update public."ItemHacienda" i
set    "Id_Lote" = l."Id_Lote"
from   public."Lote" l
where  l."Id_Campo" = i."Id_Campo"
  and  i."Id_Lote" is null;


-- Hacer NOT NULL ahora que todos los datos están asignados
alter table public."Rodeo"          alter column "Id_Lote" set not null;
alter table public."MovimientoRodeo" alter column "Id_Lote" set not null;
alter table public."ItemHacienda"    alter column "Id_Lote" set not null;


-- Reemplazar el UNIQUE de Rodeo: era por (campo, categoría), ahora por (lote, categoría)
alter table public."Rodeo" drop constraint "Rodeo_Id_Campo_Id_CategoriaHacienda_key";
alter table public."Rodeo"
  add constraint "Rodeo_Id_Lote_Id_CategoriaHacienda_key"
  unique ("Id_Lote", "Id_CategoriaHacienda");


-- Índices de FK
create index idx_rodeo_lote           on public."Rodeo"          ("Id_Lote");
create index idx_movimiento_rodeo_lote on public."MovimientoRodeo" ("Id_Lote");
create index idx_item_hacienda_lote   on public."ItemHacienda"    ("Id_Lote");

-- Nota: Id_Campo se mantiene todavía en Rodeo/MovimientoRodeo/ItemHacienda.
-- Se borra recién en 20260813000003, después de reescribir en
-- 20260813000002 el trigger que hoy referencia esa columna — si se borrara
-- acá, el DROP no fallaría en el momento pero rompería silenciosamente el
-- próximo INSERT/DELETE de ItemHacienda.
