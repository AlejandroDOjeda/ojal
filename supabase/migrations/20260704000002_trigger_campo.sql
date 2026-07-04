-- Trigger 1: al crear un Campo, sembrar automáticamente las filas de Rodeo
-- (una por cada categoría activa, con Cabezas = 0).
-- Así el usuario no necesita hacer "carga inicial" manualmente por campo.

create or replace function public.seed_rodeo_on_campo()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public."Rodeo" ("Id_Campo", "Id_CategoriaHacienda", "Cabezas")
  select NEW."Id_Campo", "Id_CategoriaHacienda", 0
  from public."CategoriaHacienda"
  where "Activa" = true;
  return NEW;
end;
$$;

create trigger trg_seed_rodeo_on_campo
  after insert on public."Campo"
  for each row execute function public.seed_rodeo_on_campo();


-- Trigger 2: reemplazar sync_rodeo_from_item_hacienda para que sea campo-aware.
-- Ahora obtiene Id_Campo desde la Factura y filtra el Rodeo por (Id_Campo, Id_CategoriaHacienda).
-- El MovimientoRodeo también recibe Id_Campo.

create or replace function public.sync_rodeo_from_item_hacienda()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_tipo_operacion integer;
  v_fecha_factura  date;
  v_id_campo       integer;
  v_delta          integer;
begin
  if TG_OP = 'INSERT' then
    select "Id_TipoOperacion", "Fecha", "Id_Campo"
    into   v_tipo_operacion, v_fecha_factura, v_id_campo
    from   public."Factura"
    where  "Id_Factura" = NEW."Id_Factura";

    v_delta := case when v_tipo_operacion = 1 then NEW."Cabezas" else -NEW."Cabezas" end;

    update public."Rodeo"
    set    "Cabezas" = "Cabezas" + v_delta
    where  "Id_Campo"             = v_id_campo
      and  "Id_CategoriaHacienda" = NEW."Id_CategoriaHacienda";

    insert into public."MovimientoRodeo" (
      "TipoMovimiento", "Id_CategoriaHacienda", "Cabezas", "Fecha", "Id_Factura", "Id_Campo"
    ) values (
      case when v_tipo_operacion = 1 then 'compra' else 'venta' end,
      NEW."Id_CategoriaHacienda",
      NEW."Cabezas",
      v_fecha_factura,
      NEW."Id_Factura",
      v_id_campo
    );

  elsif TG_OP = 'DELETE' then
    select "Id_TipoOperacion", "Id_Campo"
    into   v_tipo_operacion, v_id_campo
    from   public."Factura"
    where  "Id_Factura" = OLD."Id_Factura";

    v_delta := case when v_tipo_operacion = 1 then -OLD."Cabezas" else OLD."Cabezas" end;

    update public."Rodeo"
    set    "Cabezas" = "Cabezas" + v_delta
    where  "Id_Campo"             = v_id_campo
      and  "Id_CategoriaHacienda" = OLD."Id_CategoriaHacienda";

    delete from public."MovimientoRodeo"
    where  "Id_Factura"           = OLD."Id_Factura"
      and  "Id_CategoriaHacienda" = OLD."Id_CategoriaHacienda"
      and  "Id_Campo"             = v_id_campo
      and  "TipoMovimiento"       in ('compra', 'venta');

  end if;

  return null;
end;
$$;
