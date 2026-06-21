"use client";

import Link from "next/link";
import { Plus, Building2 } from "lucide-react";
import type { EntidadLegal } from "./EntidadesLegalesContainer";

const TIPO_LABEL: Record<EntidadLegal["tipo_persona"], string> = {
  fisica: "Persona Física",
  juridica: "Persona Jurídica",
};

const CONDICION_LABEL: Record<EntidadLegal["condicion_iva"], string> = {
  monotributo: "Monotributo",
  responsable_inscripto: "Resp. Inscripto",
  exento: "Exento",
  consumidor_final: "Consumidor Final",
};

type Props = {
  entidades: EntidadLegal[];
};

export default function EntidadesLegalesView({ entidades }: Props) {
  return (
    <main className="p-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Entidades Legales</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administrá las entidades legales del sistema
          </p>
        </div>
        <Link
          href="/configuracion/entidades-legales/nueva"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
        </Link>
      </div>

      {/* Grilla / Estado vacío */}
      {entidades.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card py-20 text-center">
          <Building2 size={48} className="text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold text-foreground">
            No hay entidades legales
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Creá la primera entidad para comenzar.
          </p>
          <Link
            href="/configuracion/entidades-legales/nueva"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            Nueva Entidad Legal
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Razón Social</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">CUIT / CUIL</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tipo</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Condición IVA</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entidades.map((e) => (
                <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{e.razon_social}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.cuit_cuil}</td>
                  <td className="px-4 py-3 text-muted-foreground">{TIPO_LABEL[e.tipo_persona]}</td>
                  <td className="px-4 py-3 text-muted-foreground">{CONDICION_LABEL[e.condicion_iva]}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/configuracion/entidades-legales/${e.id}`}
                      className="text-primary hover:underline text-xs"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
