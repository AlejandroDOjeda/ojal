-- =============================================================
-- 2107: políticas CRUD para categoria_hacienda y categoria_gasto
-- Las tablas son globales (sin user_id) pero gestionadas por
-- usuarios autenticados. Se agrega INSERT, UPDATE y DELETE.
-- DELETE falla automáticamente si la categoría está en uso
-- (FK desde item_hacienda / item_gasto), protegiendo la integridad.
-- =============================================================

-- categoria_hacienda
create policy "Usuarios autenticados pueden insertar categoria de hacienda"
  on public.categoria_hacienda for insert
  to authenticated
  with check (true);

create policy "Usuarios autenticados pueden actualizar categoria de hacienda"
  on public.categoria_hacienda for update
  to authenticated
  using (true);

create policy "Usuarios autenticados pueden eliminar categoria de hacienda"
  on public.categoria_hacienda for delete
  to authenticated
  using (true);

-- categoria_gasto
create policy "Usuarios autenticados pueden insertar categoria de gasto"
  on public.categoria_gasto for insert
  to authenticated
  with check (true);

create policy "Usuarios autenticados pueden actualizar categoria de gasto"
  on public.categoria_gasto for update
  to authenticated
  using (true);

create policy "Usuarios autenticados pueden eliminar categoria de gasto"
  on public.categoria_gasto for delete
  to authenticated
  using (true);
