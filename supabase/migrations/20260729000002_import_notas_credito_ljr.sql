-- Notas de Credito de compra de LJR (planilla del usuario), matcheadas
-- contra las facturas ya cargadas en 20260706000004_import_facturas_compras_carga_inicial.sql
-- por Razon Social + Fecha -- la planilla no trae el numero de la factura
-- original, pero para LJR hay una sola factura por fecha en la base, asi
-- que el match es inequivoco. "Nro. Factura" de la planilla es el numero
-- propio de la Nota de Credito (serie independiente), no el de la factura
-- que corrige.
--
-- Id_TipoComprobante 5 = Nota de Credito (sin letra propia -- hereda la de
-- la factura asociada, Factura A en ambos casos). Cada insert es idempotente
-- (where not exists) por si esta migracion se corre mas de una vez.
begin;

-- LJR, 15/01/2026, NC Pto 00005 Nro 00004185 -- corrige Factura Pto 00005 Nro 00166604 (misma fecha)
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_FacturaAsociada", "Id_Profile")
  select 1, 5, '00005', '00004185', '2026-01-15',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30711716374'),
         1, 45200.00, 0.00, 9492.00, 0.00, 54692.00,
         (select f2."Id_Factura" from "Factura" f2
          where f2."Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30711716374')
            and f2."Fecha" = '2026-01-15' and f2."Id_TipoOperacion" = 1 and f2."Id_TipoComprobante" not in (5, 6)
          limit 1),
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "Id_TipoComprobante" = 5
      and "PuntoVenta" = '00005' and "Numero" = '00004185'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30711716374')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Nota de Crédito', null, 1, 45200.00, 21, 45200.00 from fac;

-- LJR, 18/02/2026, NC Pto 00005 Nro 00004343 -- corrige Factura Pto 00005 Nro 00016798 (misma fecha)
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_FacturaAsociada", "Id_Profile")
  select 1, 5, '00005', '00004343', '2026-02-18',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30711716374'),
         1, 55596.38, 0.00, 11675.24, 0.00, 67271.62,
         (select f2."Id_Factura" from "Factura" f2
          where f2."Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30711716374')
            and f2."Fecha" = '2026-02-18' and f2."Id_TipoOperacion" = 1 and f2."Id_TipoComprobante" not in (5, 6)
          limit 1),
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "Id_TipoComprobante" = 5
      and "PuntoVenta" = '00005' and "Numero" = '00004343'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30711716374')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Nota de Crédito', null, 1, 55596.38, 21, 55596.38 from fac;

commit;
