-- Borra Id_Campo de Rodeo/MovimientoRodeo/ItemHacienda: Campo ahora se
-- deriva vía Lote.Id_Campo. Seguro recién acá porque 20260813000002 ya
-- reescribió sync_rodeo_from_item_hacienda para no depender de esta
-- columna — si se borrara antes, el DROP no fallaría en el momento pero
-- rompería silenciosamente el próximo INSERT/DELETE de ItemHacienda.
--
-- Postgres borra automáticamente los índices y constraints que dependen
-- exclusivamente de la columna (idx_rodeo_campo, idx_movimiento_campo,
-- idx_item_hacienda_campo) junto con el DROP COLUMN.

alter table public."Rodeo"           drop column "Id_Campo";
alter table public."MovimientoRodeo" drop column "Id_Campo";
alter table public."ItemHacienda"    drop column "Id_Campo";
