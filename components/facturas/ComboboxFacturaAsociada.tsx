"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Combobox } from "@/components/app";
import { TIPO_COMPROBANTE_ITEMS, NOTA_CREDITO_ID, NOTA_DEBITO_ID } from "@/lib/opciones";
import { formatARS } from "./types";

type FacturaCandidata = {
  Id_Factura: number;
  Id_TipoComprobante: number | null;
  PuntoVenta: string | null;
  Numero: string | null;
  Total: number;
};

type Props = {
  idTipoOperacion: number;
  idEntidadLegal: string; // "" si todavía no se eligió entidad
  excluirIdFactura?: number;
  value: string;
  onValueChange: (value: string) => void;
  error?: boolean;
};

const IDS_NOTA = [NOTA_CREDITO_ID, NOTA_DEBITO_ID];

// Comprobantes que puede corregir una Nota de Crédito/Débito: cualquier
// factura de la misma entidad y tipo de operación, salvo otra Nota (evita
// que una NC/ND termine referenciando a otra NC/ND).
export function ComboboxFacturaAsociada({ idTipoOperacion, idEntidadLegal, excluirIdFactura, value, onValueChange, error }: Props) {
  const [facturas, setFacturas] = useState<FacturaCandidata[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!idEntidadLegal) { setFacturas([]); return; }
    let cancelado = false;
    setLoading(true);

    let query = supabase
      .from("Factura")
      .select("Id_Factura, Id_TipoComprobante, PuntoVenta, Numero, Total")
      .eq("Id_TipoOperacion", idTipoOperacion)
      .eq("Id_EntidadLegal", parseInt(idEntidadLegal))
      .not("Id_TipoComprobante", "in", `(${IDS_NOTA.join(",")})`)
      .order("Fecha", { ascending: false })
      .limit(50);
    if (excluirIdFactura) query = query.neq("Id_Factura", excluirIdFactura);

    query.then(({ data }) => {
      if (cancelado) return;
      setFacturas((data ?? []) as FacturaCandidata[]);
      setLoading(false);
    });

    return () => { cancelado = true; };
  }, [idTipoOperacion, idEntidadLegal, excluirIdFactura]);

  const options = facturas.map((f) => ({
    value: f.Id_Factura,
    label: `${TIPO_COMPROBANTE_ITEMS[String(f.Id_TipoComprobante)] ?? "—"} ${f.PuntoVenta ?? "?????"}-${f.Numero ?? "????????"} · ${formatARS(f.Total)}`,
  }));

  return (
    <Combobox
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder={!idEntidadLegal ? "Elegí primero la entidad" : loading ? "Cargando..." : "— Seleccioná —"}
      disabled={!idEntidadLegal}
      error={error}
    />
  );
}
