-- 20260710000001_factura_por_usuario.sql había reemplazado las policies
-- blanket de Rodeo/MovimientoRodeo por otras owner-scoped que verifican la
-- propiedad vía Id_Campo -> Campo.Id_Profile (cosa que la migración
-- anterior de este trabajo pasó por alto). Esas policies dependen de la
-- columna Id_Campo, así que bloquean el DROP COLUMN de abajo con
-- "cannot drop column ... because other objects depend on it" — hay que
-- reescribirlas primero para que verifiquen la propiedad vía
-- Id_Lote -> Lote -> Campo.Id_Profile.
--
-- De paso, la policy de Lote creada en 20260813000001 quedó blanket
-- ("Autenticados gestionan Lote" using (true)) porque en ese momento se
-- pensó que Rodeo/MovimientoRodeo/ItemHacienda seguían siendo blanket
-- también — dado que no es así, Lote se corrige acá para quedar
-- consistente con el resto: owner-scoped vía Campo.Id_Profile.

drop policy "Autenticados gestionan Lote" on public."Lote";
create policy "Propietario gestiona Lote"
  on public."Lote" for all to authenticated
  using (exists (
    select 1 from public."Campo" c
    where c."Id_Campo" = "Lote"."Id_Campo" and c."Id_Profile" = auth.uid()
  ))
  with check (exists (
    select 1 from public."Campo" c
    where c."Id_Campo" = "Lote"."Id_Campo" and c."Id_Profile" = auth.uid()
  ));

drop policy "Propietario gestiona Rodeo" on public."Rodeo";
create policy "Propietario gestiona Rodeo"
  on public."Rodeo" for all to authenticated
  using (exists (
    select 1 from public."Lote" l join public."Campo" c on c."Id_Campo" = l."Id_Campo"
    where l."Id_Lote" = "Rodeo"."Id_Lote" and c."Id_Profile" = auth.uid()
  ))
  with check (exists (
    select 1 from public."Lote" l join public."Campo" c on c."Id_Campo" = l."Id_Campo"
    where l."Id_Lote" = "Rodeo"."Id_Lote" and c."Id_Profile" = auth.uid()
  ));

drop policy "Propietario gestiona MovimientoRodeo" on public."MovimientoRodeo";
create policy "Propietario gestiona MovimientoRodeo"
  on public."MovimientoRodeo" for all to authenticated
  using (exists (
    select 1 from public."Lote" l join public."Campo" c on c."Id_Campo" = l."Id_Campo"
    where l."Id_Lote" = "MovimientoRodeo"."Id_Lote" and c."Id_Profile" = auth.uid()
  ))
  with check (exists (
    select 1 from public."Lote" l join public."Campo" c on c."Id_Campo" = l."Id_Campo"
    where l."Id_Lote" = "MovimientoRodeo"."Id_Lote" and c."Id_Profile" = auth.uid()
  ));

-- ItemHacienda no tiene policy dependiente de Id_Campo (su ownership se
-- verifica vía Factura.Id_Profile, ver 20260710000001), así que su DROP
-- COLUMN no tiene este problema.


-- Borra Id_Campo de Rodeo/MovimientoRodeo/ItemHacienda: Campo ahora se
-- deriva vía Lote.Id_Campo. Seguro recién acá porque 20260813000002 ya
-- reescribió sync_rodeo_from_item_hacienda para no depender de esta
-- columna, y las policies de arriba ya no la referencian.
--
-- Postgres borra automáticamente los índices que dependen exclusivamente
-- de la columna (idx_rodeo_campo, idx_movimiento_campo,
-- idx_item_hacienda_campo) junto con el DROP COLUMN.

alter table public."Rodeo"           drop column "Id_Campo";
alter table public."MovimientoRodeo" drop column "Id_Campo";
alter table public."ItemHacienda"    drop column "Id_Campo";
