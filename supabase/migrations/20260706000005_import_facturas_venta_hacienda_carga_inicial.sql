-- Import de facturas de venta de hacienda historicas (carga inicial), generado automaticamente.
-- Revisar antes de correr. Todas: Venta, Factura A, Contado, precio por cabeza.
-- Requiere que las EntidadLegal de estas facturas ya existan
-- (ver supabase/migrations/20260623000008_seed_entidades_legales.sql).
begin;

update "Rodeo"
set "Cabezas" = 193
where "Id_Campo" = (select "Id_Campo" from "Campo" where "Nombre" = 'Campo Principal' limit 1)
  and "Id_CategoriaHacienda" = (select "Id_CategoriaHacienda" from "CategoriaHacienda" where "Nombre" = 'Ternero');

update "Rodeo"
set "Cabezas" = 40
where "Id_Campo" = (select "Id_Campo" from "Campo" where "Nombre" = 'Campo Principal' limit 1)
  and "Id_CategoriaHacienda" = (select "Id_CategoriaHacienda" from "CategoriaHacienda" where "Nombre" = 'Ternera');

-- Facturas de venta + items de hacienda (una CTE por factura) -- 3 facturas
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (2, 1, '00004', '00002893', '2026-02-23',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30715022210'),
          1, 24584891.00, 2581413.56, 0.00, 0, 27166304.56)
  returning "Id_Factura"
)
insert into "ItemHacienda" ("Id_Factura", "Id_Campo", "Id_CategoriaHacienda", "Cabezas", "KgPromedio", "PrecioPorKg", "PrecioPorCabeza", "TasaIva", "Subtotal")
select "Id_Factura", (select "Id_Campo" from "Campo" where "Nombre" = 'Campo Principal' limit 1), (select "Id_CategoriaHacienda" from "CategoriaHacienda" where "Nombre" = 'Ternero'), 33, null, null, 744996.70, 10.5, 24584891.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (2, 1, '00003', '00000041', '2026-03-31',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30668084229'),
          1, 161051400.00, 16910397.00, 0.00, 0, 177961797.00)
  returning "Id_Factura"
)
insert into "ItemHacienda" ("Id_Factura", "Id_Campo", "Id_CategoriaHacienda", "Cabezas", "KgPromedio", "PrecioPorKg", "PrecioPorCabeza", "TasaIva", "Subtotal")
select "Id_Factura", (select "Id_Campo" from "Campo" where "Nombre" = 'Campo Principal' limit 1), (select "Id_CategoriaHacienda" from "CategoriaHacienda" where "Nombre" = 'Ternera'), 10, null, null, 1310000.00, 10.5, 13100000.00 from fac
union all
select "Id_Factura", (select "Id_Campo" from "Campo" where "Nombre" = 'Campo Principal' limit 1), (select "Id_CategoriaHacienda" from "CategoriaHacienda" where "Nombre" = 'Ternero'), 110, null, null, 1345012.73, 10.5, 147951400.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (2, 1, '00003', '00000042', '2026-05-04',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '23127457409'),
          1, 41537499.50, 4361437.45, 0.00, 0, 45898936.95)
  returning "Id_Factura"
)
insert into "ItemHacienda" ("Id_Factura", "Id_Campo", "Id_CategoriaHacienda", "Cabezas", "KgPromedio", "PrecioPorKg", "PrecioPorCabeza", "TasaIva", "Subtotal")
select "Id_Factura", (select "Id_Campo" from "Campo" where "Nombre" = 'Campo Principal' limit 1), (select "Id_CategoriaHacienda" from "CategoriaHacienda" where "Nombre" = 'Ternero'), 50, null, null, 519218.74, 10.5, 25960937.00 from fac
union all
select "Id_Factura", (select "Id_Campo" from "Campo" where "Nombre" = 'Campo Principal' limit 1), (select "Id_CategoriaHacienda" from "CategoriaHacienda" where "Nombre" = 'Ternera'), 30, null, null, 519218.75, 10.5, 15576562.50 from fac;

commit;