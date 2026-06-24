"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, Building2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageShell, DataTable, FormField, EmptyState, SelectBox } from "@/components/app";
import { formatCuit, cuitToDigits } from "@/lib/formato";
import { validarCuit, validarEmail, validarTelefono, formatTelefono } from "@/lib/validaciones";
import { TIPO_PERSONA_OPTIONS, TIPO_PERSONA_ITEMS, CONDICION_IVA_OPTIONS, CONDICION_IVA_ITEMS } from "@/lib/opciones";
import type { EntidadLegal, EntidadLegalFormData } from "./EntidadesLegalesContainer";

const EMPTY_FORM: EntidadLegalFormData = { RazonSocial: "", CuitCuil: "", Id_TipoPersona: "", Id_CondicionIva: "", Email: "", Telefono: "" };
type Errors = Partial<Record<keyof EntidadLegalFormData, string>>;

type Props = {
  entidades: EntidadLegal[];
  loading: boolean;
  error: string | null;
  onCreate: (data: EntidadLegalFormData) => Promise<void>;
  onUpdate: (id: number, data: EntidadLegalFormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function EntidadesLegalesView({ entidades, loading, error, onCreate, onUpdate, onDelete }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EntidadLegal | null>(null);
  const [form, setForm] = useState<EntidadLegalFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Errors>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setFormErrors({}); setModalOpen(true); };
  const openEdit = (e: EntidadLegal) => {
    setEditing(e);
    setForm({ RazonSocial: e.RazonSocial, CuitCuil: e.CuitCuil, Id_TipoPersona: String(e.Id_TipoPersona), Id_CondicionIva: String(e.Id_CondicionIva), Email: e.Email ?? "", Telefono: e.Telefono ?? "" });
    setFormErrors({}); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(EMPTY_FORM); setFormErrors({}); };

  const setField = (field: keyof EntidadLegalFormData, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    if (formErrors[field]) setFormErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.RazonSocial.trim())      e.RazonSocial   = "Obligatorio";
    if (!form.CuitCuil.trim())         e.CuitCuil      = "Obligatorio";
    else if (!validarCuit(form.CuitCuil)) e.CuitCuil   = "CUIT/CUIL inválido";
    if (!form.Id_TipoPersona)          e.Id_TipoPersona  = "Obligatorio";
    if (!form.Id_CondicionIva)         e.Id_CondicionIva = "Obligatorio";
    if (form.Email && !validarEmail(form.Email))       e.Email    = "Email inválido";
    if (form.Telefono && !validarTelefono(form.Telefono)) e.Telefono = "Teléfono inválido";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setSaving(true);
    try {
      editing ? await onUpdate(editing.Id_EntidadLegal, form) : await onCreate(form);
      toast.success(editing ? "Entidad actualizada." : "Entidad creada.");
      closeModal();
    }
    catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Error al guardar."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try { await onDelete(id); setDeleteConfirmId(null); toast.success("Entidad eliminada."); }
    catch (err: unknown) { toast.error(err instanceof Error ? err.message : "No se pudo eliminar."); }
    finally { setDeleting(false); }
  };

  const columns = useMemo<ColumnDef<EntidadLegal, unknown>[]>(() => [
    { accessorKey: "RazonSocial", header: "Razón Social", cell: ({ row }) => <span className="font-medium">{row.original.RazonSocial}</span> },
    { accessorKey: "CuitCuil", header: "CUIT / CUIL", cell: ({ row }) => <span className="text-muted-foreground">{formatCuit(row.original.CuitCuil)}</span> },
    { accessorKey: "Id_TipoPersona", header: "Tipo", cell: ({ row }) => <span className="text-muted-foreground">{TIPO_PERSONA_ITEMS[String(row.original.Id_TipoPersona)] ?? "—"}</span> },
    { accessorKey: "Id_CondicionIva", header: "Condición IVA", cell: ({ row }) => <span className="text-muted-foreground">{CONDICION_IVA_ITEMS[String(row.original.Id_CondicionIva)] ?? "—"}</span> },
    {
      id: "acciones", header: "", enableSorting: false, size: 120,
      cell: ({ row }) => {
        const e = row.original;
        return deleteConfirmId === e.Id_EntidadLegal ? (
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs text-muted-foreground">¿Eliminar?</span>
            <Button variant="destructive" size="xs" onClick={() => handleDelete(e.Id_EntidadLegal)} disabled={deleting}>Sí</Button>
            <Button variant="ghost" size="xs" onClick={() => setDeleteConfirmId(null)}>No</Button>
          </div>
        ) : (
          <div className="flex items-center gap-1 justify-end">
            <Button variant="ghost" size="icon-sm" onClick={() => openEdit(e)}><Pencil size={15} /></Button>
            <Button variant="ghost" size="icon-sm" className="hover:text-destructive hover:bg-destructive/10"
              onClick={() => { setDeleteConfirmId(e.Id_EntidadLegal); }}><Trash2 size={15} /></Button>
          </div>
        );
      },
    },
  ], [deleteConfirmId, deleting]);

  return (
    <PageShell title="Entidades Legales" description="Administrá las entidades legales del sistema"
      action={<Button size="icon" onClick={openCreate}><Plus /></Button>}>
      {error && <div className="mb-3 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}
      {entidades.length === 0 && !loading ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card text-center p-8">
          <EmptyState icon={<Building2 size={48} />} title="No hay entidades legales" description="Creá la primera entidad para comenzar."
            action={<Button onClick={openCreate}><Plus />Nueva Entidad Legal</Button>} />
        </div>
      ) : (
        <DataTable data={entidades} columns={columns} loading={loading} />
      )}

      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Editar entidad legal" : "Nueva entidad legal"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <FormField label="Razón Social" required error={formErrors.RazonSocial}>
              <Input value={form.RazonSocial} onChange={(e) => setField("RazonSocial", e.target.value)}
                placeholder="Ej: García & Asociados S.A." aria-invalid={!!formErrors.RazonSocial} />
            </FormField>
            <FormField label="CUIT / CUIL" required error={formErrors.CuitCuil}>
              <Input value={formatCuit(form.CuitCuil)} onChange={(e) => setField("CuitCuil", cuitToDigits(e.target.value))}
                placeholder="XX-XXXXXXXX-X" maxLength={13} aria-invalid={!!formErrors.CuitCuil} />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Tipo" required error={formErrors.Id_TipoPersona}>
                <SelectBox options={TIPO_PERSONA_OPTIONS} value={form.Id_TipoPersona}
                  onValueChange={(v) => setField("Id_TipoPersona", v)} error={!!formErrors.Id_TipoPersona} />
              </FormField>
              <FormField label="Condición IVA" required error={formErrors.Id_CondicionIva}>
                <SelectBox options={CONDICION_IVA_OPTIONS} value={form.Id_CondicionIva}
                  onValueChange={(v) => setField("Id_CondicionIva", v)} error={!!formErrors.Id_CondicionIva} />
              </FormField>
            </div>
            <FormField label="Email" error={formErrors.Email}>
              <Input value={form.Email} onChange={(e) => setField("Email", e.target.value)}
                type="email" placeholder="Ej: contacto@empresa.com" aria-invalid={!!formErrors.Email} />
            </FormField>
            <FormField label="Teléfono" error={formErrors.Telefono}>
              <Input value={form.Telefono} onChange={(e) => setField("Telefono", formatTelefono(e.target.value))}
                placeholder="Ej: 011 15-1234-5678" aria-invalid={!!formErrors.Telefono} />
            </FormField>
            <div className="flex justify-end pt-2"><Button type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
