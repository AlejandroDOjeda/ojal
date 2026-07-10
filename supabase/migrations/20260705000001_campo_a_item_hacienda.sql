-- Mueve el FK de Campo de Factura a ItemHacienda.
-- Motivo: una misma factura de venta puede incluir hacienda de distintos
-- campos (ej. liquidación de consignatario con animales de varios campos).
-- Las facturas de compra (combustible, veterinaria, etc.) no se asocian a
-- un campo específico, así que Factura deja de tener Id_Campo por completo.

-- 1) Agregar Id_Campo a ItemHacienda (nullable primero para poder backfillear)
alter table public."ItemHacienda"
  add column "Id_Campo" integer references public."Campo"("Id_Campo");

-- 2) Backfill: cada ítem hereda el campo que tenía su factura
update public."ItemHacienda" ih
set "Id_Campo" = f."Id_Campo"
from public."Factura" f
where f."Id_Factura" = ih."Id_Factura";

alter table public."ItemHacienda" alter column "Id_Campo" set not null;
create index idx_item_hacienda_campo on public."ItemHacienda" ("Id_Campo");

-- 3) Sacar Id_Campo de Factura (aplica tanto a compra como a venta)
drop index if exists idx_factura_campo;
alter table public."Factura" drop column "Id_Campo";


-- 4) Reescribir el trigger de sincronización de Rodeo: ahora toma el campo
-- directamente de NEW/OLD.Id_Campo en vez de buscarlo en Factura.
create or replace function public.sync_rodeo_from_item_hacienda()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_tipo_operacion integer;
  v_fecha_factura  date;
  v_delta          integer;
begin
  if TG_OP = 'INSERT' then
    select "Id_TipoOperacion", "Fecha"
    into   v_tipo_operacion, v_fecha_factura
    from   public."Factura"
    where  "Id_Factura" = NEW."Id_Factura";

    v_delta := case when v_tipo_operacion = 1 then NEW."Cabezas" else -NEW."Cabezas" end;

    update public."Rodeo"
    set    "Cabezas" = "Cabezas" + v_delta
    where  "Id_Campo"             = NEW."Id_Campo"
      and  "Id_CategoriaHacienda" = NEW."Id_CategoriaHacienda";

    insert into public."MovimientoRodeo" (
      "TipoMovimiento", "Id_CategoriaHacienda", "Cabezas", "Fecha", "Id_Factura", "Id_Campo"
    ) values (
      case when v_tipo_operacion = 1 then 'compra' else 'venta' end,
      NEW."Id_CategoriaHacienda",
      NEW."Cabezas",
      v_fecha_factura,
      NEW."Id_Factura",
      NEW."Id_Campo"
    );

  elsif TG_OP = 'DELETE' then
    select "Id_TipoOperacion"
    into   v_tipo_operacion
    from   public."Factura"
    where  "Id_Factura" = OLD."Id_Factura";

    v_delta := case when v_tipo_operacion = 1 then -OLD."Cabezas" else OLD."Cabezas" end;

    update public."Rodeo"
    set    "Cabezas" = "Cabezas" + v_delta
    where  "Id_Campo"             = OLD."Id_Campo"
      and  "Id_CategoriaHacienda" = OLD."Id_CategoriaHacienda";

    delete from public."MovimientoRodeo"
    where  "Id_Factura"           = OLD."Id_Factura"
      and  "Id_CategoriaHacienda" = OLD."Id_CategoriaHacienda"
      and  "Id_Campo"             = OLD."Id_Campo"
      and  "TipoMovimiento"       in ('compra', 'venta');

  end if;

  return null;
end;
$$;
