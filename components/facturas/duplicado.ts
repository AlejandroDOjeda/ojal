// Evita cargar dos veces la misma factura de un proveedor/cliente: misma
// entidad, mismo punto de venta y mismo número (dentro del mismo tipo de
// operación, compra o venta).

import { supabase } from "@/lib/supabaseClient";

export const MENSAJE_DUPLICADA_COMPRA = "Ya existe una factura de este proveedor con el mismo punto de venta y número.";
export const MENSAJE_DUPLICADA_VENTA  = "Ya existe una factura de este cliente con el mismo punto de venta y número.";

export async function existeFacturaDuplicada(params: {
  idTipoOperacion: number;
  idEntidadLegal: number;
  puntoVenta: string;
  numero: string;
  excluirIdFactura?: number;
}): Promise<boolean> {
  let query = supabase
    .from("Factura")
    .select("Id_Factura")
    .eq("Id_TipoOperacion", params.idTipoOperacion)
    .eq("Id_EntidadLegal", params.idEntidadLegal)
    .eq("PuntoVenta", params.puntoVenta)
    .eq("Numero", params.numero);

  if (params.excluirIdFactura) {
    query = query.neq("Id_Factura", params.excluirIdFactura);
  }

  const { data, error } = await query.limit(1);
  if (error) throw new Error(error.message);
  return (data ?? []).length > 0;
}

// El chequeo de arriba corre antes de guardar, pero además hay un índice
// único en la base (idx_factura_unica_por_entidad) como respaldo ante una
// carrera entre dos guardados simultáneos. Si ese índice es el que frena el
// insert/update, mostramos el mismo mensaje amigable en vez del error crudo
// de Postgres (code 23505 = unique_violation).
export function esErrorDeFacturaDuplicada(error: { code?: string } | null): boolean {
  return error?.code === "23505";
}
