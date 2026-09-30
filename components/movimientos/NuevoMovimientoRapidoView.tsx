"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageShell, SectionCard, FormField, SelectBox, Combobox } from "@/components/app";
import type { CategoriaOption, LoteOption } from "./NuevoMovimientoRapidoContainer";

export type MovimientoFormData = {
  idLote: number;
  tipoMovimiento: "nacimiento" | "muerte" | "ajuste_manual" | "traslado";
  sentidoAjuste: "incremento" | "decremento";
  idCategoriaHacienda: number;
  nombreCategoria: string;
  cabezas: number;
  fecha: string;
  observaciones: string;
  idLoteDestino: number | null;
};

const TIPO_OPTIONS = [
  { value: "nacimiento", label: "Nacimiento / Parición" },
  { value: "muerte",     label: "Muerte / Pérdida" },
  { value: "ajuste_manual", label: "Ajuste manual" },
  { value: "traslado",   label: "Traslado a otro lote" },
] as const;

const SENTIDO_OPTIONS = [
  { value: "incremento", label: "Incremento (suma cabezas)" },
  { value: "decremento", label: "Decremento (resta cabezas)" },
] as const;

type Props = {
  categorias: CategoriaOption[];
  lotes: LoteOption[];
  loading: boolean;
  onGuardar: (form: MovimientoFormData) => Promise<void>;
};

const hoy = () => new Date().toISOString().split("T")[0];

export default function NuevoMovimientoRapidoView({ categorias, lotes, loading, onGuardar }: Props) {
  const [idLote, setIdLote] = useState<string>("");
  const [tipo, setTipo] = useState<MovimientoFormData["tipoMovimiento"] | "">("");
  const [sentido, setSentido] = useState<MovimientoFormData["sentidoAjuste"]>("incremento");
  const [idCategoria, setIdCategoria] = useState<string>("");
  const [idLoteDestino, setIdLoteDestino] = useState<string>("");
  const [cabezas, setCabezas] = useState<string>("");
  const [fecha, setFecha] = useState<string>(hoy());
  const [observaciones, setObservaciones] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loteSeleccionado = lotes.find((l) => l.Id_Lote === Number(idLote));
  const esTraslado = tipo === "traslado";
  const otrosLotes = loteSeleccionado
    ? lotes.filter((l) => l.Id_Campo === loteSeleccionado.Id_Campo && l.Id_Lote !== loteSeleccionado.Id_Lote)
    : [];

  const handleLoteChange = (v: string) => {
    setIdLote(v);
    setTipo(""); setIdLoteDestino("");
    setErrors((p) => ({ ...p, lote: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!idLote) e.lote = "Seleccioná un lote.";
    if (!tipo) e.tipo = "Seleccioná el tipo de movimiento.";
    if (!idCategoria) e.categoria = "Seleccioná una categoría.";
    const cab = parseInt(cabezas, 10);
    if (!cabezas || isNaN(cab) || cab <= 0) e.cabezas = "Ingresá una cantidad mayor a 0.";
    if (!fecha) e.fecha = "Ingresá una fecha.";
    if (esTraslado && !idLoteDestino) e.loteDestino = "Seleccioná el lote destino.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setGuardando(true);
    try {
      const cat = categorias.find((c) => c.Id_CategoriaHacienda === Number(idCategoria));
      await onGuardar({
        idLote: Number(idLote),
        tipoMovimiento: tipo as MovimientoFormData["tipoMovimiento"],
        sentidoAjuste: sentido,
        idCategoriaHacienda: Number(idCategoria),
        nombreCategoria: cat?.Nombre ?? "",
        cabezas: parseInt(cabezas, 10),
        fecha,
        observaciones,
        idLoteDestino: idLoteDestino ? Number(idLoteDestino) : null,
      });
      toast.success("Movimiento registrado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar.");
      setGuardando(false);
    }
  };

  const loteOptions = lotes.map((l) => ({ value: l.Id_Lote, label: `${l.CampoNombre} — ${l.Nombre}` }));
  const categoriaOptions = categorias.map((c) => ({ value: c.Id_CategoriaHacienda, label: c.Nombre }));
  const loteDestinoOptions = otrosLotes.map((l) => ({ value: l.Id_Lote, label: l.Nombre }));
  const tipoOptions = TIPO_OPTIONS.filter((o) => o.value !== "traslado" || otrosLotes.length >= 1);

  return (
    <PageShell title="Nuevo movimiento">
      <div className="max-w-lg space-y-5">
        <SectionCard>
          <FormField label="Lote" required error={errors.lote}>
            <Combobox
              options={loteOptions}
              value={idLote || null}
              onValueChange={handleLoteChange}
              placeholder={loading ? "Cargando…" : "— Seleccioná un lote —"}
              disabled={loading}
              error={!!errors.lote}
            />
          </FormField>
        </SectionCard>

        {idLote && (
          <form onSubmit={handleSubmit}>
            <SectionCard className="space-y-5">

              {/* Tipo de movimiento */}
              <FormField label="Tipo de movimiento" required error={errors.tipo}>
                <SelectBox
                  options={tipoOptions}
                  value={tipo || null}
                  onValueChange={(v) => { setTipo(v as MovimientoFormData["tipoMovimiento"]); setErrors((p) => ({ ...p, tipo: "" })); }}
                  placeholder="— Seleccioná —"
                  error={!!errors.tipo}
                />
              </FormField>

              {/* Sentido del ajuste (solo para ajuste_manual) */}
              {tipo === "ajuste_manual" && (
                <FormField label="Sentido del ajuste" required>
                  <SelectBox
                    options={SENTIDO_OPTIONS}
                    value={sentido}
                    onValueChange={(v) => setSentido(v as MovimientoFormData["sentidoAjuste"])}
                  />
                </FormField>
              )}

              {/* Lote destino (traslado) */}
              {esTraslado && (
                <FormField label="Lote destino" required error={errors.loteDestino}>
                  <SelectBox
                    options={loteDestinoOptions}
                    value={idLoteDestino || null}
                    onValueChange={(v) => { setIdLoteDestino(v); setErrors((p) => ({ ...p, loteDestino: "" })); }}
                    placeholder="— Seleccioná —"
                    error={!!errors.loteDestino}
                  />
                </FormField>
              )}

              {/* Categoría */}
              <FormField label="Categoría" required error={errors.categoria}>
                <SelectBox
                  options={categoriaOptions}
                  value={idCategoria || null}
                  onValueChange={(v) => { setIdCategoria(v); setErrors((p) => ({ ...p, categoria: "" })); }}
                  placeholder="— Seleccioná —"
                  error={!!errors.categoria}
                />
              </FormField>

              {/* Cabezas */}
              <FormField label="Cabezas" required error={errors.cabezas}>
                <Input
                  type="number"
                  min={1}
                  value={cabezas}
                  onChange={(e) => { setCabezas(e.target.value); setErrors((p) => ({ ...p, cabezas: "" })); }}
                  placeholder="Ej: 5"
                  className="w-36"
                />
              </FormField>

              {/* Fecha */}
              <FormField label="Fecha" required error={errors.fecha}>
                <Input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-44"
                />
              </FormField>

              {/* Observaciones */}
              <FormField label="Observaciones">
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={3}
                  placeholder="Opcional — ej: parición de vaca 14, campo norte"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </FormField>
            </SectionCard>

            <div className="mt-5">
              <Button type="submit" disabled={guardando}>
                {guardando ? "Guardando…" : "Registrar movimiento"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </PageShell>
  );
}
