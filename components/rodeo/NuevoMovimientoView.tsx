"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageShell, SectionCard, FormField, SelectBox } from "@/components/app";
import type { Campo } from "@/contexts/CampoContext";
import type { CategoriaOption, LoteOption } from "./NuevoMovimientoContainer";

export type MovimientoFormData = {
  tipoMovimiento: "nacimiento" | "muerte" | "ajuste_manual" | "traslado";
  sentidoAjuste: "incremento" | "decremento";
  idCategoriaHacienda: number;
  nombreCategoria: string;
  cabezas: number;
  fecha: string;
  observaciones: string;
  idLote: number | null;
  idLoteOrigen: number | null;
  idLoteDestino: number | null;
};

const TIPO_OPTIONS = [
  { value: "nacimiento", label: "Nacimiento / Parición" },
  { value: "muerte",     label: "Muerte / Pérdida" },
  { value: "ajuste_manual", label: "Ajuste manual" },
  { value: "traslado",   label: "Traslado entre lotes" },
] as const;

const SENTIDO_OPTIONS = [
  { value: "incremento", label: "Incremento (suma cabezas)" },
  { value: "decremento", label: "Decremento (resta cabezas)" },
] as const;

type Props = {
  categorias: CategoriaOption[];
  campos: Campo[];
  campoId: number | null;
  onCampoChange: (campoId: number | null) => void;
  lotes: LoteOption[];
  loading: boolean;
  sinLotes: boolean;
  onGuardar: (form: MovimientoFormData) => Promise<void>;
};

const hoy = () => new Date().toISOString().split("T")[0];

export default function NuevoMovimientoView({ categorias, campos, campoId, onCampoChange, lotes, loading, sinLotes, onGuardar }: Props) {
  const [tipo, setTipo] = useState<MovimientoFormData["tipoMovimiento"] | "">("");
  const [sentido, setSentido] = useState<MovimientoFormData["sentidoAjuste"]>("incremento");
  const [idCategoria, setIdCategoria] = useState<string>("");
  const [idLote, setIdLote] = useState<string>("");
  const [idLoteOrigen, setIdLoteOrigen] = useState<string>("");
  const [idLoteDestino, setIdLoteDestino] = useState<string>("");
  const [cabezas, setCabezas] = useState<string>("");
  const [fecha, setFecha] = useState<string>(hoy());
  const [observaciones, setObservaciones] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const esTraslado = tipo === "traslado";

  // Al cambiar de campo, los lotes elegidos antes ya no son válidos.
  useEffect(() => {
    setIdLote(""); setIdLoteOrigen(""); setIdLoteDestino("");
  }, [campoId]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!tipo) e.tipo = "Seleccioná el tipo de movimiento.";
    if (!idCategoria) e.categoria = "Seleccioná una categoría.";
    const cab = parseInt(cabezas, 10);
    if (!cabezas || isNaN(cab) || cab <= 0) e.cabezas = "Ingresá una cantidad mayor a 0.";
    if (!fecha) e.fecha = "Ingresá una fecha.";
    if (esTraslado) {
      if (!idLoteOrigen) e.loteOrigen = "Seleccioná el lote origen.";
      if (!idLoteDestino) e.loteDestino = "Seleccioná el lote destino.";
      if (idLoteOrigen && idLoteDestino && idLoteOrigen === idLoteDestino) {
        e.loteDestino = "Tiene que ser distinto del lote origen.";
      }
    } else if (tipo) {
      if (!idLote) e.lote = "Seleccioná un lote.";
    }
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
        tipoMovimiento: tipo as MovimientoFormData["tipoMovimiento"],
        sentidoAjuste: sentido,
        idCategoriaHacienda: Number(idCategoria),
        nombreCategoria: cat?.Nombre ?? "",
        cabezas: parseInt(cabezas, 10),
        fecha,
        observaciones,
        idLote: idLote ? Number(idLote) : null,
        idLoteOrigen: idLoteOrigen ? Number(idLoteOrigen) : null,
        idLoteDestino: idLoteDestino ? Number(idLoteDestino) : null,
      });
      toast.success("Movimiento registrado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  const campoOptions = campos.map((c) => ({ value: c.Id_Campo, label: c.Nombre }));
  const categoriaOptions = categorias.map((c) => ({
    value: c.Id_CategoriaHacienda,
    label: c.Nombre,
  }));
  const loteOptions = lotes.map((l) => ({ value: l.Id_Lote, label: l.Nombre }));
  const tipoOptions = TIPO_OPTIONS.filter((o) => o.value !== "traslado" || lotes.length >= 2);

  const volver = (
    <Link href="/rodeo" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
      <ArrowLeft size={14} />
      Volver al rodeo
    </Link>
  );

  return (
    <PageShell title="Nuevo movimiento" back={volver}>
      <div className="max-w-lg space-y-5">
        <SectionCard>
          <FormField label="Campo" required>
            <SelectBox
              options={campoOptions}
              value={campoId ? String(campoId) : null}
              onValueChange={(v) => onCampoChange(Number(v))}
              placeholder="— Seleccioná un campo —"
            />
          </FormField>
        </SectionCard>

        {!campoId ? (
          <p className="text-sm text-muted-foreground">Elegí un campo para continuar.</p>
        ) : sinLotes ? (
          <p className="text-sm text-muted-foreground">
            Este campo todavía no tiene lotes.{" "}
            <Link href="/configuracion/lotes" className="font-medium text-foreground underline underline-offset-2">
              Creá uno
            </Link>{" "}
            para poder registrar movimientos.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <SectionCard className="space-y-5">

              {/* Tipo de movimiento */}
              <FormField label="Tipo de movimiento" required error={errors.tipo}>
                <SelectBox
                  options={tipoOptions}
                  value={tipo || null}
                  onValueChange={(v) => { setTipo(v as MovimientoFormData["tipoMovimiento"]); setErrors((p) => ({ ...p, tipo: "" })); }}
                  placeholder={loading ? "Cargando…" : "— Seleccioná —"}
                  disabled={loading}
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

              {/* Lote (nacimiento/muerte/ajuste_manual) */}
              {tipo && !esTraslado && (
                <FormField label="Lote" required error={errors.lote}>
                  <SelectBox
                    options={loteOptions}
                    value={idLote || null}
                    onValueChange={(v) => { setIdLote(v); setErrors((p) => ({ ...p, lote: "" })); }}
                    placeholder="— Seleccioná —"
                    error={!!errors.lote}
                  />
                </FormField>
              )}

              {/* Lote origen/destino (traslado) */}
              {esTraslado && (
                <>
                  <FormField label="Lote origen" required error={errors.loteOrigen}>
                    <SelectBox
                      options={loteOptions}
                      value={idLoteOrigen || null}
                      onValueChange={(v) => { setIdLoteOrigen(v); setErrors((p) => ({ ...p, loteOrigen: "" })); }}
                      placeholder="— Seleccioná —"
                      error={!!errors.loteOrigen}
                    />
                  </FormField>
                  <FormField label="Lote destino" required error={errors.loteDestino}>
                    <SelectBox
                      options={loteOptions}
                      value={idLoteDestino || null}
                      onValueChange={(v) => { setIdLoteDestino(v); setErrors((p) => ({ ...p, loteDestino: "" })); }}
                      placeholder="— Seleccioná —"
                      error={!!errors.loteDestino}
                    />
                  </FormField>
                </>
              )}

              {/* Categoría */}
              <FormField label="Categoría" required error={errors.categoria}>
                <SelectBox
                  options={categoriaOptions}
                  value={idCategoria || null}
                  onValueChange={(v) => { setIdCategoria(v); setErrors((p) => ({ ...p, categoria: "" })); }}
                  placeholder={loading ? "Cargando…" : "— Seleccioná —"}
                  disabled={loading}
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

            <div className="mt-5 flex items-center gap-3">
              <Button type="submit" disabled={guardando}>
                {guardando ? "Guardando…" : "Registrar movimiento"}
              </Button>
              <Link
                href="/rodeo"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </div>
    </PageShell>
  );
}
