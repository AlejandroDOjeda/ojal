"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageShell, SectionCard, FormField, SelectBox } from "@/components/app";
import { formatCuit, cuitToDigits } from "@/lib/formato";
import { validarCuit } from "@/lib/validaciones";
import { TIPO_PERSONA_OPTIONS, CONDICION_IVA_OPTIONS } from "@/lib/opciones";
import type { ProfileFormData } from "./ProfileContainer";

type Errors = Partial<Record<keyof ProfileFormData, string>>;

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
  const [formErrors, setFormErrors] = useState<Errors>({});

  const setInput = (field: keyof ProfileFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
    if (formErrors[field]) setFormErrors(ev => ({ ...ev, [field]: undefined }));
  };
  const setSelect = (field: keyof ProfileFormData) => (value: string) => {
    setForm({ ...form, [field]: value });
    if (formErrors[field]) setFormErrors(ev => ({ ...ev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Errors = {};
    if (form.CuitCuil && !validarCuit(form.CuitCuil)) errors.CuitCuil = "CUIT/CUIL inválido";
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    onSave(form);
  };

  if (loading) return <PageShell title="Mi perfil" className="max-w-2xl"><p className="text-muted-foreground">Cargando perfil...</p></PageShell>;

  return (
    <PageShell title="Mi perfil" description="Información personal y fiscal de tu cuenta" className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Acceso" description="Datos de tu cuenta en el sistema">
          <FormField label="Email"><Input value={userEmail ?? ""} disabled className="opacity-60" /></FormField>
        </SectionCard>

        <SectionCard title="Datos personales">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Nombre"><Input value={form.Nombre} onChange={setInput("Nombre")} placeholder="Ej: Juan" /></FormField>
            <FormField label="Apellido"><Input value={form.Apellido} onChange={setInput("Apellido")} placeholder="Ej: García" /></FormField>
          </div>
          <div className="mt-4">
            <FormField label="Teléfono"><Input value={form.Telefono} onChange={setInput("Telefono")} placeholder="Ej: 011 15-1234-5678" /></FormField>
          </div>
        </SectionCard>

        <SectionCard title="Datos fiscales" description="Información utilizada en facturas y reportes contables">
          <div className="space-y-4">
            <FormField label="Razón Social">
              <Input value={form.RazonSocial} onChange={setInput("RazonSocial")} placeholder="Ej: García Juan Carlos o García & Hijos S.A." />
            </FormField>
            <FormField label="CUIT / CUIL" error={formErrors.CuitCuil}>
              <Input value={formatCuit(form.CuitCuil)} aria-invalid={!!formErrors.CuitCuil}
                onChange={(e) => { setForm({ ...form, CuitCuil: cuitToDigits(e.target.value) }); setFormErrors({}); }}
                placeholder="XX-XXXXXXXX-X" maxLength={13} />
            </FormField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Tipo de persona" required>
                <SelectBox options={TIPO_PERSONA_OPTIONS} value={form.Id_TipoPersona} onValueChange={setSelect("Id_TipoPersona")} />
              </FormField>
              <FormField label="Condición frente al IVA" required>
                <SelectBox options={CONDICION_IVA_OPTIONS} value={form.Id_CondicionIva} onValueChange={setSelect("Id_CondicionIva")} />
              </FormField>
            </div>
          </div>
        </SectionCard>

        {successMessage && <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400">{successMessage}</div>}
        {errorMessage && <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{errorMessage}</div>}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</Button>
        </div>
      </form>
    </PageShell>
  );
}
