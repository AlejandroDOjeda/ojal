-- Tabla Campo: establecimientos ganaderos por usuario.
-- Cada usuario puede gestionar múltiples campos con su propio rodeo y facturas.

create table public."Campo" (
  "Id_Campo"   integer      generated always as identity primary key,
  "Id_Profile" uuid         not null references public."Profile"("Id_Profile") on delete cascade,
  "Nombre"     text         not null,
  "Renspa"     text,
  "Ubicacion"  text,
  "Superficie" numeric(10,2),
  "CreatedAt"  timestamptz  not null default now(),
  "UpdatedAt"  timestamptz  not null default now()
);
alter table public."Campo" enable row level security;
create policy "Propietario gestiona Campo"
  on public."Campo" for all to authenticated
  using ("Id_Profile" = auth.uid())
  with check ("Id_Profile" = auth.uid());

create trigger trg_campo_updated_at
  before update on public."Campo"
  for each row execute procedure public.set_updated_at();

create index idx_campo_profile on public."Campo" ("Id_Profile");


-- Agregar Id_Campo (nullable primero para poder migrar datos existentes)

alter table public."Rodeo"
  add column "Id_Campo" integer references public."Campo"("Id_Campo") on delete cascade;

alter table public."Factura"
  add column "Id_Campo" integer references public."Campo"("Id_Campo");

alter table public."MovimientoRodeo"
  add column "Id_Campo" integer references public."Campo"("Id_Campo");


-- Crear Campo Principal para cada Profile existente
insert into public."Campo" ("Id_Profile", "Nombre")
select "Id_Profile", 'Campo Principal'
from public."Profile";

-- Asignar todas las filas existentes al campo del único usuario
-- (funciona para instalaciones con 0 o 1 perfil)
update public."Rodeo"
set "Id_Campo" = (select "Id_Campo" from public."Campo" order by "Id_Campo" limit 1)
where "Id_Campo" is null;

update public."Factura"
set "Id_Campo" = (select "Id_Campo" from public."Campo" order by "Id_Campo" limit 1)
where "Id_Campo" is null;

update public."MovimientoRodeo"
set "Id_Campo" = (select "Id_Campo" from public."Campo" order by "Id_Campo" limit 1)
where "Id_Campo" is null;

-- Rodeo sin campo asignado significa que no hay ningún usuario todavía.
-- Esas filas corresponden al seed global anterior, que ya no aplica.
-- El nuevo seed ocurre por trigger al crear un Campo.
delete from public."Rodeo" where "Id_Campo" is null;


-- Hacer NOT NULL ahora que todos los datos están asignados
alter table public."Rodeo"          alter column "Id_Campo" set not null;
alter table public."Factura"        alter column "Id_Campo" set not null;
alter table public."MovimientoRodeo" alter column "Id_Campo" set not null;


-- Reemplazar el UNIQUE de Rodeo: era por categoría global, ahora es por (campo, categoría)
alter table public."Rodeo" drop constraint "Rodeo_Id_CategoriaHacienda_key";
alter table public."Rodeo"
  add constraint "Rodeo_Id_Campo_Id_CategoriaHacienda_key"
  unique ("Id_Campo", "Id_CategoriaHacienda");


-- Índices de FK
create index idx_rodeo_campo      on public."Rodeo"          ("Id_Campo");
create index idx_factura_campo    on public."Factura"         ("Id_Campo");
create index idx_movimiento_campo on public."MovimientoRodeo" ("Id_Campo");
