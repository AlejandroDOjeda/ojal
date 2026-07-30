-- Import de facturas de compra de junio 2026 (planilla del usuario), generado
-- automaticamente a partir de una comparacion manual contra la base
-- productiva. De 47 facturas en la planilla, 12 ya estaban cargadas (se
-- excluyen) y 1 (UAA, Pto 00246 Nro 00070302) tiene un Total distinto entre
-- planilla ($71.544,30) y base ($64.630,23) -- no se toca, requiere revision
-- manual del usuario.
--
-- Todas: Compra, Factura A, Contado. NoGravado sale de la columna "NO
-- GRAVADO" de la planilla (ninguna fila tenia "Imp. Extra" cargado). Cada
-- insert de Factura es idempotente (where not exists) por si esta migracion
-- se corre mas de una vez o alguna fila ya fue cargada por otro camino.
begin;

-- Entidades legales nuevas (no estaban en el seed ni en la base).
-- Id_TipoPersona: 1=Fisica (CUIT 20/23/27) | 2=Juridica (CUIT 30/33).
-- Id_CondicionIva: 1=Resp.Inscripto | 3=Exento.
insert into "EntidadLegal" ("RazonSocial", "CuitCuil", "Id_TipoPersona", "Id_CondicionIva")
select 'Vernetti Daniel', '20119625387', 1, 3
where not exists (select 1 from "EntidadLegal" where "CuitCuil" = '20119625387');

insert into "EntidadLegal" ("RazonSocial", "CuitCuil", "Id_TipoPersona", "Id_CondicionIva")
select 'Del Campo Comb.', '30696758294', 2, 1
where not exists (select 1 from "EntidadLegal" where "CuitCuil" = '30696758294');

insert into "EntidadLegal" ("RazonSocial", "CuitCuil", "Id_TipoPersona", "Id_CondicionIva")
select 'Petro Breñas', '30585224754', 2, 1
where not exists (select 1 from "EntidadLegal" where "CuitCuil" = '30585224754');

insert into "EntidadLegal" ("RazonSocial", "CuitCuil", "Id_TipoPersona", "Id_CondicionIva")
select 'Corra. Otermin', '20240811570', 1, 1
where not exists (select 1 from "EntidadLegal" where "CuitCuil" = '20240811570');


-- Vernetti Daniel, 30/05/2026, Pto 00001 Nro 00002402 -- Exento (0%)
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00001', '00002402', '2026-05-30',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '20119625387'),
         1, 300000.00, 0.00, 0.00, 0.00, 300000.00,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00001' and "Numero" = '00002402'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '20119625387')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 300000.00, 0, 300000.00 from fac;

-- Agrotrans. SL, 01/06/2026, Pto 00007 Nro 00052854
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00052854', '2026-06-01',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 245286.33, 0.00, 51510.13, 73585.90, 370382.36,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00052854'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 245286.33, 21, 245286.33 from fac;

-- Agrotrans. SL, 01/06/2026, Pto 00007 Nro 00000007 -- OJO: numero de
-- factura atipico (7), tal como figura en la planilla original; revisar.
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00000007', '2026-06-01',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 268953.20, 0.00, 56480.17, 80685.96, 406119.33,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00000007'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 268953.20, 21, 268953.20 from fac;

-- Agrotrans. SL, 02/06/2026, Pto 00007 Nro 00052869
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00052869', '2026-06-02',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 39451.65, 0.00, 8284.85, 11835.49, 59571.99,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00052869'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 39451.65, 21, 39451.65 from fac;

-- Agrotrans. SL, 02/06/2026, Pto 00007 Nro 00052893
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00052893', '2026-06-02',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 26586.98, 0.00, 5583.27, 7976.09, 40146.34,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00052893'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 26586.98, 21, 26586.98 from fac;

-- Agrotrans. SL, 02/06/2026, Pto 00007 Nro 00052895
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00052895', '2026-06-02',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 225914.10, 0.00, 47441.96, 67774.23, 341130.29,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00052895'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 225914.10, 21, 225914.10 from fac;

-- Del Campo Comb., 03/06/2026, Pto 00012 Nro 00210554
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00012', '00210554', '2026-06-03',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30696758294'),
         1, 35585.34, 0.00, 7472.92, 1941.74, 45000.00,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00012' and "Numero" = '00210554'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30696758294')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 35585.34, 21, 35585.34 from fac;

-- Petro Breñas, 03/06/2026, Pto 00040 Nro 00154122
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00040', '00154122', '2026-06-03',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30585224754'),
         1, 49911.69, 0.00, 10481.45, 7619.88, 68013.02,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00040' and "Numero" = '00154122'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30585224754')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 49911.69, 21, 49911.69 from fac;

-- Petro Breñas, 04/06/2026, Pto 00040 Nro 00154307
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00040', '00154307', '2026-06-04',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30585224754'),
         1, 80704.89, 0.00, 16948.03, 12350.21, 110003.13,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00040' and "Numero" = '00154307'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30585224754')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 80704.89, 21, 80704.89 from fac;

-- Agrotrans. SL, 05/06/2026, Pto 00007 Nro 00053015
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053015', '2026-06-05',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 34477.31, 0.00, 7240.24, 10343.19, 52060.74,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053015'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 34477.31, 21, 34477.31 from fac;

-- Bandeo Repuesto, 06/06/2026, Pto 00001 Nro 00011444
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00001', '00011444', '2026-06-06',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30715968009'),
         1, 14545.45, 0.00, 3054.54, 0.00, 17599.99,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00001' and "Numero" = '00011444'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30715968009')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 14545.45, 21, 14545.45 from fac;

-- Eugenio Defagot, 07/06/2026, Pto 00038 Nro 00109789
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00038', '00109789', '2026-06-07',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30581275710'),
         1, 36254.07, 0.00, 7613.35, 4160.56, 48027.98,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00038' and "Numero" = '00109789'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30581275710')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 36254.07, 21, 36254.07 from fac;

-- Eugenio Defagot, 07/06/2026, Pto 00038 Nro 00109812
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00038', '00109812', '2026-06-07',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30581275710'),
         1, 25736.77, 0.00, 5404.72, 2953.58, 34095.07,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00038' and "Numero" = '00109812'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30581275710')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 25736.77, 21, 25736.77 from fac;

-- Agrotrans. SL, 07/06/2026, Pto 00007 Nro 00053052
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053052', '2026-06-07',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 257293.35, 0.00, 54031.60, 77188.01, 388512.96,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053052'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 257293.35, 21, 257293.35 from fac;

-- Agrotrans. SL, 08/06/2026, Pto 00007 Nro 00053085
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053085', '2026-06-08',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 272730.95, 0.00, 57273.50, 81819.29, 411823.74,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053085'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 272730.95, 21, 272730.95 from fac;

-- Agrotrans. SL, 09/06/2026, Pto 00007 Nro 00053114
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053114', '2026-06-09',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 295029.71, 0.00, 61956.24, 88508.91, 445494.86,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053114'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 295029.71, 21, 295029.71 from fac;

-- Agrotrans. SL, 09/06/2026, Pto 00007 Nro 00053118
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053118', '2026-06-09',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 202404.10, 0.00, 42504.86, 60721.23, 305630.19,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053118'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 202404.10, 21, 202404.10 from fac;

-- Agrotrans. SL, 10/06/2026, Pto 00007 Nro 00053155
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053155', '2026-06-10',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 325904.91, 0.00, 68440.03, 97771.47, 492116.41,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053155'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 325904.91, 21, 325904.91 from fac;

-- Agrotrans. SL, 11/06/2026, Pto 00007 Nro 00053171
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053171', '2026-06-11',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 141734.33, 0.00, 29764.21, 42520.30, 214018.84,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053171'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 141734.33, 21, 141734.33 from fac;

-- Agrotrans. SL, 11/06/2026, Pto 00007 Nro 00053169
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053169', '2026-06-11',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 379271.84, 0.00, 79647.09, 113781.55, 572700.48,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053169'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 379271.84, 21, 379271.84 from fac;

-- Eugenio Defagot, 12/06/2026, Pto 00040 Nro 00011705
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00040', '00011705', '2026-06-12',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30581275710'),
         1, 31742.53, 0.00, 6665.93, 3629.55, 42038.01,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00040' and "Numero" = '00011705'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30581275710')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 31742.53, 21, 31742.53 from fac;

-- Agrotrans. SL, 15/06/2026, Pto 00007 Nro 00053268
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053268', '2026-06-15',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 364430.77, 0.00, 76530.46, 109329.23, 550290.46,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053268'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 364430.77, 21, 364430.77 from fac;

-- Agrotrans. SL, 16/06/2026, Pto 00007 Nro 00053307
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053307', '2026-06-16',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 322474.33, 0.00, 67719.61, 96742.30, 486936.24,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053307'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 322474.33, 21, 322474.33 from fac;

-- Agrotrans. SL, 17/06/2026, Pto 00007 Nro 00053346
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053346', '2026-06-17',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 321556.56, 0.00, 67526.88, 96466.97, 485550.41,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053346'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 321556.56, 21, 321556.56 from fac;

-- Agrotrans. SL, 20/06/2026, Pto 00007 Nro 00053421
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053421', '2026-06-20',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 46484.33, 0.00, 9761.71, 13945.30, 70191.34,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053421'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 46484.33, 21, 46484.33 from fac;

-- Agrotrans. SL, 20/06/2026, Pto 00007 Nro 00053436
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053436', '2026-06-20',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 372675.81, 0.00, 78261.92, 111802.74, 562740.47,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053436'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 372675.81, 21, 372675.81 from fac;

-- Agrotrans. SL, 21/06/2026, Pto 00007 Nro 00053453
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053453', '2026-06-21',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 33122.23, 0.00, 6955.67, 9936.67, 50014.57,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053453'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 33122.23, 21, 33122.23 from fac;

-- Agrotrans. SL, 21/06/2026, Pto 00007 Nro 00053462
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053462', '2026-06-21',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 288168.55, 0.00, 60515.40, 86450.57, 435134.52,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053462'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 288168.55, 21, 288168.55 from fac;

-- TodoMetal, 22/06/2026, Pto 00008 Nro 00001637
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00008', '00001637', '2026-06-22',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '27233560087'),
         1, 47603.31, 0.00, 9996.70, 0.00, 57600.01,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00008' and "Numero" = '00001637'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '27233560087')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 47603.31, 21, 47603.31 from fac;

-- Corra. Otermin, 22/06/2026, Pto 00005 Nro 00002994
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00005', '00002994', '2026-06-22',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '20240811570'),
         1, 1946520.00, 0.00, 408769.20, 0.00, 2355289.20,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00005' and "Numero" = '00002994'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '20240811570')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 1946520.00, 21, 1946520.00 from fac;

-- Agrotrans. SL, 24/06/2026, Pto 00007 Nro 00053570
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053570', '2026-06-24',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 197258.24, 0.00, 41424.23, 59177.47, 297859.94,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053570'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 197258.24, 21, 197258.24 from fac;

-- Agrotrans. SL, 27/06/2026, Pto 00007 Nro 00053673
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053673', '2026-06-27',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 259008.64, 0.00, 54391.81, 77702.59, 391103.04,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053673'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 259008.64, 21, 259008.64 from fac;

-- Agrotrans. SL, 28/06/2026, Pto 00007 Nro 00053701
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053701', '2026-06-28',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 377622.83, 0.00, 79300.79, 113286.85, 570210.47,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053701'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 377622.83, 21, 377622.83 from fac;

-- Agrotrans. SL, 29/06/2026, Pto 00007 Nro 00053748
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053748', '2026-06-29',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 307036.73, 0.00, 64477.71, 92111.02, 463625.46,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053748'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 307036.73, 21, 307036.73 from fac;

-- Agrotrans. SL, 30/06/2026, Pto 00007 Nro 00053780
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total", "Id_Profile")
  select 1, 1, '00007', '00053780', '2026-06-30',
         (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
         1, 265869.80, 0.00, 55832.66, 79760.94, 401463.40,
         (select "Id_Profile" from "Profile" where "Apellido" = 'Tovias')
  where not exists (
    select 1 from "Factura" where "Id_TipoOperacion" = 1 and "PuntoVenta" = '00007' and "Numero" = '00053780'
      and "Id_EntidadLegal" = (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799')
  )
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 265869.80, 21, 265869.80 from fac;

commit;
