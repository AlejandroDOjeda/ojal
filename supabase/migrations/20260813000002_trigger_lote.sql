-- Reemplaza el seed de Rodeo al crear un Campo por una cadena de dos saltos:
-- Campo -> Lote (siembra un "Lote 1") -> Rodeo (siembra 9 categorías en 0).
-- Mismo comportamiento end-to-end que hoy (crear un campo lo deja usable),
-- pero ahora el Rodeo cuelga del Lote, no del Campo.

drop trigger trg_seed_rodeo_on_campo on public."Campo";
drop function public.seed_rodeo_on_campo();

create or replace function public.seed_lote_on_campo()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public."Lote" ("Id_Campo", "Nombre")
  values (NEW."Id_Campo", 'Lote 1');
  return NEW;
end;
$$;

create trigger trg_seed_lote_on_campo
  after insert on public."Campo"
  for each row execute function public.seed_lote_on_campo();


create or replace function public.seed_rodeo_on_lote()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public."Rodeo" ("Id_Lote", "Id_CategoriaHacienda", "Cabezas")
  select NEW."Id_Lote", "Id_CategoriaHacienda", 0
  from public."CategoriaHacienda"
  where "Activa" = true;
  return NEW;
end;
$$;

create trigger trg_seed_rodeo_on_lote
  after insert on public."Lote"
  for each row execute function public.seed_rodeo_on_lote();


-- Reescribir sync_rodeo_from_item_hacienda: ahora toma Id_Lote directo de
-- NEW/OLD (ItemHacienda ya lo tiene), en vez de resolver Id_Campo vía la
-- Factura padre. La consulta a Factura se mantiene, pero solo para
-- Id_TipoOperacion y Fecha, que siguen haciendo falta.

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
    where  "Id_Lote"              = NEW."Id_Lote"
      and  "Id_CategoriaHacienda" = NEW."Id_CategoriaHacienda";

    insert into public."MovimientoRodeo" (
      "TipoMovimiento", "Id_CategoriaHacienda", "Cabezas", "Fecha", "Id_Factura", "Id_Lote"
    ) values (
      case when v_tipo_operacion = 1 then 'compra' else 'venta' end,
      NEW."Id_CategoriaHacienda",
      NEW."Cabezas",
      v_fecha_factura,
      NEW."Id_Factura",
      NEW."Id_Lote"
    );

  elsif TG_OP = 'DELETE' then
    select "Id_TipoOperacion"
    into   v_tipo_operacion
    from   public."Factura"
    where  "Id_Factura" = OLD."Id_Factura";

    v_delta := case when v_tipo_operacion = 1 then -OLD."Cabezas" else OLD."Cabezas" end;

    update public."Rodeo"
    set    "Cabezas" = "Cabezas" + v_delta
    where  "Id_Lote"              = OLD."Id_Lote"
      and  "Id_CategoriaHacienda" = OLD."Id_CategoriaHacienda";

    delete from public."MovimientoRodeo"
    where  "Id_Factura"           = OLD."Id_Factura"
      and  "Id_CategoriaHacienda" = OLD."Id_CategoriaHacienda"
      and  "Id_Lote"              = OLD."Id_Lote"
      and  "TipoMovimiento"       in ('compra', 'venta');

  end if;

  return null;
end;
$$;
