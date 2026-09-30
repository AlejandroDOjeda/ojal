"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/app";
import type { RodeoFila } from "./CargaInicialContainer";

type Props = {
  campoId: number;
  loteId: number;
  nombreLote: string | null;
  filas: RodeoFila[];
  loading: boolean;
  error: string | null;
  yaConfigurado: boolean;
  onGuardar: (cabezasMap: Record<number, number>) => Promise<void>;
};

export default function CargaInicialView({ campoId, loteId, nombreLote, filas, loading, error, yaConfigurado, onGuardar }: Props) {
  const router = useRouter();
  const [cabezas, setCabezas] = useState<Record<number, number>>({});
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null);

  useEffect(() => {
    const inicial: Record<number, number> = {};
    filas.forEach((f) => {
      inicial[f.Id_CategoriaHacienda] = f.Cabezas;
    });
    setCabezas(inicial);
  }, [filas]);

  const handleChange = (id: number, value: string) => {
    const num = parseInt(value, 10);
    setCabezas((prev) => ({ ...prev, [id]: isNaN(num) || num < 0 ? 0 : num }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setErrorGuardar(null);
    try {
      await onGuardar(cabezas);
      toast.success("Rodeo guardado correctamente.");
      router.push(`/campos/${campoId}/lotes/${loteId}`);
    } catch (err) {
      setErrorGuardar(err instanceof Error ? err.message : "Error al guardar");
      setGuardando(false);
    }
  };

  const totalCabezas = Object.values(cabezas).reduce((a, b) => a + b, 0);

  const backLink = (
    <Link href={`/campos/${campoId}/lotes/${loteId}`}>
      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground -ml-2">
        <ArrowLeft size={14} />
        Volver a {nombreLote ?? "lote"}
      </Button>
    </Link>
  );

  return (
    <PageShell title="Carga inicial del rodeo" back={backLink} className="max-w-2xl">
      {loading ? (
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
              <Button type="submit" disabled={guardando}>
                {guardando ? "Guardando…" : "Guardar rodeo"}
              </Button>
            </div>
          </form>
        </>
      )}
    </PageShell>
  );
}
