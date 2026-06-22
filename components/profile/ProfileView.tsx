"use client";

import { Input } from "@/components/ui/input";
import { PageShell, SectionCard, FormField, AppSelect } from "@/components/app";
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

export default function ProfileView({ userEmail, form, setForm, loading, saving, successMessage, errorMessage, onSave }: Props) {
  const set = (field: keyof ProfileFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(form); };

  if (loading) {
    return (
      <PageShell title="Mi perfil" className="max-w-2xl">
        <p className="text-muted-foreground">Cargando perfil...</p>
      </PageShell>
    );
  }

  return (
    <PageShell title="Mi perfil" description="Información personal y fiscal de tu cuenta" className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Acceso" description="Datos de tu cuenta en el sistema">
          <FormField label="Email">
            <Input value={userEmail ?? ""} disabled className="opacity-60" />
          </FormField>
        </SectionCard>

        <SectionCard title="Datos personales">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Nombre">
              <Input value={form.nombre} onChange={set("nombre")} placeholder="Ej: Juan" />
            </FormField>
            <FormField label="Apellido">
              <Input value={form.apellido} onChange={set("apellido")} placeholder="Ej: García" />
            </FormField>
          </div>
          <div className="mt-4">
            <FormField label="Teléfono">
              <Input value={form.telefono} onChange={set("telefono")} placeholder="Ej: 011 15-1234-5678" />
            </FormField>
          </div>
        </SectionCard>

        <SectionCard title="Datos fiscales" description="Información utilizada en facturas y reportes contables">
          <div className="space-y-4">
            <FormField label="Razón Social">
              <Input value={form.razon_social} onChange={set("razon_social")} placeholder="Ej: García Juan Carlos o García & Hijos S.A." />
            </FormField>
            <FormField label="CUIT / CUIL" required>
              <Input value={form.cuit_cuil} onChange={set("cuit_cuil")} placeholder="Ej: 20-12345678-9" />
            </FormField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Tipo de persona" required>
                <AppSelect value={form.tipo_persona} onChange={set("tipo_persona")}>
                  <option value="">— Seleccioná —</option>
                  <option value="fisica">Persona Física</option>
                  <option value="juridica">Persona Jurídica</option>
                </AppSelect>
              </FormField>
              <FormField label="Condición frente al IVA" required>
                <AppSelect value={form.condicion_iva} onChange={set("condicion_iva")}>
                  <option value="">— Seleccioná —</option>
                  <option value="responsable_inscripto">Responsable Inscripto</option>
                  <option value="monotributo">Monotributo</option>
                  <option value="exento">Exento</option>
                  <option value="consumidor_final">Consumidor Final</option>
                </AppSelect>
              </FormField>
            </div>
          </div>
        </SectionCard>

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
          <button type="submit" disabled={saving} className="inline-flex items-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </PageShell>
  );
}
