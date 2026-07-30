-- Notas de Crédito y Débito: son comprobantes que corrigen una Factura ya
-- cargada (reducen o aumentan su monto). Se modelan reusando la misma tabla
-- Factura y los mismos ItemGasto/ItemHacienda — solo se agregan los nuevos
-- TipoComprobante y una referencia a la factura que corrigen.
--
-- No se distingue letra (A/B/C) a nivel de TipoComprobante: una Nota de
-- Crédito/Débito no tiene letra propia, hereda la de la factura que corrige
-- (Id_FacturaAsociada). La app la infiere en pantalla a partir de esa
-- referencia — no hace falta pedírsela al usuario ni guardarla.

insert into public."TipoComprobante" ("Nombre") values
  ('Nota de Crédito'),  -- 5
  ('Nota de Débito');   -- 6

alter table public."Factura"
  add column "Id_FacturaAsociada" integer references public."Factura"("Id_Factura") on delete set null;

create index idx_factura_asociada on public."Factura" ("Id_FacturaAsociada");


-- La numeración de una Nota de Crédito/Débito es una serie propia,
-- independiente de la de Factura: pueden compartir Punto de Venta + Número
-- sin ser la misma operación. El índice de duplicados debe distinguir por
-- tipo de comprobante, no solo por tipo de operación.
drop index if exists idx_factura_unica_por_entidad;
create unique index idx_factura_unica_por_entidad
  on public."Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "Id_EntidadLegal", "PuntoVenta", "Numero")
  where "PuntoVenta" is not null and "Numero" is not null;


-- Una Nota de Crédito/Débito con ítems de hacienda registra el ajuste
-- económico (para IVA y resultado) pero no mueve stock: en la gran mayoría
-- de los casos es un ajuste de precio (diferencia de kg, comisión, etc.),
-- no una devolución física de animales. Si hay devolución real, se carga
-- aparte como ajuste manual de Rodeo. El trigger ignora Id_TipoComprobante
-- 5 y 6 (las filas de Nota de Crédito/Débito insertadas arriba).
create or replace function public.sync_rodeo_from_item_hacienda()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_tipo_operacion   integer;
  v_tipo_comprobante integer;
  v_fecha_factura    date;
  v_delta            integer;
begin
  if TG_OP = 'INSERT' then
    select "Id_TipoOperacion", "Id_TipoComprobante", "Fecha"
    into   v_tipo_operacion, v_tipo_comprobante, v_fecha_factura
    from   public."Factura"
    where  "Id_Factura" = NEW."Id_Factura";

    if v_tipo_comprobante between 5 and 6 then
      return null;
    end if;

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
    select "Id_TipoOperacion", "Id_TipoComprobante"
    into   v_tipo_operacion, v_tipo_comprobante
    from   public."Factura"
    where  "Id_Factura" = OLD."Id_Factura";

    if v_tipo_comprobante between 5 and 6 then
      return null;
    end if;

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
