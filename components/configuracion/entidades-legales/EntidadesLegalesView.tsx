"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, Building2, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageShell, DataTable, FormField, EmptyState, SelectBox } from "@/components/app";
import { formatCuit, cuitToDigits } from "@/lib/formato";
import { validarCuit, validarEmail, validarTelefono, formatTelefono } from "@/lib/validaciones";
import { TIPO_PERSONA_OPTIONS, TIPO_PERSONA_ITEMS, CONDICION_IVA_OPTIONS, CONDICION_IVA_ITEMS } from "@/lib/opciones";
import type { EntidadLegal, EntidadLegalFormData } from "./EntidadesLegalesContainer";

const EMPTY_FORM: EntidadLegalFormData = { RazonSocial: "", CuitCuil: "", Id_TipoPersona: "", Id_CondicionIva: "", Email: "", Telefono: "" };

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
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setFormError(null); setModalOpen(true); };
  const openEdit = (e: EntidadLegal) => {
    setEditing(e);
    setForm({ RazonSocial: e.RazonSocial, CuitCuil: e.CuitCuil, Id_TipoPersona: String(e.Id_TipoPersona), Id_CondicionIva: String(e.Id_CondicionIva), Email: e.Email ?? "", Telefono: e.Telefono ?? "" });
    setFormError(null); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(EMPTY_FORM); setFormError(null); };
  const setField = (field: keyof EntidadLegalFormData, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.RazonSocial.trim()) { setFormError("La razón social es obligatoria."); return; }
    if (!form.CuitCuil.trim()) { setFormError("El CUIT/CUIL es obligatorio."); return; }
    if (!validarCuit(form.CuitCuil)) { setFormError("El CUIT/CUIL no es válido. Verificá los 11 dígitos y el dígito verificador."); return; }
    if (!form.Id_TipoPersona) { setFormError("Seleccioná el tipo de persona."); return; }
    if (!form.Id_CondicionIva) { setFormError("Seleccioná la condición frente al IVA."); return; }
    if (form.Email && !validarEmail(form.Email)) { setFormError("El formato del email no es válido."); return; }
    if (form.Telefono && !validarTelefono(form.Telefono)) { setFormError("El teléfono debe tener entre 8 y 12 dígitos."); return; }
    setSaving(true); setFormError(null);
    try { editing ? await onUpdate(editing.Id_EntidadLegal, form) : await onCreate(form); closeModal(); }
    catch (err: unknown) { setFormError(err instanceof Error ? err.message : "Error al guardar."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    setDeleting(true); setDeleteError(null);
    try { await onDelete(id); setDeleteConfirmId(null); }
    catch (err: unknown) { setDeleteError(err instanceof Error ? err.message : "No se pudo eliminar."); }
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
              onClick={() => { setDeleteError(null); setDeleteConfirmId(e.Id_EntidadLegal); }}><Trash2 size={15} /></Button>
          </div>
        );
      },
    },
  ], [deleteConfirmId, deleting]);

  return (
    <PageShell title="Entidades Legales" description="Administrá las entidades legales del sistema"
      action={<Button size="icon" onClick={openCreate}><Plus /></Button>}>
      {error && <div className="mb-3 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}
      {deleteError && (
        <div className="mb-3 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center justify-between">
          {deleteError}<Button variant="link" size="xs" onClick={() => setDeleteError(null)}>Cerrar</Button>
        </div>
      )}
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
            <FormField label="Razón Social" required>
              <Input value={form.RazonSocial} onChange={(e) => setField("RazonSocial", e.target.value)} placeholder="Ej: García & Asociados S.A." />
            </FormField>
            <FormField label="CUIT / CUIL" required>
              <Input value={formatCuit(form.CuitCuil)} onChange={(e) => setField("CuitCuil", cuitToDigits(e.target.value))} placeholder="XX-XXXXXXXX-X" maxLength={13} />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Tipo" required>
                <SelectBox
                  options={TIPO_PERSONA_OPTIONS}
                  value={form.Id_TipoPersona}
                  onValueChange={(v) => setField("Id_TipoPersona", v)}
                />
              </FormField>
              <FormField label="Condición IVA" required>
                <SelectBox
                  options={CONDICION_IVA_OPTIONS}
                  value={form.Id_CondicionIva}
                  onValueChange={(v) => setField("Id_CondicionIva", v)}
                />
              </FormField>
            </div>
            <FormField label="Email">
              <Input value={form.Email} onChange={(e) => setField("Email", e.target.value)} type="email" placeholder="Ej: contacto@empresa.com" />
            </FormField>
            <FormField label="Teléfono">
              <Input value={form.Telefono} onChange={(e) => setField("Telefono", formatTelefono(e.target.value))} placeholder="Ej: 011 15-1234-5678" />
            </FormField>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <div className="flex justify-end pt-2"><Button type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
