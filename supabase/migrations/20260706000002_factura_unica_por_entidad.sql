-- Evita cargar dos veces la misma factura de un proveedor/cliente: no puede
-- haber dos facturas del mismo tipo de operación (compra/venta), la misma
-- entidad legal, el mismo punto de venta y el mismo número.
-- Es un índice parcial (solo aplica si ambos campos están cargados) porque
-- PuntoVenta/Numero son nullable a nivel de esquema, aunque la app ya los
-- exige en el formulario.

create unique index idx_factura_unica_por_entidad
  on public."Factura" ("Id_TipoOperacion", "Id_EntidadLegal", "PuntoVenta", "Numero")
  where "PuntoVenta" is not null and "Numero" is not null;
