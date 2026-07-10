-- Factura pasa a pertenecer a un usuario (Id_Profile). Hasta ahora no tenía
-- ningún vínculo directo con el usuario que la carga: el único camino era
-- ItemHacienda -> Campo -> Profile, que no cubre las facturas de compra de
-- gasto puro (combustible, veterinaria, etc.), que no tienen Campo.
-- Esto además cerraba una RLS abierta ("Autenticados gestionan Factura"
-- using (true)): cualquier usuario autenticado podía ver y editar las
-- facturas de todos los demás.

alter table public."Factura"
  add column "Id_Profile" uuid references public."Profile"("Id_Profile") on delete cascade;

-- Backfill defensivo (no debería haber filas: entorno sin datos reales
-- todavía). Mismo criterio que usó 20260704000001_campo.sql para
-- Rodeo/Factura/MovimientoRodeo: asignar al único perfil existente.
update public."Factura"
set "Id_Profile" = (select "Id_Profile" from public."Profile" limit 1)
where "Id_Profile" is null;

alter table public."Factura" alter column "Id_Profile" set not null;

create index idx_factura_profile on public."Factura" ("Id_Profile");

drop policy "Autenticados gestionan Factura" on public."Factura";
create policy "Propietario gestiona Factura"
  on public."Factura" for all to authenticated
  using ("Id_Profile" = auth.uid())
  with check ("Id_Profile" = auth.uid());


-- ItemHacienda e ItemGasto: la propiedad se hereda de la Factura a la que
-- pertenecen (no del Campo del ítem — ItemGasto ni siquiera tiene Campo).

drop policy "Autenticados gestionan ItemHacienda" on public."ItemHacienda";
create policy "Propietario gestiona ItemHacienda"
  on public."ItemHacienda" for all to authenticated
  using (exists (
    select 1 from public."Factura" f
    where f."Id_Factura" = "ItemHacienda"."Id_Factura" and f."Id_Profile" = auth.uid()
  ))
  with check (exists (
    select 1 from public."Factura" f
    where f."Id_Factura" = "ItemHacienda"."Id_Factura" and f."Id_Profile" = auth.uid()
  ));

drop policy "Autenticados gestionan ItemGasto" on public."ItemGasto";
create policy "Propietario gestiona ItemGasto"
  on public."ItemGasto" for all to authenticated
  using (exists (
    select 1 from public."Factura" f
    where f."Id_Factura" = "ItemGasto"."Id_Factura" and f."Id_Profile" = auth.uid()
  ))
  with check (exists (
    select 1 from public."Factura" f
    where f."Id_Factura" = "ItemGasto"."Id_Factura" and f."Id_Profile" = auth.uid()
  ));


-- Rodeo y MovimientoRodeo ya tienen Id_Campo: la propiedad se hereda del
-- Campo, que a su vez ya está scoped por Id_Profile.

drop policy "Autenticados gestionan Rodeo" on public."Rodeo";
create policy "Propietario gestiona Rodeo"
  on public."Rodeo" for all to authenticated
  using (exists (
    select 1 from public."Campo" c
    where c."Id_Campo" = "Rodeo"."Id_Campo" and c."Id_Profile" = auth.uid()
  ))
  with check (exists (
    select 1 from public."Campo" c
    where c."Id_Campo" = "Rodeo"."Id_Campo" and c."Id_Profile" = auth.uid()
  ));

drop policy "Autenticados gestionan MovimientoRodeo" on public."MovimientoRodeo";
create policy "Propietario gestiona MovimientoRodeo"
  on public."MovimientoRodeo" for all to authenticated
  using (exists (
    select 1 from public."Campo" c
    where c."Id_Campo" = "MovimientoRodeo"."Id_Campo" and c."Id_Profile" = auth.uid()
  ))
  with check (exists (
    select 1 from public."Campo" c
    where c."Id_Campo" = "MovimientoRodeo"."Id_Campo" and c."Id_Profile" = auth.uid()
  ));

-- EntidadLegal queda sin cambios: es dato global/compartido entre usuarios
-- (clientes, proveedores, consignatarios), decisión explícita del usuario.
