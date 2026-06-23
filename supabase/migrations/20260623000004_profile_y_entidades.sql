-- Profile: aislado por usuario. Id_Profile = UUID de auth.users (no autoincremental).
-- EntidadLegal: compartida, usa FKs a tablas de referencia.

create table public."Profile" (
  "Id_Profile"      uuid         primary key references auth.users(id) on delete cascade,
  "Nombre"          text,
  "Apellido"        text,
  "RazonSocial"     text,
  "CuitCuil"        text,
  "Id_TipoPersona"  integer      references public."TipoPersona"("Id_TipoPersona"),
  "Id_CondicionIva" integer      references public."CondicionIva"("Id_CondicionIva"),
  "Telefono"        text,
  "CreatedAt"       timestamptz  not null default now(),
  "UpdatedAt"       timestamptz  not null default now()
);
alter table public."Profile" enable row level security;
create policy "Usuarios ven su propio perfil"
  on public."Profile" for select using (auth.uid() = "Id_Profile");
create policy "Usuarios actualizan su propio perfil"
  on public."Profile" for update using (auth.uid() = "Id_Profile");
create policy "Usuarios insertan su propio perfil"
  on public."Profile" for insert with check (auth.uid() = "Id_Profile");

create trigger trg_profile_updated_at
  before update on public."Profile"
  for each row execute procedure public.set_updated_at();

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


create table public."EntidadLegal" (
  "Id_EntidadLegal" integer      generated always as identity primary key,
  "RazonSocial"     text         not null,
  "CuitCuil"        text         not null,
  "Id_TipoPersona"  integer      not null references public."TipoPersona"("Id_TipoPersona"),
  "Id_CondicionIva" integer      not null references public."CondicionIva"("Id_CondicionIva"),
  "Email"           text,
  "Telefono"        text,
  "CreatedAt"       timestamptz  not null default now(),
  "UpdatedAt"       timestamptz  not null default now()
);
alter table public."EntidadLegal" enable row level security;
create policy "Autenticados gestionan EntidadLegal"
  on public."EntidadLegal" for all to authenticated using (true) with check (true);

create trigger trg_entidad_legal_updated_at
  before update on public."EntidadLegal"
  for each row execute procedure public.set_updated_at();
