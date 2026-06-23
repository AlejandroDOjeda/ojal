-- Funciones auxiliares reutilizadas por triggers en toda la app.
-- Deben crearse antes que cualquier tabla que las use.

-- Actualiza automáticamente UpdatedAt en cada UPDATE
create function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new."UpdatedAt" = now();
  return new;
end;
$$;

-- Crea un perfil vacío cuando un nuevo usuario se registra
create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public."Profile" ("Id_Profile") values (new.id);
  return new;
end;
$$;
