-- Trigger que sincroniza Rodeo automáticamente cuando se crean o eliminan
-- ítems de hacienda en facturas.
--
-- INSERT en ItemHacienda → aplica el movimiento al Rodeo:
--   TipoOperacion 1 (Compra) → suma cabezas
--   TipoOperacion 2 (Venta)  → resta cabezas
--
-- DELETE en ItemHacienda → revierte el movimiento (usado al editar o anular facturas).
--
-- El Rodeo tiene check (Cabezas >= 0), por lo que una venta que exceda el stock
-- falla con error de constraint y revierte toda la transacción.

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

    -- Compra suma, venta resta
    v_delta := case when v_tipo_operacion = 1 then NEW."Cabezas" else -NEW."Cabezas" end;

    update public."Rodeo"
    set    "Cabezas" = "Cabezas" + v_delta
    where  "Id_CategoriaHacienda" = NEW."Id_CategoriaHacienda";

    insert into public."MovimientoRodeo" (
      "TipoMovimiento", "Id_CategoriaHacienda", "Cabezas", "Fecha", "Id_Factura"
    ) values (
      case when v_tipo_operacion = 1 then 'compra' else 'venta' end,
      NEW."Id_CategoriaHacienda",
      NEW."Cabezas",
      v_fecha_factura,
      NEW."Id_Factura"
    );

  elsif TG_OP = 'DELETE' then
    select "Id_TipoOperacion"
    into   v_tipo_operacion
    from   public."Factura"
    where  "Id_Factura" = OLD."Id_Factura";

    -- Revertir: compra resta, venta suma
    v_delta := case when v_tipo_operacion = 1 then -OLD."Cabezas" else OLD."Cabezas" end;

    update public."Rodeo"
    set    "Cabezas" = "Cabezas" + v_delta
    where  "Id_CategoriaHacienda" = OLD."Id_CategoriaHacienda";

    -- Eliminar el movimiento registrado por esta factura+categoría
    delete from public."MovimientoRodeo"
    where  "Id_Factura"           = OLD."Id_Factura"
      and  "Id_CategoriaHacienda" = OLD."Id_CategoriaHacienda"
      and  "TipoMovimiento"       in ('compra', 'venta');

  end if;

  return null;
end;
$$;

create trigger trg_sync_rodeo_item_hacienda
  after insert or delete on public."ItemHacienda"
  for each row execute function public.sync_rodeo_from_item_hacienda();
