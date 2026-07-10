"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PosicionIva } from "./PosicionIvaContainer";

type Props = {
  posicion: PosicionIva | null;
  loading: boolean;
  error: string | null;
};

const ars = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

function Metric({
  label,
  value,
  colorClass,
  loading,
}: {
  label: string;
  value: string;
  colorClass: string;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className={`text-xl font-bold tabular-nums ${colorClass} ${loading ? "opacity-40" : ""}`}>
        {loading ? "—" : value}
      </p>
    </div>
  );
}

export default function PosicionIvaCard({ posicion, loading, error }: Props) {
  if (error) {
    return (
      <div className="rounded-lg bg-card border border-border p-6 shadow-sm">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  const credito = posicion?.creditoFiscal ?? 0;
  const debito = posicion?.debitoFiscal ?? 0;
  const saldo = posicion?.saldoTecnico ?? 0;
  const mes = posicion?.mes ?? "";

  const saldoColor =
    saldo > 0 ? "text-green-600 dark:text-green-400" :
    saldo < 0 ? "text-destructive" :
    "text-foreground";

  const saldoLabel =
    saldo > 0 ? "Saldo a favor" :
    saldo < 0 ? "Deuda" :
    "Saldo técnico";

  return (
    <div className="rounded-lg bg-card border border-border p-6 shadow-sm">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Posición IVA</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{mes}</p>
        </div>
        <Link
          href="/iva"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Ver módulo IVA
          <ArrowRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Metric
          label="Crédito fiscal"
          value={ars(credito)}
          colorClass="text-foreground"
          loading={loading}
        />
        <Metric
          label="Débito fiscal"
          value={ars(debito)}
          colorClass="text-foreground"
          loading={loading}
        />
        <Metric
          label={saldoLabel}
          value={(saldo > 0 ? "+" : "") + ars(saldo)}
          colorClass={saldoColor}
          loading={loading}
        />
      </div>
    </div>
  );
}
