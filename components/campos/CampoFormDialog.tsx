"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/app";
import { formatRenspa, renspaToDigits } from "@/lib/formato";
import { validarRenspa } from "@/lib/validaciones";
import type { CampoRow } from "./CamposContainer";

export type CampoFormData = {
  Nombre:     string;
  Renspa:     string;
  Ubicacion:  string;
  Superficie: string;
};

const EMPTY_FORM: CampoFormData = { Nombre: "", Renspa: "", Ubicacion: "", Superficie: "" };
type Errors = Partial<Record<keyof CampoFormData, string>>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campo: CampoRow | null;
  onSubmit: (data: CampoFormData) => Promise<void>;
};

export function CampoFormDialog({ open, onOpenChange, campo, onSubmit }: Props) {
  const [form, setForm] = useState<CampoFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!open) return;
    setForm(
      campo
        ? {
            Nombre:     campo.Nombre,
            Renspa:     (campo.Renspa ?? "").replace(/\D/g, ""),
            Ubicacion:  campo.Ubicacion ?? "",
            Superficie: campo.Superficie != null ? String(campo.Superficie) : "",
          }
        : EMPTY_FORM
    );
    setErrors({});
  }, [open, campo]);

  const setField = (field: keyof CampoFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.Nombre.trim()) e.Nombre = "Obligatorio";
    if (form.Renspa && !validarRenspa(form.Renspa)) e.Renspa = "Formato inválido — debe tener 13 dígitos (XX.XXX.X.XXXXX/XX)";
    if (form.Superficie) {
      const sup = parseFloat(form.Superficie);
      if (isNaN(sup) || sup <= 0) e.Superficie = "Debe ser un número mayor que 0";
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) { setErrors(validation); return; }
    setSaving(true);
    try {
      await onSubmit(form);
      toast.success(campo ? "Campo actualizado." : "Campo creado.");
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{campo ? "Editar campo" : "Nuevo campo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <FormField label="Nombre" required error={errors.Nombre}>
            <Input
              value={form.Nombre}
              onChange={(e) => setField("Nombre", e.target.value)}
              placeholder="Ej: Campo Norte"
              aria-invalid={!!errors.Nombre}
            />
          </FormField>
          <FormField label="RENSPA" error={errors.Renspa}>
            <Input
              value={formatRenspa(form.Renspa)}
              onChange={(e) => setField("Renspa", renspaToDigits(e.target.value))}
              placeholder="12.345.6.78901/12"
              inputMode="numeric"
              maxLength={18}
              aria-invalid={!!errors.Renspa}
            />
          </FormField>
          <FormField label="Ubicación" error={errors.Ubicacion}>
            <Input
              value={form.Ubicacion}
              onChange={(e) => setField("Ubicacion", e.target.value)}
              placeholder="Ej: Partido de Azul, Buenos Aires"
            />
          </FormField>
          <FormField label="Superficie (hectáreas)" error={errors.Superficie}>
            <Input
              value={form.Superficie}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9.]/g, "");
                const parts = v.split(".");
                const clean = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : v;
                setField("Superficie", clean);
              }}
              placeholder="Ej: 1500"
              inputMode="decimal"
              min={0}
              aria-invalid={!!errors.Superficie}
            />
          </FormField>
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
