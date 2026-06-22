-- =============================================================
-- 2108: agregar nombre y apellido a profile
-- Para persona física se usan nombre + apellido.
-- Para persona jurídica se usa razon_social.
-- Ambos casos pueden coexistir en el mismo perfil.
-- =============================================================

alter table public.profile
  add column if not exists nombre   text,
  add column if not exists apellido text;
