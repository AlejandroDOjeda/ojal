-- Seed Rodeo: una fila por categoría con stock inicial en 0.
-- El usuario ajustará el stock real desde la UI (carga inicial del rodeo).

insert into public."Rodeo" ("Id_CategoriaHacienda", "Cabezas")
select "Id_CategoriaHacienda", 0
from public."CategoriaHacienda"
where "Activa" = true;
