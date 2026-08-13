"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormField, SelectBox } from "@/components/app";
import type { RodeoFila, LoteOption } from "./CargaInicialContainer";

type Props = {
  filas: RodeoFila[];
  lotes: LoteOption[];
  loteId: number | null;
  onLoteChange: (loteId: number | null) => void;
  loading: boolean;
  error: string | null;
  yaConfigurado: boolean;
  sinCampo: boolean;
  sinLotes: boolean;
  onGuardar: (cabezasMap: Record<number, number>) => Promise<void>;
};

export default function CargaInicialView({
  filas,
  lotes,
  loteId,
  onLoteChange,
  loading,
  error,
  yaConfigurado,
  sinCampo,
  sinLotes,
  onGuardar,
}: Props) {
  const [cabezas, setCabezas] = useState<Record<number, number>>({});
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null);

  useEffect(() => {
    const inicial: Record<number, number> = {};
    filas.forEach((f) => {
      inicial[f.Id_CategoriaHacienda] = f.Cabezas;
    });
    setCabezas(inicial);
  }, [filas]);

  const handleChange = (id: number, value: string) => {
    setGuardado(false);
    const num = parseInt(value, 10);
    setCabezas((prev) => ({ ...prev, [id]: isNaN(num) || num < 0 ? 0 : num }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setErrorGuardar(null);
    setGuardado(false);
    try {
      await onGuardar(cabezas);
      setGuardado(true);
    } catch (err) {
      setErrorGuardar(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  const totalCabezas = Object.values(cabezas).reduce((a, b) => a + b, 0);

  if (sinCampo) {
    return (
      <main className="p-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-2">Carga inicial del rodeo</h1>
        <p className="text-sm text-muted-foreground">
          Seleccioná un campo en el selector del encabezado para editar su stock inicial.
        </p>
      </main>
    );
  }

  if (sinLotes) {
    return (
      <main className="p-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-2">Carga inicial del rodeo</h1>
        <p className="text-sm text-muted-foreground">
          Este campo todavía no tiene lotes.{" "}
          <Link href="/configuracion/lotes" className="font-medium text-foreground underline underline-offset-2">
            Creá uno
          </Link>{" "}
          para poder cargar su stock inicial.
        </p>
      </main>
    );
  }

  const loteOptions = lotes.map((l) => ({ value: l.Id_Lote, label: l.Nombre }));

  return (
    <main className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Carga inicial del rodeo</h1>
      </div>

      {lotes.length > 1 && (
        <FormField label="Lote" className="mb-5 max-w-xs">
          <SelectBox
            options={loteOptions}
            value={loteId ? String(loteId) : null}
            onValueChange={(v) => onLoteChange(Number(v))}
            placeholder="— Seleccioná un lote —"
          />
        </FormField>
      )}

      {!loteId ? (
        <p className="text-sm text-muted-foreground">Seleccioná un lote para editar su stock inicial.</p>
      ) : loading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <>
          {yaConfigurado && (
            <div className="mb-5 flex items-start gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-300">
              <AlertTriangle size={15} className="mt-0.5 shrink-0" />
              <p>El rodeo de este lote ya fue configurado. Solo modificá si necesitás corregir un error, antes de cargar facturas.</p>
            </div>
          )}

          {guardado && (
            <div className="mb-5 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300">
              <CheckCircle2 size={15} className="shrink-0" />
              <p>Rodeo guardado correctamente.</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="rounded-lg border border-border bg-card">
              <div className="grid grid-cols-2 border-b border-border px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <span>Categoría</span>
                <span>Cabezas</span>
              </div>

              {filas.map((fila, idx) => (
                <div
                  key={fila.Id_CategoriaHacienda}
                  className={`grid grid-cols-2 items-center px-5 py-3 ${
                    idx < filas.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <label
                    htmlFor={`cat-${fila.Id_CategoriaHacienda}`}
                    className="text-sm font-medium text-foreground"
                  >
                    {fila.Nombre}
                  </label>
                  <Input
                    id={`cat-${fila.Id_CategoriaHacienda}`}
                    type="number"
                    min={0}
                    value={cabezas[fila.Id_CategoriaHacienda] ?? 0}
                    onChange={(e) => handleChange(fila.Id_CategoriaHacienda, e.target.value)}
                    className="w-32"
                  />
                </div>
              ))}

              <div className="flex items-center justify-end border-t border-border px-5 py-3 text-sm">
                <span className="text-muted-foreground">
                  Total:&nbsp;
                  <span className="font-semibold text-foreground">{totalCabezas} cabezas</span>
                </span>
              </div>
            </div>

            {errorGuardar && (
              <p className="mt-3 text-sm text-destructive">{errorGuardar}</p>
            )}

            <div className="mt-5">
              <button
                type="submit"
                disabled={guardando}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {guardando ? "Guardando…" : "Guardar rodeo"}
              </button>
            </div>
          </form>
        </>
      )}
    </main>
  );
}
