"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { ResumenMensual } from "./ResumenMensualContainer";

type Props = {
  resumen: ResumenMensual | null;
  loading: boolean;
  error: string | null;
};

const ars = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

function KpiCard({
  titulo,
  mes,
  valor,
  icono: Icono,
  colorValor,
  loading,
}: {
  titulo: string;
  mes: string;
  valor: string;
  icono: React.ElementType;
  colorValor: string;
  loading: boolean;
}) {
  return (
    <div className="rounded-lg bg-card p-6 shadow-sm border border-border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{titulo}</p>
          <p className="text-xs text-muted-foreground/70 mt-0.5">{mes}</p>
        </div>
        <Icono size={18} className="text-muted-foreground/50 mt-0.5" />
      </div>
      <p className={`mt-4 text-2xl font-bold tabular-nums ${colorValor} ${loading ? "opacity-40" : ""}`}>
        {loading ? "—" : valor}
      </p>
    </div>
  );
}

export default function ResumenMensualCards({ resumen, loading, error }: Props) {
  if (error) {
    return (
      <div className="col-span-3 rounded-lg bg-card p-6 shadow-sm border border-border">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  const totalCompras = resumen?.totalCompras ?? 0;
  const totalVentas = resumen?.totalVentas ?? 0;
  const neto = totalVentas - totalCompras;
  const mes = resumen?.mes ?? "";

  const colorNeto =
    neto > 0 ? "text-green-600 dark:text-green-400" :
    neto < 0 ? "text-destructive" :
    "text-foreground";

  const IconoNeto = neto >= 0 ? TrendingUp : TrendingDown;

  return (
    <>
      <KpiCard
        titulo="Compras del mes"
        mes={mes}
        valor={ars(totalCompras)}
        icono={TrendingDown}
        colorValor="text-foreground"
        loading={loading}
      />
      <KpiCard
        titulo="Ventas del mes"
        mes={mes}
        valor={ars(totalVentas)}
        icono={TrendingUp}
        colorValor="text-foreground"
        loading={loading}
      />
      <KpiCard
        titulo="Resultado neto"
        mes={mes}
        valor={(neto >= 0 ? "+" : "") + ars(neto)}
        icono={neto === 0 ? Minus : IconoNeto}
        colorValor={colorNeto}
        loading={loading}
      />
    </>
  );
}
