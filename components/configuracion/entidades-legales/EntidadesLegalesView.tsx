"use client";

import { useState } from "react";
import { Plus, Building2, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PageShell, GridContainer, FormField, EmptyState, AppSelect } from "@/components/app";
import type { EntidadLegal, EntidadLegalFormData } from "./EntidadesLegalesContainer";

const TIPO_LABEL: Record<EntidadLegal["tipo_persona"], string> = {
  fisica: "Persona Física",
  juridica: "Persona Jurídica",
};

const CONDICION_LABEL: Record<EntidadLegal["condicion_iva"], string> = {
  responsable_inscripto: "Resp. Inscripto",
  monotributo: "Monotributo",
  exento: "Exento",
  consumidor_final: "Consumidor Final",
};

const EMPTY_FORM: EntidadLegalFormData = {
  razon_social: "",
  cuit_cuil: "",
  tipo_persona: "",
  condicion_iva: "",
  email: "",
  telefono: "",
};

type Props = {
  entidades: EntidadLegal[];
  loading: boolean;
  error: string | null;
  onCreate: (data: EntidadLegalFormData) => Promise<void>;
  onUpdate: (id: string, data: EntidadLegalFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export default function EntidadesLegalesView({ entidades, loading, error, onCreate, onUpdate, onDelete }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EntidadLegal | null>(null);
  const [form, setForm] = useState<EntidadLegalFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setFormError(null); setModalOpen(true); };
  const openEdit = (e: EntidadLegal) => {
    setEditing(e);
    setForm({ razon_social: e.razon_social, cuit_cuil: e.cuit_cuil, tipo_persona: e.tipo_persona, condicion_iva: e.condicion_iva, email: e.email ?? "", telefono: e.telefono ?? "" });
    setFormError(null);
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(EMPTY_FORM); setFormError(null); };

  const set = (field: keyof EntidadLegalFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.razon_social.trim()) { setFormError("La razón social es obligatoria."); return; }
    if (!form.cuit_cuil.trim()) { setFormError("El CUIT/CUIL es obligatorio."); return; }
    if (!form.tipo_persona) { setFormError("Seleccioná el tipo de persona."); return; }
    if (!form.condicion_iva) { setFormError("Seleccioná la condición frente al IVA."); return; }
    setSaving(true); setFormError(null);
    try {
      editing ? await onUpdate(editing.id, form) : await onCreate(form);
      closeModal();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true); setDeleteError(null);
    try { await onDelete(id); setDeleteConfirmId(null); }
    catch (err: unknown) { setDeleteError(err instanceof Error ? err.message : "No se pudo eliminar."); }
    finally { setDeleting(false); }
  };

  const actionBtn = (
    <button onClick={openCreate} className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors">
      <Plus size={16} />
    </button>
  );

  return (
    <PageShell title="Entidades Legales" description="Administrá las entidades legales del sistema" action={actionBtn}>
      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>
      )}
      {deleteError && (
        <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center justify-between">
          {deleteError}
          <button onClick={() => setDeleteError(null)} className="ml-4 underline text-xs">Cerrar</button>
        </div>
      )}

      {loading ? (
        <GridContainer state="loading"><p className="text-muted-foreground">Cargando...</p></GridContainer>
      ) : entidades.length === 0 ? (
        <GridContainer state="empty">
          <EmptyState
            icon={<Building2 size={48} />}
            title="No hay entidades legales"
            description="Creá la primera entidad para comenzar."
            action={
              <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                <Plus size={16} /> Nueva Entidad Legal
              </button>
            }
          />
        </GridContainer>
      ) : (
        <GridContainer>
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Razón Social</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">CUIT / CUIL</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tipo</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Condición IVA</th>
                <th className="px-4 py-3 w-32" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entidades.map((e) => (
                <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{e.razon_social}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.cuit_cuil}</td>
                  <td className="px-4 py-3 text-muted-foreground">{TIPO_LABEL[e.tipo_persona]}</td>
                  <td className="px-4 py-3 text-muted-foreground">{CONDICION_LABEL[e.condicion_iva]}</td>
                  <td className="px-4 py-3">
                    {deleteConfirmId === e.id ? (
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs text-muted-foreground">¿Eliminar?</span>
                        <button onClick={() => handleDelete(e.id)} disabled={deleting} className="text-xs font-medium text-destructive hover:underline disabled:opacity-50">Sí</button>
                        <button onClick={() => setDeleteConfirmId(null)} className="text-xs text-muted-foreground hover:underline">No</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(e)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" aria-label="Editar"><Pencil size={15} /></button>
                        <button onClick={() => { setDeleteError(null); setDeleteConfirmId(e.id); }} className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive" aria-label="Eliminar"><Trash2 size={15} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GridContainer>
      )}

      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar entidad legal" : "Nueva entidad legal"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <FormField label="Razón Social" required>
              <Input value={form.razon_social} onChange={set("razon_social")} placeholder="Ej: García & Asociados S.A." />
            </FormField>
            <FormField label="CUIT / CUIL" required>
              <Input value={form.cuit_cuil} onChange={set("cuit_cuil")} placeholder="Ej: 20-12345678-9" />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Tipo" required>
                <AppSelect value={form.tipo_persona} onChange={set("tipo_persona")}>
                  <option value="">— Seleccioná —</option>
                  <option value="fisica">Persona Física</option>
                  <option value="juridica">Persona Jurídica</option>
                </AppSelect>
              </FormField>
              <FormField label="Condición IVA" required>
                <AppSelect value={form.condicion_iva} onChange={set("condicion_iva")}>
                  <option value="">— Seleccioná —</option>
                  <option value="responsable_inscripto">Resp. Inscripto</option>
                  <option value="monotributo">Monotributo</option>
                  <option value="exento">Exento</option>
                  <option value="consumidor_final">Consumidor Final</option>
                </AppSelect>
              </FormField>
            </div>
            <FormField label="Email">
              <Input value={form.email} onChange={set("email")} type="email" placeholder="Ej: contacto@empresa.com" />
            </FormField>
            <FormField label="Teléfono">
              <Input value={form.telefono} onChange={set("telefono")} placeholder="Ej: 011 15-1234-5678" />
            </FormField>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <div className="flex justify-end pt-2">
              <button type="submit" disabled={saving} className="inline-flex items-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
