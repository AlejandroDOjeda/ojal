// Lógica de escritura de MovimientoRodeo/Rodeo compartida entre el formulario
// de movimiento scopeado a un lote (components/campos/lote/NuevoMovimientoContainer)
// y el acceso rápido sin drill-down (components/movimientos/NuevoMovimientoRapidoContainer).

import { supabase } from "@/lib/supabaseClient";

export type TipoMovimientoSimple = "nacimiento" | "muerte" | "ajuste_manual";
export type SentidoAjuste = "incremento" | "decremento";

async function ajustarStockLote(idLote: number, idCategoriaHacienda: number, delta: number, nombreCategoria: string) {
  const { data: rodeoRow, error: rodeoError } = await supabase
    .from("Rodeo")
    .select("Id_Rodeo, Cabezas")
    .eq("Id_Lote", idLote)
    .eq("Id_CategoriaHacienda", idCategoriaHacienda)
    .single();

  if (rodeoError || !rodeoRow) {
    throw new Error("No se encontró la categoría en el rodeo del lote.");
  }

  const nuevoCabezas = rodeoRow.Cabezas + delta;
  if (nuevoCabezas < 0) {
    throw new Error(`Stock insuficiente. Stock actual de ${nombreCategoria}: ${rodeoRow.Cabezas} cabezas.`);
  }

  const { error: updateError } = await supabase
    .from("Rodeo")
    .update({ Cabezas: nuevoCabezas })
    .eq("Id_Rodeo", rodeoRow.Id_Rodeo);
  if (updateError) throw new Error(updateError.message);

  return { idRodeo: rodeoRow.Id_Rodeo, cabezasActuales: rodeoRow.Cabezas, nuevoCabezas };
}

export type RegistrarMovimientoSimpleParams = {
  idLote: number;
  tipoMovimiento: TipoMovimientoSimple;
  sentidoAjuste: SentidoAjuste;
  idCategoriaHacienda: number;
  nombreCategoria: string;
  cabezas: number;
  fecha: string;
  observaciones: string;
};

export async function registrarMovimientoSimple(params: RegistrarMovimientoSimpleParams): Promise<void> {
  const esResta =
    params.tipoMovimiento === "muerte" ||
    (params.tipoMovimiento === "ajuste_manual" && params.sentidoAjuste === "decremento");
  const delta = esResta ? -params.cabezas : params.cabezas;

  // Verificar stock suficiente antes de registrar nada.
  const { data: rodeoRow, error: rodeoError } = await supabase
    .from("Rodeo")
    .select("Id_Rodeo, Cabezas")
    .eq("Id_Lote", params.idLote)
    .eq("Id_CategoriaHacienda", params.idCategoriaHacienda)
    .single();
  if (rodeoError || !rodeoRow) throw new Error("No se encontró la categoría en el rodeo del lote.");
  const nuevoCabezas = rodeoRow.Cabezas + delta;
  if (nuevoCabezas < 0) {
    throw new Error(`Stock insuficiente. Stock actual de ${params.nombreCategoria}: ${rodeoRow.Cabezas} cabezas.`);
  }

  const { error: movError } = await supabase.from("MovimientoRodeo").insert({
    Id_Lote: params.idLote,
    TipoMovimiento: params.tipoMovimiento,
    Id_CategoriaHacienda: params.idCategoriaHacienda,
    Cabezas: params.cabezas,
    Fecha: params.fecha,
    Observaciones: params.observaciones || null,
    Sentido: params.tipoMovimiento === "ajuste_manual" ? params.sentidoAjuste : null,
  });
  if (movError) throw new Error(movError.message);

  const { error: updateError } = await supabase
    .from("Rodeo")
    .update({ Cabezas: nuevoCabezas })
    .eq("Id_Rodeo", rodeoRow.Id_Rodeo);
  if (updateError) throw new Error(updateError.message);
}

export type RegistrarTrasladoParams = {
  idLoteOrigen: number;
  idLoteDestino: number;
  idCategoriaHacienda: number;
  nombreCategoria: string;
  cabezas: number;
  fecha: string;
  observaciones: string;
};

export async function registrarTraslado(params: RegistrarTrasladoParams): Promise<void> {
  // Decrementar origen primero (protegido por el check Cabezas >= 0),
  // recién después incrementar destino.
  await ajustarStockLote(params.idLoteOrigen, params.idCategoriaHacienda, -params.cabezas, params.nombreCategoria);
  await ajustarStockLote(params.idLoteDestino, params.idCategoriaHacienda, params.cabezas, params.nombreCategoria);

  const { error: movError } = await supabase.from("MovimientoRodeo").insert([
    {
      Id_Lote: params.idLoteOrigen,
      TipoMovimiento: "traslado",
      Sentido: "decremento",
      Id_CategoriaHacienda: params.idCategoriaHacienda,
      Cabezas: params.cabezas,
      Fecha: params.fecha,
      Observaciones: params.observaciones || null,
      Id_LoteVinculado: params.idLoteDestino,
    },
    {
      Id_Lote: params.idLoteDestino,
      TipoMovimiento: "traslado",
      Sentido: "incremento",
      Id_CategoriaHacienda: params.idCategoriaHacienda,
      Cabezas: params.cabezas,
      Fecha: params.fecha,
      Observaciones: params.observaciones || null,
      Id_LoteVinculado: params.idLoteOrigen,
    },
  ]);
  if (movError) throw new Error(movError.message);
}
