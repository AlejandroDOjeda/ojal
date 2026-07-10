-- Import de facturas de compra historicas (carga inicial), generado automaticamente.
-- Revisar antes de correr. Todas: Compra, Factura A, Contado.
-- Requiere que las EntidadLegal de estas facturas ya existan
-- (ver supabase/migrations/20260623000008_seed_entidades_legales.sql).
begin;

-- Facturas + item de gasto 'Carga inicial' (una CTE por factura) -- 226 facturas
with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00005', '00166604', '2026-01-15',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30711716374'),
          1, 301352.89, 0.00, 63284.11, 0.00, 364637.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 301352.89, 21, 301352.89 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00002', '00000609', '2026-01-08',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '20204095788'),
          1, 80000.00, 0.00, 0.00, 0.00, 80000.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 80000.00, 0, 80000.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00003', '00035868', '2026-01-06',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30710281013'),
          1, 143392.76, 15056.24, 0.00, 0.00, 158449.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 143392.76, 10.5, 143392.76 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00039', '00006650', '2026-01-03',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30532347110'),
          1, 75123.96, 0.00, 15776.03, 0.00, 90899.99)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 75123.96, 21, 75123.96 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00001', '00000381', '2026-01-19',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '20398170777'),
          1, 45000.00, 0.00, 0.00, 0.00, 45000.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 45000.00, 0, 45000.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00003', '00000833', '2026-01-22',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30717400212'),
          1, 469409.85, 0.00, 98576.07, 0.00, 567985.92)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 469409.85, 21, 469409.85 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00001', '00000384', '2026-01-27',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '20398170777'),
          1, 119900.00, 0.00, 0.00, 0.00, 119900.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 119900.00, 0, 119900.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00001', '00005414', '2026-01-14',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30717182045'),
          1, 4848879.34, 0.00, 1018264.66, 0.00, 5867144.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 4848879.34, 21, 4848879.34 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048566', '2026-01-26',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 886320.87, 0.00, 186127.38, 267538.18, 1339986.43)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 886320.87, 21, 886320.87 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048676', '2026-01-28',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 22512.40, 0.00, 4727.60, 9972.99, 37212.99)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 22512.40, 21, 22512.40 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00004', '00024054', '2026-01-19',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33717591329'),
          1, 27804.37, 0.00, 5838.92, 6379.74, 40023.03)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 27804.37, 21, 27804.37 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00013', '00027607', '2026-01-29',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33710012909'),
          1, 67401.33, 0.00, 14154.28, 10445.32, 92000.93)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 67401.33, 21, 67401.33 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00047620', '2026-01-02',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 77180.34, 0.00, 16207.87, 26614.83, 120003.04)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 77180.34, 21, 77180.34 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00047760', '2026-01-05',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 72667.51, 0.00, 15260.18, 25038.76, 112966.45)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 72667.51, 21, 72667.51 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00047830', '2026-01-06',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 5965.79, 0.00, 1252.82, 2642.84, 9861.45)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 5965.79, 21, 5965.79 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00004', '00240044', '2026-01-19',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33717591329'),
          1, 87778.10, 0.00, 18433.40, 14788.54, 121000.04)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 87778.10, 21, 87778.10 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00001', '00004587', '2026-02-02',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30717182045'),
          1, 15300.00, 0.00, 3213.00, 0.00, 18513.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 15300.00, 21, 15300.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00001', '00004584', '2026-02-02',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30717182045'),
          1, 1528406.00, 0.00, 320965.26, 0.00, 1849371.26)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 1528406.00, 21, 1528406.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00013', '00027774', '2026-02-04',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33710012909'),
          1, 76308.78, 0.00, 16024.84, 11668.40, 104002.02)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 76308.78, 21, 76308.78 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048344', '2026-01-20',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 227026.02, 0.00, 47675.46, 68107.81, 342809.29)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 227026.02, 21, 227026.02 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00004847', '2026-01-20',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 212969.74, 0.00, 44723.65, 63890.92, 321584.31)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 212969.74, 21, 212969.74 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048424', '2026-01-22',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 155126.10, 0.00, 32576.48, 46537.83, 234240.41)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 155126.10, 21, 155126.10 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048801', '2026-01-30',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 172100.37, 0.00, 36141.08, 51630.11, 259871.56)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 172100.37, 21, 172100.37 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048836', '2026-01-31',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 238011.15, 0.00, 49982.34, 71403.35, 359396.84)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 238011.15, 21, 238011.15 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048837', '2026-01-31',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 168438.66, 0.00, 35372.12, 50531.60, 254342.38)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 168438.66, 21, 168438.66 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048012', '2026-01-10',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 124498.14, 0.00, 26144.61, 37992.19, 188634.94)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 124498.14, 21, 124498.14 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00047950', '2026-01-08',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 176982.65, 0.00, 37166.36, 53094.80, 267243.81)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 176982.65, 21, 176982.65 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048176', '2026-01-14',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 97645.60, 0.00, 20505.58, 29293.68, 147444.86)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 97645.60, 21, 97645.60 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048234', '2026-01-17',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 230059.90, 0.00, 48312.58, 69017.97, 347390.45)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 230059.90, 21, 230059.90 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048235', '2026-01-17',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 101307.31, 0.00, 21274.54, 30392.19, 152974.04)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 101307.31, 21, 101307.31 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048255', '2026-01-18',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 151182.22, 0.00, 31748.27, 45354.67, 228285.16)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 151182.22, 21, 151182.22 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048045', '2026-01-11',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 214284.36, 0.00, 44999.72, 64285.31, 323569.39)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 214284.36, 21, 214284.36 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048007', '2026-01-10',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 197194.20, 0.00, 41410.78, 59158.26, 297763.24)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 197194.20, 21, 197194.20 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00047747', '2026-01-04',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 151445.15, 0.00, 31803.48, 45433.54, 228682.17)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 151445.15, 21, 151445.15 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00047752', '2026-01-04',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 155126.10, 0.00, 32576.48, 46537.83, 234240.41)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 155126.10, 21, 155126.10 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00047975', '2026-01-09',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 226116.02, 0.00, 47484.36, 67834.80, 341435.18)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 226116.02, 21, 226116.02 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00047701', '2026-01-03',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 115950.19, 0.00, 24349.54, 34785.06, 175084.79)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 115950.19, 21, 115950.19 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00047708', '2026-01-03',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 145247.83, 0.00, 30502.04, 43574.35, 219324.22)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 145247.83, 21, 145247.83 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048289', '2026-01-19',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 191629.49, 0.00, 40242.19, 57488.85, 289360.53)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 191629.49, 21, 191629.49 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048740', '2026-01-29',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 239231.72, 0.00, 50238.66, 71769.52, 361239.90)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 239231.72, 21, 239231.72 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048700', '2026-01-28',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 240576.92, 0.00, 50521.15, 72173.08, 363271.15)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 240576.92, 21, 240576.92 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048662', '2026-01-28',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 119236.76, 0.00, 25039.72, 35771.03, 180047.51)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 119236.76, 21, 119236.76 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048658', '2026-01-27',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 256319.70, 0.00, 53827.14, 76895.91, 387042.75)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 256319.70, 21, 256319.70 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048385', '2026-01-21',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 170879.80, 0.00, 35884.76, 51263.94, 258028.50)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 170879.80, 21, 170879.80 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00005059', '2026-02-02',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '27233560087'),
          1, 7066.12, 0.00, 1483.89, 0.00, 8550.01)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 7066.12, 21, 7066.12 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00004', '00000716', '2026-02-11',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '27227279693'),
          1, 81818.19, 0.00, 17181.82, 0.00, 99000.01)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 81818.19, 21, 81818.19 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00002', '00003738', '2026-02-11',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '23232369914'),
          1, 51150.00, 0.00, 0.00, 0.00, 51150.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 51150.00, 0, 51150.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00003', '00000104', '2026-02-13',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '20345809563'),
          1, 645000.00, 0.00, 135450.00, 0.00, 780450.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 645000.00, 21, 645000.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00005', '00016798', '2026-02-18',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30711716374'),
          1, 370642.56, 0.00, 77834.94, 0.00, 448477.50)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 370642.56, 21, 370642.56 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00048982', '2026-02-05',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 74316.20, 0.00, 15606.40, 29529.22, 119451.82)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 74316.20, 21, 74316.20 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049123', '2026-02-09',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 38271.08, 0.00, 8036.93, 16954.09, 63262.10)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 38271.08, 21, 38271.08 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049051', '2026-02-06',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 78793.40, 0.00, 16546.61, 34905.48, 130245.49)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 78793.40, 21, 78793.40 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00004', '00024440', '2026-02-16',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33717591329'),
          1, 72557.31, 0.00, 15237.04, 12224.20, 100018.55)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 72557.31, 21, 72557.31 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049797', '2026-02-28',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 177014.89, 0.00, 37173.13, 53104.47, 267292.49)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 177014.89, 21, 177014.89 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049116', '2026-02-08',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 184047.92, 0.00, 38650.06, 55214.38, 277912.36)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 184047.92, 21, 184047.92 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049164', '2026-02-09',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 269745.97, 0.00, 56646.65, 80923.79, 407316.41)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 269745.97, 21, 269745.97 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049058', '2026-02-06',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 206276.33, 0.00, 43318.03, 61882.90, 311477.26)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 206276.33, 21, 206276.33 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049206', '2026-02-10',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 153522.26, 0.00, 32239.67, 46056.68, 231818.61)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 153522.26, 21, 153522.26 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049250', '2026-02-11',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 310252.21, 0.00, 65152.96, 93075.66, 468480.83)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 310252.21, 21, 310252.21 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049306', '2026-02-13',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 151182.22, 0.00, 31748.27, 45285.16, 228215.65)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 151182.22, 21, 151182.22 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049204', '2026-02-10',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 278289.96, 0.00, 58440.89, 83486.99, 420217.84)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 278289.96, 21, 278289.96 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049410', '2026-02-17',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 164328.50, 0.00, 34508.99, 49298.55, 248136.04)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 164328.50, 21, 164328.50 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049373', '2026-02-16',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 184047.92, 0.00, 38650.06, 55214.38, 277912.36)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 184047.92, 21, 184047.92 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049327', '2026-02-14',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 148909.54, 0.00, 31271.00, 44672.86, 224853.40)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 148909.54, 21, 148909.54 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049352', '2026-02-15',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 216913.62, 0.00, 45551.86, 65074.09, 327539.57)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 216913.62, 21, 216913.62 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049452', '2026-02-18',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 202452.71, 0.00, 42515.07, 60735.81, 305703.59)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 202452.71, 21, 202452.71 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049641', '2026-02-24',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 297064.56, 0.00, 62383.56, 89119.37, 448567.49)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 297064.56, 21, 297064.56 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049732', '2026-02-26',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 201219.20, 0.00, 42256.03, 60365.76, 303840.99)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 201219.20, 21, 201219.20 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049645', '2026-02-25',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 199958.95, 0.00, 41991.38, 59987.69, 301938.02)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 199958.95, 21, 199958.95 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049686', '2026-02-25',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 285924.64, 0.00, 60044.17, 85777.39, 431746.20)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 285924.64, 21, 285924.64 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049759', '2026-02-27',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 235565.97, 0.00, 49468.85, 70669.79, 355704.61)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 235565.97, 21, 235565.97 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00011850', '2026-02-23',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30619984850'),
          1, 402479.34, 0.00, 84520.66, 0.00, 487000.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 402479.34, 21, 402479.34 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00004', '00024532', '2026-02-21',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33717591329'),
          1, 82542.94, 0.00, 17334.02, 14152.03, 114028.99)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 82542.94, 21, 82542.94 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049714', '2026-02-26',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 56304.36, 0.00, 11823.92, 16891.31, 85019.59)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 56304.36, 21, 56304.36 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050678', '2026-03-29',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 1613906.27, 0.00, 338920.32, 486152.97, 2438979.56)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 1613906.27, 21, 1613906.27 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050408', '2026-03-19',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 320108.35, 0.00, 67222.75, 96032.51, 483363.61)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 320108.35, 21, 320108.35 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050286', '2026-03-16',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 185351.25, 0.00, 38923.76, 55605.38, 279880.39)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 185351.25, 21, 185351.25 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050126', '2026-03-10',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 227241.72, 0.00, 47720.76, 68172.51, 343134.99)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 227241.72, 21, 227241.72 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050074', '2026-03-09',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 245037.75, 0.00, 51457.93, 73511.33, 370007.01)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 245037.75, 21, 245037.75 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050003', '2026-03-07',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 180704.16, 0.00, 37947.87, 54211.25, 272863.28)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 180704.16, 21, 180704.16 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049972', '2026-03-05',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 227170.94, 0.00, 47705.90, 68151.28, 343028.12)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 227170.94, 21, 227170.94 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050027', '2026-03-08',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 229979.57, 0.00, 48295.71, 68993.87, 347269.15)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 229979.57, 21, 229979.57 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049991', '2026-03-06',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 157426.49, 0.00, 33059.56, 47227.95, 237714.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 157426.49, 21, 157426.49 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00049962', '2026-03-05',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 330430.46, 0.00, 69390.40, 99129.14, 498950.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 330430.46, 21, 330430.46 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050248', '2026-03-14',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 152329.07, 0.00, 31989.10, 45689.72, 230007.89)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 152329.07, 21, 152329.07 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050244', '2026-03-14',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 290528.91, 0.00, 61011.07, 87158.67, 438698.65)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 290528.91, 21, 290528.91 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050502', '2026-03-24',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 239856.87, 0.00, 50369.94, 71957.06, 362183.87)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 239856.87, 21, 239856.87 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050355', '2026-03-17',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 207593.40, 0.00, 43594.61, 62278.02, 313466.03)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 207593.40, 21, 207593.40 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050373', '2026-03-18',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 327701.01, 0.00, 68817.21, 98310.30, 494828.52)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 327701.01, 21, 327701.01 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050580', '2026-03-26',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 294144.86, 0.00, 61770.42, 88243.46, 444158.74)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 294144.86, 21, 294144.86 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050657', '2026-03-28',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 289475.89, 0.00, 60789.94, 86842.77, 437108.60)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 289475.89, 21, 289475.89 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050686', '2026-03-29',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 166509.82, 0.00, 34967.06, 49952.95, 251429.83)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 166509.82, 21, 166509.82 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050623', '2026-03-27',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 263933.92, 0.00, 55426.12, 79180.18, 398540.22)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 263933.92, 21, 263933.92 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050540', '2026-03-25',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 256684.07, 0.00, 53903.65, 77005.22, 387592.94)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 256684.07, 21, 256684.07 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050544', '2026-03-26',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 230100.85, 0.00, 48321.18, 87029.89, 365451.92)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 230100.85, 21, 230100.85 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050400', '2026-03-19',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 1357791.30, 0.00, 285136.17, 412337.39, 2055264.86)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 1357791.30, 21, 1357791.30 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00001', '00000031', '2026-03-31',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30719175704'),
          1, 14285714.30, 1500000.00, 0.00, 0.00, 15785714.30)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 14285714.30, 10.5, 14285714.30 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00005', '00000050', '2026-03-26',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '27327182469'),
          1, 1033058.00, 0.00, 216942.18, 0.00, 1250000.18)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 1033058.00, 21, 1033058.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00004', '00024773', '2026-03-13',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33717591329'),
          1, 40691.25, 0.00, 8545.16, 6781.99, 56018.40)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 40691.25, 21, 40691.25 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00038', '00102719', '2026-03-14',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30581275710'),
          1, 24358.58, 0.00, 5115.30, 3437.33, 32911.21)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 24358.58, 21, 24358.58 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050335', '2026-03-17',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 144628.60, 0.00, 30372.01, 58557.38, 233557.99)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 144628.60, 21, 144628.60 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00037', '00019123', '2026-03-18',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30714339202'),
          1, 42125.68, 0.00, 8846.39, 7045.94, 58018.01)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 42125.68, 21, 42125.68 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00040', '00005371', '2026-03-18',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30581275710'),
          1, 24611.42, 0.00, 5168.40, 5168.40, 34948.22)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 24611.42, 21, 24611.42 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00040', '00005320', '2026-03-18',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30581275710'),
          1, 74554.97, 0.00, 15656.54, 9809.52, 100021.03)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 74554.97, 21, 74554.97 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00040', '00006080', '2026-03-28',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30581275710'),
          1, 33910.64, 0.00, 7121.23, 3988.09, 45019.96)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 33910.64, 21, 33910.64 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050652', '2026-03-28',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 59632.57, 0.00, 12522.84, 17889.77, 90045.18)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 59632.57, 21, 59632.57 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00004', '00024950', '2026-03-26',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33717591329'),
          1, 51611.99, 0.00, 10838.52, 7549.52, 70000.03)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 51611.99, 21, 51611.99 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00004', '00024914', '2026-03-25',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33717591329'),
          1, 53691.77, 0.00, 11275.27, 9032.98, 74000.02)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 53691.77, 21, 53691.77 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00003', '00001558', '2026-03-21',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '23305672319'),
          1, 10330.58, 0.00, 2169.42, 0.00, 12500.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 10330.58, 21, 10330.58 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050508', '2026-03-25',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 20223.59, 0.00, 4246.95, 6067.08, 30537.62)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 20223.59, 21, 20223.59 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050885', '2026-04-03',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 21444.63, 0.00, 4503.37, 6433.39, 32381.39)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 21444.63, 21, 21444.63 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050156', '2026-03-11',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 17221.09, 0.00, 3616.43, 5166.33, 26003.85)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 17221.09, 21, 17221.09 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00040', '00006575', '2026-04-04',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30581275710'),
          1, 45152.71, 0.00, 9482.07, 5310.22, 59945.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 45152.71, 21, 45152.71 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00246', '00068771', '2026-03-10',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30501912405'),
          1, 57748.36, 0.00, 12127.16, 11856.99, 81732.51)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 57748.36, 21, 57748.36 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00246', '00068642', '2026-02-28',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30501912405'),
          1, 28470.21, 0.00, 5978.74, 6294.99, 40743.94)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 28470.21, 21, 28470.21 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00246', '00068951', '2026-03-21',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30501912405'),
          1, 32019.94, 0.00, 6724.19, 6216.47, 44960.60)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 32019.94, 21, 32019.94 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00246', '00068950', '2026-03-21',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30501912405'),
          1, 43138.23, 0.00, 9059.03, 9096.77, 61294.03)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 43138.23, 21, 43138.23 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00005', '00000807', '2026-03-17',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '20123989423'),
          1, 42396.70, 0.00, 8903.31, 0.00, 51300.01)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 42396.70, 21, 42396.70 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00003', '00000802', '2026-04-01',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '23175917179'),
          1, 301652.90, 0.00, 63347.11, 0.00, 365000.01)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 301652.90, 21, 301652.90 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00003', '00005084', '2026-04-01',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30717071065'),
          1, 123966.94, 0.00, 26033.06, 0.00, 150000.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 123966.94, 21, 123966.94 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00004', '00000835', '2026-04-02',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '27227279693'),
          1, 289940.50, 0.00, 60887.51, 0.00, 350828.01)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 289940.50, 21, 289940.50 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00002', '00000244', '2026-04-01',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '23265179339'),
          1, 3220995.47, 338204.52, 0.00, 0.00, 3559199.99)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 3220995.47, 10.5, 3220995.47 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00003', '00005099', '2026-04-02',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30717071065'),
          1, 114637.56, 0.00, 24073.89, 0.00, 138711.45)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 114637.56, 21, 114637.56 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051304', '2026-04-19',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 66247.41, 0.00, 13911.96, 19874.22, 100033.59)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 66247.41, 21, 66247.41 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050033', '2026-03-09',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 26511.88, 0.00, 5567.49, 7953.56, 40032.93)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 26511.88, 21, 26511.88 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051504', '2026-04-27',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 172133.02, 0.00, 36147.93, 53620.89, 261901.84)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 172133.02, 21, 172133.02 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051692', '2026-05-03',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 107223.16, 0.00, 22516.86, 32166.95, 161906.97)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 107223.16, 21, 107223.16 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00038', '00104245', '2026-04-01',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30581275710'),
          1, 115267.69, 0.00, 24206.21, 13556.14, 153030.04)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 115267.69, 21, 115267.69 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00004', '00025168', '2026-04-11',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33717591329'),
          1, 88231.55, 0.00, 18528.63, 14565.39, 121325.57)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 88231.55, 21, 88231.55 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00014', '00122181', '2026-04-15',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30711140332'),
          1, 116819.00, 0.00, 24531.99, 18650.91, 160001.90)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 116819.00, 21, 116819.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051545', '2026-04-13',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 90727.29, 0.00, 19052.73, 27218.19, 136998.21)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 90727.29, 21, 90727.29 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00006', '00016062', '2026-04-11',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30708479728'),
          1, 103394.34, 0.00, 21712.81, 0.00, 125107.15)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 103394.34, 21, 103394.34 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00006', '00001600', '2026-04-15',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30627864074'),
          1, 3701652.89, 0.00, 777347.11, 0.00, 4479000.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 3701652.89, 21, 3701652.89 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00002', '00091702', '2026-04-12',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30715257099'),
          1, 99983.64, 0.00, 20996.56, 0.00, 120980.20)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 99983.64, 21, 99983.64 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00003', '00005372', '2026-04-09',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '20320981736'),
          1, 83181.82, 0.00, 17468.18, 0.00, 100650.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 83181.82, 21, 83181.82 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00011', '00000158', '2026-04-06',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30711785392'),
          1, 30743.80, 0.00, 6456.20, 0.00, 37200.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 30743.80, 21, 30743.80 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00039', '00006767', '2026-04-11',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30532347110'),
          1, 135619.83, 0.00, 28480.16, 0.00, 164099.99)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 135619.83, 21, 135619.83 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050916', '2026-04-04',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 356128.43, 0.00, 74786.97, 106838.53, 537753.93)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 356128.43, 21, 356128.43 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050918', '2026-04-04',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 275481.03, 0.00, 57851.02, 82644.02, 415976.07)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 275481.03, 21, 275481.03 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050994', '2026-04-07',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 268882.66, 0.00, 56465.36, 80664.80, 406012.82)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 268882.66, 21, 268882.66 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050945', '2026-04-06',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 364042.39, 0.00, 76448.90, 109212.72, 549704.01)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 364042.39, 21, 364042.39 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050870', '2026-04-02',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 292816.71, 0.00, 61491.51, 87845.01, 442153.23)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 292816.71, 21, 292816.71 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00050889', '2026-04-03',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 296925.39, 0.00, 62354.33, 89077.70, 448357.42)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 296925.39, 21, 296925.39 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051103', '2026-04-11',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 161659.53, 0.00, 33948.50, 48497.86, 244105.89)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 161659.53, 21, 161659.53 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051098', '2026-04-11',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 222694.25, 0.00, 46765.79, 66808.27, 336268.31)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 222694.25, 21, 222694.25 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051396', '2026-04-22',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 387784.29, 0.00, 81434.70, 116335.29, 585554.28)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 387784.29, 21, 387784.29 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051444', '2026-04-24',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 197950.44, 0.00, 41569.59, 59385.13, 298905.16)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 197950.44, 21, 197950.44 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051134', '2026-04-12',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 264923.67, 0.00, 55633.97, 79477.10, 400034.74)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 264923.67, 21, 264923.67 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051208', '2026-04-16',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 221591.02, 0.00, 46534.11, 66477.31, 334602.44)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 221591.02, 21, 221591.02 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051584', '2026-04-29',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 253246.88, 0.00, 53181.84, 75974.06, 382402.78)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 253246.88, 21, 253246.88 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051466', '2026-04-25',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 253246.86, 0.00, 53181.84, 75974.06, 382402.76)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 253246.86, 21, 253246.86 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051472', '2026-04-25',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 253246.88, 0.00, 53181.84, 75974.06, 382402.78)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 253246.88, 21, 253246.88 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051487', '2026-04-26',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 214446.31, 0.00, 45033.73, 64333.89, 323813.93)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 214446.31, 21, 214446.31 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051630', '2026-04-30',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 269074.81, 0.00, 56505.71, 80722.44, 406302.96)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 269074.81, 21, 269074.81 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00005155', '2026-04-28',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '27233560087'),
          1, 911074.39, 0.00, 191325.62, 0.00, 1102400.01)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 911074.39, 21, 911074.39 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052180', '2026-05-17',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 40309.29, 0.00, 8464.95, 12092.92, 60867.16)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 40309.29, 21, 40309.29 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052615', '2026-05-27',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 85764.34, 0.00, 18010.51, 25729.34, 129504.19)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 85764.34, 21, 85764.34 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051948', '2026-05-10',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 39920.01, 0.00, 8383.20, 11976.00, 60279.21)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 39920.01, 21, 39920.01 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052095', '2026-05-14',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 49735.05, 0.00, 10444.36, 14920.51, 75099.92)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 49735.05, 21, 49735.05 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052189', '2026-05-18',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 50343.73, 0.00, 10572.18, 15103.12, 76019.03)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 50343.73, 21, 50343.73 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052778', '2026-05-31',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 34305.78, 0.00, 7204.21, 10291.73, 51801.72)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 34305.78, 21, 34305.78 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00040', '00010816', '2026-05-31',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30581275710'),
          1, 103400.52, 0.00, 21714.11, 11904.37, 137019.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 103400.52, 21, 103400.52 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00038', '00107164', '2026-05-08',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30581275710'),
          1, 45216.08, 0.00, 9495.38, 5290.45, 60001.91)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 45216.08, 21, 45216.08 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00038', '00106666', '2026-05-03',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30581275710'),
          1, 41459.66, 0.00, 8706.53, 4875.89, 55042.08)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 41459.66, 21, 41459.66 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00004', '00025627', '2026-05-26',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33717591329'),
          1, 32984.90, 0.00, 6926.83, 4579.89, 44491.62)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 32984.90, 21, 32984.90 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00018', '00024685', '2026-05-07',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '20066582613'),
          1, 44337.65, 0.00, 9310.91, 6402.42, 60050.98)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 44337.65, 21, 44337.65 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00008', '00075083', '2026-05-07',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33713144709'),
          1, 58892.86, 0.00, 12367.50, 8751.53, 80011.89)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 58892.86, 21, 58892.86 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00013', '00130662', '2026-05-26',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30636690623'),
          1, 18919.29, 0.00, 3973.05, 3124.66, 26017.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 18919.29, 21, 18919.29 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00011', '00058671', '2026-05-05',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '27135202709'),
          1, 69690.40, 0.00, 14634.98, 15674.51, 99999.89)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 69690.40, 21, 69690.40 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00026', '00006170', '2026-05-03',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30718359111'),
          1, 56003.29, 0.00, 11760.69, 8271.91, 76035.89)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 56003.29, 21, 56003.29 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00029', '00055191', '2026-05-25',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30522015292'),
          1, 153903.12, 0.00, 32319.66, 11875.28, 198098.06)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 153903.12, 21, 153903.12 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00179', '00025260', '2026-05-04',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30627062490'),
          1, 41247.50, 0.00, 8661.98, 6092.42, 56001.90)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 41247.50, 21, 41247.50 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00019', '00041724', '2026-05-05',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30708217197'),
          1, 51357.21, 0.00, 10785.01, 7860.83, 70003.05)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 51357.21, 21, 51357.21 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00004', '00000925', '2026-05-11',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '27227279693'),
          1, 223141.00, 0.00, 46859.61, 0.00, 270000.61)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 223141.00, 21, 223141.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00039', '00000246', '2026-05-28',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30532347110'),
          1, 70069.00, 0.00, 14714.49, 23145.00, 107928.49)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 70069.00, 21, 70069.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00005', '00017286', '2026-05-13',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30711716374'),
          1, 148564.46, 0.00, 31198.54, 0.00, 179763.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 148564.46, 21, 148564.46 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00006', '00001607', '2026-05-08',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30627864074'),
          1, 704132.23, 0.00, 147867.77, 0.00, 852000.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 704132.23, 21, 704132.23 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00004', '00000928', '2026-05-13',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '27227279693'),
          1, 281818.19, 0.00, 59181.82, 0.00, 341000.01)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 281818.19, 21, 281818.19 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00009', '00003342', '2026-05-27',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30709883964'),
          1, 2556000.00, 268380.00, 0.00, 0.00, 2824380.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 2556000.00, 10.5, 2556000.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00000011', '2026-05-28',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '20350411527'),
          1, 1100000.00, 115500.00, 0.00, 0.00, 1215500.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 1100000.00, 10.5, 1100000.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00001', '00000442', '2026-05-21',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30718782380'),
          1, 106446.28, 0.00, 22353.72, 0.00, 128800.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 106446.28, 21, 106446.28 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00002', '00000406', '2026-05-04',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30709272167'),
          1, 12794661.00, 0.00, 0.00, 0.00, 12794661.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 12794661.00, 0, 12794661.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00001', '00000039', '2026-05-02',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30718617045'),
          1, 12794661.00, 0.00, 0.00, 0.00, 12794661.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 12794661.00, 0, 12794661.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00001', '00011336', '2026-05-23',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30715968009'),
          1, 635409.09, 0.00, 133435.91, 0.00, 768845.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 635409.09, 21, 635409.09 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00003', '00002273', '2026-05-11',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30708586648'),
          1, 86776.14, 0.00, 18222.99, 0.00, 104999.13)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 86776.14, 21, 86776.14 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00040', '00008900', '2026-05-08',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30581275710'),
          1, 118346.99, 0.00, 24852.87, 13847.04, 157046.90)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 118346.99, 21, 118346.99 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052176', '2026-05-17',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 111493.79, 0.00, 23413.70, 33448.14, 168355.63)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 111493.79, 21, 111493.79 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00040', '00009103', '2026-05-11',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30581275710'),
          1, 105627.41, 0.00, 22181.76, 12261.81, 140070.98)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 105627.41, 21, 105627.41 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00010', '00078295', '2026-05-11',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30710296657'),
          1, 79304.69, 0.00, 16653.98, 11046.82, 107005.49)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 79304.69, 21, 79304.69 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052415', '2026-05-22',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 110636.14, 0.00, 23233.59, 33190.84, 167060.57)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 110636.14, 21, 110636.14 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052467', '2026-05-23',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 62177.25, 0.00, 13057.22, 21919.27, 97153.74)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 62177.25, 21, 62177.25 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051952', '2026-05-11',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 13853.72, 0.00, 2909.28, 6137.20, 22900.20)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 13853.72, 21, 13853.72 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052449', '2026-05-22',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 315904.78, 0.00, 66340.00, 94771.43, 477016.21)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 315904.78, 21, 315904.78 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051742', '2026-05-04',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 275481.03, 0.00, 57851.02, 82644.31, 415976.36)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 275481.03, 21, 275481.03 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051973', '2026-05-11',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 340300.50, 0.00, 71463.11, 102090.15, 513853.76)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 340300.50, 21, 340300.50 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051702', '2026-05-03',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 225993.42, 0.00, 47458.62, 67798.03, 341250.07)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 225993.42, 21, 225993.42 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051683', '2026-05-02',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 260634.75, 0.00, 54733.30, 78190.42, 393558.47)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 260634.75, 21, 260634.75 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051796', '2026-05-05',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 313393.01, 0.00, 65812.53, 94017.90, 473223.44)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 313393.01, 21, 313393.01 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051916', '2026-05-09',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 306823.18, 0.00, 64432.87, 92046.95, 463303.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 306823.18, 21, 306823.18 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051936', '2026-05-10',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 308472.77, 0.00, 64779.28, 92541.83, 465793.88)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 308472.77, 21, 308472.77 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052096', '2026-05-14',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 265583.51, 0.00, 55772.54, 79675.05, 401031.10)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 265583.51, 21, 265583.51 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052010', '2026-05-12',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 189702.51, 0.00, 39837.53, 56910.75, 286450.79)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 189702.51, 21, 189702.51 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052057', '2026-05-13',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 303899.52, 0.00, 63818.90, 91169.86, 458888.28)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 303899.52, 21, 303899.52 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052300', '2026-05-19',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 336196.64, 0.00, 70601.29, 100858.99, 507656.92)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 336196.64, 21, 336196.64 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052358', '2026-05-20',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 329850.07, 0.00, 69268.51, 98955.02, 498073.60)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 329850.07, 21, 329850.07 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052501', '2026-05-23',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 313897.89, 0.00, 65918.56, 94169.37, 473985.82)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 313897.89, 21, 313897.89 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052252', '2026-05-18',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 411669.36, 0.00, 86450.57, 123500.81, 621620.74)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 411669.36, 21, 411669.36 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052529', '2026-05-24',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 290225.41, 0.00, 60947.34, 87067.62, 438240.37)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 290225.41, 21, 290225.41 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052675', '2026-05-28',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 202404.10, 0.00, 42504.86, 60721.23, 305630.19)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 202404.10, 21, 202404.10 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052719', '2026-05-29',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 420145.81, 0.00, 88230.62, 126073.74, 634450.17)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 420145.81, 21, 420145.81 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052641', '2026-05-27',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 231564.02, 0.00, 48628.44, 69469.20, 349661.66)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 231564.02, 21, 231564.02 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052801', '2026-05-31',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 289883.84, 0.00, 60875.61, 86965.15, 437724.60)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 289883.84, 21, 289883.84 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052775', '2026-05-30',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 215097.24, 0.00, 45170.42, 64529.17, 324796.83)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 215097.24, 21, 215097.24 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00051364', '2026-04-21',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 379405.01, 0.00, 79675.05, 113821.05, 572901.11)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 379405.01, 21, 379405.01 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00004', '00025713', '2026-06-01',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33717591329'),
          1, 82918.42, 0.00, 17412.87, 13688.29, 114019.58)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 82918.42, 21, 82918.42 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052880', '2026-06-02',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 85764.45, 0.00, 18010.53, 25729.34, 129504.32)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 85764.45, 21, 85764.45 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00053025', '2026-06-06',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 120070.23, 0.00, 25214.75, 36021.07, 181306.05)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 120070.23, 21, 120070.23 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00052619', '2026-05-27',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 105963.80, 0.00, 22252.40, 31789.14, 160005.34)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 105963.80, 21, 105963.80 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00053448', '2026-06-21',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 116639.66, 0.00, 24494.33, 34991.90, 176125.89)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 116639.66, 21, 116639.66 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00007', '00053539', '2026-06-24',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '33707769799'),
          1, 82784.14, 0.00, 17384.67, 24835.24, 125004.05)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 82784.14, 21, 82784.14 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00070', '00000230', '2026-06-13',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30603993191'),
          1, 455206.62, 0.00, 95593.39, 0.00, 550800.01)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 455206.62, 21, 455206.62 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00008', '00000413', '2026-07-03',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30707362568'),
          1, 543200.00, 0.00, 0.00, 0.00, 543200.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 543200.00, 0, 543200.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00004', '00000097', '2026-06-04',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '20312743273'),
          1, 5743500.00, 0.00, 1206135.00, 0.00, 6949635.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 5743500.00, 21, 5743500.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00003', '00000192', '2026-06-11',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '20227881938'),
          1, 11025000.00, 1157625.00, 0.00, 0.00, 12182625.00)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 11025000.00, 10.5, 11025000.00 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00039', '00006905', '2026-06-16',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '30532347110'),
          1, 38925.63, 0.00, 8174.38, 0.00, 47100.01)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 38925.63, 21, 38925.63 from fac;

with fac as (
  insert into "Factura" ("Id_TipoOperacion", "Id_TipoComprobante", "PuntoVenta", "Numero", "Fecha", "Id_EntidadLegal", "Id_CondicionPago", "Subtotal", "Iva10_5", "Iva21", "NoGravado", "Total")
  values (1, 1, '00005', '00000858', '2026-05-07',
          (select "Id_EntidadLegal" from "EntidadLegal" where "CuitCuil" = '20123989423'),
          1, 2134348.59, 0.00, 448213.20, 0.00, 2582561.79)
  returning "Id_Factura"
)
insert into "ItemGasto" ("Id_Factura", "Descripcion", "Id_CategoriaGasto", "Cantidad", "PrecioUnitario", "TasaIva", "Subtotal")
select "Id_Factura", 'Carga inicial', null, 1, 2134348.59, 21, 2134348.59 from fac;

commit;