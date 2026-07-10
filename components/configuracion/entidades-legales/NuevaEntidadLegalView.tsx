"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

type FormData = {
  razon_social: string;
  cuit_cuil: string;
  tipo_persona: "fisica" | "juridica";
  condicion_iva: "monotributo" | "responsable_inscripto" | "exento" | "consumidor_final";
};

type Props = {
  onSubmit: (data: FormData) => Promise<void>;
};

export default function NuevaEntidadLegalView({ onSubmit }: Props) {
  const [form, setForm] = useState<FormData>({
    razon_social: "",
    cuit_cuil: "",
    tipo_persona: "fisica",
    condicion_iva: "monotributo",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-2xl">
      {/* Encabezado */}
      <div className="mb-6">
        <Link
          href="/configuracion/entidades-legales"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Volver al listado
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Nueva Entidad Legal</h1>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 space-y-5">
        {/* Razón Social */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Razón Social <span className="text-destructive">*</span>
          </label>
          <Input
            name="razon_social"
            value={form.razon_social}
            onChange={handleChange}
            required
            placeholder="Ej: García & Asociados S.R.L."
          />
        </div>

        {/* CUIT/CUIL */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            CUIT / CUIL <span className="text-destructive">*</span>
          </label>
          <Input
            name="cuit_cuil"
            value={form.cuit_cuil}
            onChange={handleChange}
            required
            placeholder="Ej: 20-12345678-9"
          />
        </div>

        {/* Tipo de Persona */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Tipo de Persona <span className="text-destructive">*</span>
          </label>
          <select
            name="tipo_persona"
            value={form.tipo_persona}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="fisica">Persona Física</option>
            <option value="juridica">Persona Jurídica</option>
          </select>
        </div>

        {/* Condición IVA */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Condición frente al IVA <span className="text-destructive">*</span>
          </label>
          <select
            name="condicion_iva"
            value={form.condicion_iva}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="monotributo">Monotributo</option>
            <option value="responsable_inscripto">Responsable Inscripto</option>
            <option value="exento">Exento</option>
            <option value="consumidor_final">Consumidor Final</option>
          </select>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? "Guardando…" : "Guardar"}
          </button>
          <Link
            href="/configuracion/entidades-legales"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  );
}
