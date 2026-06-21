-- =============================================================
-- 2105: item_hacienda
-- Líneas de factura que corresponden a compra o venta de ganado.
-- Soporta dos modalidades de precio:
--   A) Por peso: cabezas × kg_promedio × precio_por_kg  (remate/feria)
--   B) Por cabeza: cabezas × precio_por_cabeza           (trato directo)
-- El constraint precio_valido fuerza que se use exactamente una.
-- =============================================================

create table if not exists public.item_hacienda (
  id                     uuid          primary key default gen_random_uuid(),
  factura_id             uuid          not null references public.factura(id) on delete cascade,
  categoria_hacienda_id  uuid          not null references public.categoria_hacienda(id),

  cabezas                integer       not null check (cabezas > 0),

  -- Modalidad A: precio por peso vivo (feria / consignatario)
  kg_promedio            numeric(8,2),
  precio_por_kg          numeric(10,4),

  -- Modalidad B: precio por cabeza (venta directa)
  precio_por_cabeza      numeric(12,2),

  tasa_iva               numeric(5,2)  not null default 10.5,
  subtotal               numeric(15,2) not null,   -- sin IVA

  created_at             timestamptz   not null default now(),

  constraint precio_valido check (
    (kg_promedio is not null and precio_por_kg is not null and precio_por_cabeza is null)
    or
    (kg_promedio is null and precio_por_kg is null and precio_por_cabeza is not null)
  )
);

alter table public.item_hacienda enable row level security;

-- RLS heredada de la factura padre
create policy "Usuarios gestionan sus items de hacienda"
  on public.item_hacienda for all
  using (
    exists (
      select 1 from public.factura
      where factura.id = item_hacienda.factura_id
        and factura.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.factura
      where factura.id = item_hacienda.factura_id
        and factura.user_id = auth.uid()
    )
  );

create index idx_item_hacienda_factura   on public.item_hacienda (factura_id);
create index idx_item_hacienda_categoria on public.item_hacienda (categoria_hacienda_id);
