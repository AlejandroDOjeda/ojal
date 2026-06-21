-- =============================================================
-- 2100: profile
-- Datos fiscales propios del usuario. Extiende auth.users.
-- Se crea automáticamente al registrarse un nuevo usuario.
-- =============================================================

create table if not exists public.profile (
  id            uuid        primary key references auth.users(id) on delete cascade,
  razon_social  text,
  cuit_cuil     text,
  tipo_persona  text        check (tipo_persona in ('fisica', 'juridica')),
  condicion_iva text        check (condicion_iva in ('responsable_inscripto', 'monotributo', 'exento', 'consumidor_final')),
  telefono      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profile enable row level security;

create policy "Usuarios ven su propio perfil"
  on public.profile for select
  using (auth.uid() = id);

create policy "Usuarios actualizan su propio perfil"
  on public.profile for update
  using (auth.uid() = id);

create policy "Usuarios insertan su propio perfil"
  on public.profile for insert
  with check (auth.uid() = id);

-- ---------------------------------------------------------------
-- Función genérica para mantener updated_at actualizado.
-- Se reutiliza en todas las tablas que lo necesiten.
-- ---------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profile_updated_at
  before update on public.profile
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------
-- Trigger: crea el perfil vacío cuando un usuario se registra.
-- ---------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profile (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
