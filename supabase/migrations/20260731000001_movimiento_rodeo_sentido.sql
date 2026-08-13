-- Para "ajuste_manual", Cabezas se guarda siempre positivo (check Cabezas > 0)
-- y el sentido (incremento/decremento) solo vivía en el form al momento de
-- guardar, sin persistirse. Sin esto no hay forma de saber, mirando el
-- historial, si un ajuste sumó o restó cabezas. Los registros existentes
-- quedan con Sentido null (se muestran neutros en el historial).
alter table public."MovimientoRodeo"
  add column "Sentido" text check ("Sentido" in ('incremento', 'decremento'));
