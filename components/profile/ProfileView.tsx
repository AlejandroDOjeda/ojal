"use client";

import { Input } from "@/components/ui/input";
import type { ProfileFormData } from "./ProfileContainer";

type Props = {
  userEmail: string | null;
  form: ProfileFormData;
  setForm: (form: ProfileFormData) => void;
  loading: boolean;
  saving: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  onSave: (data: ProfileFormData) => Promise<void>;
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
    </div>
  );
}

const selectClass = "w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-3 focus:ring-ring/50 focus:border-ring transition-colors";

export default function ProfileView({
  userEmail,
  form,
  setForm,
  loading,
  saving,
  successMessage,
  errorMessage,
  onSave,
}: Props) {
  const set = (field: keyof ProfileFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  if (loading) {
    return (
      <main className="p-8">
        <p className="text-muted-foreground">Cargando perfil...</p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Mi perfil</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Información personal y fiscal de tu cuenta
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Acceso */}
        <div className="rounded-lg border border-border bg-card p-6">
          <SectionTitle title="Acceso" description="Datos de tu cuenta en el sistema" />
          <Field label="Email">
            <Input value={userEmail ?? ""} disabled className="opacity-60" />
          </Field>
        </div>

        {/* Datos personales */}
        <div className="rounded-lg border border-border bg-card p-6">
          <SectionTitle title="Datos personales" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nombre">
              <Input
                value={form.nombre}
                onChange={set("nombre")}
                placeholder="Ej: Juan"
              />
            </Field>
            <Field label="Apellido">
              <Input
                value={form.apellido}
                onChange={set("apellido")}
                placeholder="Ej: García"
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Teléfono">
              <Input
                value={form.telefono}
                onChange={set("telefono")}
                placeholder="Ej: 011 15-1234-5678"
              />
            </Field>
          </div>
        </div>

        {/* Datos fiscales */}
        <div className="rounded-lg border border-border bg-card p-6">
          <SectionTitle
            title="Datos fiscales"
            description="Información utilizada en facturas y reportes contables"
          />
          <div className="space-y-4">
            <Field label="Razón Social">
              <Input
                value={form.razon_social}
                onChange={set("razon_social")}
                placeholder="Ej: García Juan Carlos o García & Hijos S.A."
              />
            </Field>

            <Field label="CUIT / CUIL" required>
              <Input
                value={form.cuit_cuil}
                onChange={set("cuit_cuil")}
                placeholder="Ej: 20-12345678-9"
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Tipo de persona" required>
                <select value={form.tipo_persona} onChange={set("tipo_persona")} className={selectClass}>
                  <option value="">— Seleccioná —</option>
                  <option value="fisica">Persona Física</option>
                  <option value="juridica">Persona Jurídica</option>
                </select>
              </Field>

              <Field label="Condición frente al IVA" required>
                <select value={form.condicion_iva} onChange={set("condicion_iva")} className={selectClass}>
                  <option value="">— Seleccioná —</option>
                  <option value="responsable_inscripto">Responsable Inscripto</option>
                  <option value="monotributo">Monotributo</option>
                  <option value="exento">Exento</option>
                  <option value="consumidor_final">Consumidor Final</option>
                </select>
              </Field>
            </div>
          </div>
        </div>

        {/* Mensajes y botón */}
        {successMessage && (
          <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </main>
  );
}
