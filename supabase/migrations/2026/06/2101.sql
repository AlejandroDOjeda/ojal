-- =============================================================
-- 2101: entidad_legal
-- Clientes, proveedores y consignatarios.
-- El rol de cada entidad se infiere de las facturas donde aparece.
-- =============================================================

create table if not exists public.entidad_legal (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  razon_social  text        not null,
  cuit_cuil     text        not null,
  tipo_persona  text        not null check (tipo_persona in ('fisica', 'juridica')),
  condicion_iva text        not null check (condicion_iva in ('responsable_inscripto', 'monotributo', 'exento', 'consumidor_final')),
  email         text,
  telefono      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.entidad_legal enable row level security;

create policy "Usuarios gestionan sus entidades legales"
  on public.entidad_legal for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger trg_entidad_legal_updated_at
  before update on public.entidad_legal
  for each row execute procedure public.set_updated_at();
