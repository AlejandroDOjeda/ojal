-- Un CUIT/CUIL identifica a una única persona física o jurídica ante AFIP,
-- así que no puede haber dos EntidadLegal con el mismo CuitCuil.

alter table public."EntidadLegal"
  add constraint entidadlegal_cuitcuil_key unique ("CuitCuil");
