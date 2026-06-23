"use client";

import { useState } from "react";
import { Plus, Building2, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageShell, GridContainer, FormField, EmptyState } from "@/components/app";
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
  razon_social: "", cuit_cuil: "", tipo_persona: "", condicion_iva: "", email: "", telefono: "",
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

  const setField = (field: keyof EntidadLegalFormData, value: string) => setForm(f => ({ ...f, [field]: value }));

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

  return (
    <PageShell
      title="Entidades Legales"
      description="Administrá las entidades legales del sistema"
      action={<Button size="icon" onClick={openCreate}><Plus /></Button>}
    >
      {error && <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}
      {deleteError && (
        <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center justify-between">
          {deleteError}
          <Button variant="link" size="xs" onClick={() => setDeleteError(null)}>Cerrar</Button>
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
            action={<Button onClick={openCreate}><Plus />Nueva Entidad Legal</Button>}
          />
        </GridContainer>
      ) : (
        <GridContainer>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/50">
                <TableHead className="text-muted-foreground">Razón Social</TableHead>
                <TableHead className="text-muted-foreground">CUIT / CUIL</TableHead>
                <TableHead className="text-muted-foreground">Tipo</TableHead>
                <TableHead className="text-muted-foreground">Condición IVA</TableHead>
                <TableHead className="w-32" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {entidades.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.razon_social}</TableCell>
                  <TableCell className="text-muted-foreground">{e.cuit_cuil}</TableCell>
                  <TableCell className="text-muted-foreground">{TIPO_LABEL[e.tipo_persona]}</TableCell>
                  <TableCell className="text-muted-foreground">{CONDICION_LABEL[e.condicion_iva]}</TableCell>
                  <TableCell>
                    {deleteConfirmId === e.id ? (
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs text-muted-foreground">¿Eliminar?</span>
                        <Button variant="destructive" size="xs" onClick={() => handleDelete(e.id)} disabled={deleting}>Sí</Button>
                        <Button variant="ghost" size="xs" onClick={() => setDeleteConfirmId(null)}>No</Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(e)} aria-label="Editar"><Pencil size={15} /></Button>
                        <Button variant="ghost" size="icon-sm" className="hover:text-destructive hover:bg-destructive/10" onClick={() => { setDeleteError(null); setDeleteConfirmId(e.id); }} aria-label="Eliminar"><Trash2 size={15} /></Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GridContainer>
      )}

      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar entidad legal" : "Nueva entidad legal"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <FormField label="Razón Social" required>
              <Input value={form.razon_social} onChange={(e) => setField("razon_social", e.target.value)} placeholder="Ej: García & Asociados S.A." />
            </FormField>
            <FormField label="CUIT / CUIL" required>
              <Input value={form.cuit_cuil} onChange={(e) => setField("cuit_cuil", e.target.value)} placeholder="Ej: 20-12345678-9" />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Tipo" required>
                <Select value={form.tipo_persona || undefined} onValueChange={(v) => setField("tipo_persona", v ?? "")}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="— Seleccioná —" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fisica">Persona Física</SelectItem>
                    <SelectItem value="juridica">Persona Jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Condición IVA" required>
                <Select value={form.condicion_iva || undefined} onValueChange={(v) => setField("condicion_iva", v ?? "")}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="— Seleccioná —" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="responsable_inscripto">Resp. Inscripto</SelectItem>
                    <SelectItem value="monotributo">Monotributo</SelectItem>
                    <SelectItem value="exento">Exento</SelectItem>
                    <SelectItem value="consumidor_final">Consumidor Final</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <FormField label="Email">
              <Input value={form.email} onChange={(e) => setField("email", e.target.value)} type="email" placeholder="Ej: contacto@empresa.com" />
            </FormField>
            <FormField label="Teléfono">
              <Input value={form.telefono} onChange={(e) => setField("telefono", e.target.value)} placeholder="Ej: 011 15-1234-5678" />
            </FormField>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
