-- =============================================================
-- 2104: factura
-- Cabecera de comprobantes: facturas A/B/C y liquidaciones de hacienda.
-- Los totales (subtotal, iva_10_5, iva_21, total) se calculan
-- desde la aplicación al confirmar la factura.
-- =============================================================

create table if not exists public.factura (
  id                uuid          primary key default gen_random_uuid(),
  user_id           uuid          not null references auth.users(id) on delete cascade,

  -- Clasificación del comprobante
  tipo_operacion    text          not null check (tipo_operacion in ('compra', 'venta')),
  tipo_comprobante  text          not null check (tipo_comprobante in ('A', 'B', 'C', 'liquidacion_hacienda')),

  -- Numeración (puede quedar en blanco para borradores)
  punto_venta       char(4),      -- '0001'
  numero            char(8),      -- '00000001'

  fecha             date          not null,
  entidad_legal_id  uuid          not null references public.entidad_legal(id),

  -- Condición de pago
  condicion_pago    text          not null default 'contado'
                                  check (condicion_pago in ('contado', 'cuenta_corriente')),
  fecha_vencimiento date,         -- Solo relevante si condicion_pago = 'cuenta_corriente'

  -- Ciclo de vida
  estado            text          not null default 'borrador'
                                  check (estado in ('borrador', 'confirmada', 'pagada', 'cobrada', 'anulada')),

  -- Totales calculados desde los ítems
  subtotal          numeric(15,2) not null default 0,
  iva_10_5          numeric(15,2) not null default 0,
  iva_21            numeric(15,2) not null default 0,
  total             numeric(15,2) not null default 0,

  observaciones     text,
  created_at        timestamptz   not null default now(),
  updated_at        timestamptz   not null default now(),

  -- No puede haber dos comprobantes del mismo tipo y número para el mismo usuario
  unique (user_id, tipo_comprobante, punto_venta, numero)
);

alter table public.factura enable row level security;

create policy "Usuarios gestionan sus facturas"
  on public.factura for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger trg_factura_updated_at
  before update on public.factura
  for each row execute procedure public.set_updated_at();

-- Índices para las consultas más frecuentes
create index idx_factura_user_fecha    on public.factura (user_id, fecha desc);
create index idx_factura_user_estado   on public.factura (user_id, estado);
create index idx_factura_entidad_legal on public.factura (entidad_legal_id);
