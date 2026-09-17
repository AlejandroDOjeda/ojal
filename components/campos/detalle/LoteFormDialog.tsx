"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/app";
import type { LoteRow, LoteFormData } from "./CampoDetalleContainer";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lote: LoteRow | null;
  onSubmit: (data: LoteFormData) => Promise<void>;
};

export function LoteFormDialog({ open, onOpenChange, lote, onSubmit }: Props) {
  const [nombre, setNombre] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!open) return;
    setNombre(lote?.Nombre ?? "");
    setError(undefined);
  }, [open, lote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) { setError("Obligatorio"); return; }
    setSaving(true);
    try {
      await onSubmit({ Nombre: nombre });
      toast.success(lote ? "Lote actualizado." : "Lote creado.");
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
          <DialogTitle>{lote ? "Editar lote" : "Nuevo lote"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <FormField label="Nombre" required error={error}>
            <Input
              value={nombre}
              onChange={(e) => { setNombre(e.target.value); setError(undefined); }}
              placeholder="Ej: Lote Norte"
              aria-invalid={!!error}
              autoFocus
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
