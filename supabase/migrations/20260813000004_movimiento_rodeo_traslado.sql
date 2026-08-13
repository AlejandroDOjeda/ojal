-- Traslado entre lotes: mueve cabezas de un Lote a otro del mismo Campo
-- (rotación de pastoreo). Se modela como DOS filas vinculadas de
-- MovimientoRodeo (una en el lote origen con Sentido='decremento', otra en
-- el lote destino con Sentido='incremento'), reutilizando la columna
-- Sentido que ya existía para ajuste_manual. Con dos filas, cualquier
-- agregado existente (footer "Neto" del historial, exports, etc.) sigue
-- sumando signo*Cabezas por fila sin casos especiales: las dos patas
-- netean a 0 en cuanto se ven juntas (ej. "todos los lotes" de un campo).
--
-- Id_LoteVinculado apunta a la otra pata del traslado (el lote destino
-- desde la fila de origen, y viceversa) para poder mostrar "-> Lote X" en
-- el historial sin una segunda consulta.

-- Nombre de constraint por convención de Postgres para un check inline sin
-- nombre en una sola columna (tabla_columna_check) — verificar contra la
-- base antes de aplicar si el nombre no coincide.
alter table public."MovimientoRodeo"
  drop constraint "MovimientoRodeo_TipoMovimiento_check";

alter table public."MovimientoRodeo"
  add constraint "MovimientoRodeo_TipoMovimiento_check"
  check ("TipoMovimiento" in ('compra', 'venta', 'nacimiento', 'muerte', 'ajuste_manual', 'traslado'));

alter table public."MovimientoRodeo"
  add column "Id_LoteVinculado" integer references public."Lote"("Id_Lote");

create index idx_movimiento_rodeo_lote_vinculado on public."MovimientoRodeo" ("Id_LoteVinculado");
