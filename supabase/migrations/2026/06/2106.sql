-- =============================================================
-- 2106: item_gasto
-- Líneas de factura de compras generales (combustible, veterinaria, etc.)
-- El subtotal se guarda sin IVA; el IVA se calcula desde la aplicación.
-- =============================================================

create table if not exists public.item_gasto (
  id                 uuid          primary key default gen_random_uuid(),
  factura_id         uuid          not null references public.factura(id) on delete cascade,
  descripcion        text          not null,
  categoria_gasto_id uuid          references public.categoria_gasto(id),  -- nullable

  cantidad           numeric(10,3) not null default 1 check (cantidad > 0),
  precio_unitario    numeric(12,2) not null check (precio_unitario >= 0),
  tasa_iva           numeric(5,2)  not null default 21.0,
  subtotal           numeric(15,2) not null,   -- cantidad × precio_unitario, sin IVA

  created_at         timestamptz   not null default now()
);

alter table public.item_gasto enable row level security;

-- RLS heredada de la factura padre
create policy "Usuarios gestionan sus items de gasto"
  on public.item_gasto for all
  using (
    exists (
      select 1 from public.factura
      where factura.id = item_gasto.factura_id
        and factura.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.factura
      where factura.id = item_gasto.factura_id
        and factura.user_id = auth.uid()
    )
  );

create index idx_item_gasto_factura   on public.item_gasto (factura_id);
create index idx_item_gasto_categoria on public.item_gasto (categoria_gasto_id);
