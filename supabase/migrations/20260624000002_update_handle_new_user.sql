-- Actualiza handle_new_user para leer datos de perfil desde raw_user_meta_data.
-- Los campos opcionales se pasan via options.data en supabase.auth.signUp().

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public."Profile" (
    "Id_Profile",
    "Nombre",
    "Apellido",
    "RazonSocial",
    "CuitCuil",
    "Id_TipoPersona",
    "Id_CondicionIva",
    "Telefono"
  ) values (
    new.id,
    nullif(trim(meta->>'nombre'), ''),
    nullif(trim(meta->>'apellido'), ''),
    nullif(trim(meta->>'razonSocial'), ''),
    nullif(trim(meta->>'cuitCuil'), ''),
    case when (meta->>'idTipoPersona') is not null then (meta->>'idTipoPersona')::integer else null end,
    case when (meta->>'idCondicionIva') is not null then (meta->>'idCondicionIva')::integer else null end,
    nullif(trim(meta->>'telefono'), '')
  );
  return new;
end;
$$;
