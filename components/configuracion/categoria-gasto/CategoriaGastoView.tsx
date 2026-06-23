"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageShell, GridContainer, FormField } from "@/components/app";
import type { CategoriaGasto, CategoriaGastoFormData } from "./CategoriaGastoContainer";

const EMPTY_FORM: CategoriaGastoFormData = { nombre: "", descripcion: "", tasa_iva_habitual: 21.0 };

type Props = {
  categorias: CategoriaGasto[];
  loading: boolean;
  error: string | null;
  onCreate: (data: CategoriaGastoFormData) => Promise<void>;
  onUpdate: (id: string, data: CategoriaGastoFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export default function CategoriaGastoView({ categorias, loading, error, onCreate, onUpdate, onDelete }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CategoriaGasto | null>(null);
  const [form, setForm] = useState<CategoriaGastoFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setFormError(null); setModalOpen(true); };
  const openEdit = (cat: CategoriaGasto) => {
    setEditing(cat);
    setForm({ nombre: cat.nombre, descripcion: cat.descripcion ?? "", tasa_iva_habitual: cat.tasa_iva_habitual });
    setFormError(null); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(EMPTY_FORM); setFormError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) { setFormError("El nombre es obligatorio."); return; }
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
      title="Categorías de Gasto"
      description="Categorías de gastos de compra utilizadas en las facturas"
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
      ) : (
        <GridContainer>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/50">
                <TableHead className="text-muted-foreground">Nombre</TableHead>
                <TableHead className="text-muted-foreground">Descripción</TableHead>
                <TableHead className="text-muted-foreground text-right w-28">IVA habitual</TableHead>
                <TableHead className="w-32" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-12">No hay categorías cargadas.</TableCell>
                </TableRow>
              ) : (
                categorias.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.nombre}</TableCell>
                    <TableCell className="text-muted-foreground">{cat.descripcion ?? "—"}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{cat.tasa_iva_habitual}%</TableCell>
                    <TableCell>
                      {deleteConfirmId === cat.id ? (
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-xs text-muted-foreground">¿Eliminar?</span>
                          <Button variant="destructive" size="xs" onClick={() => handleDelete(cat.id)} disabled={deleting}>Sí</Button>
                          <Button variant="ghost" size="xs" onClick={() => setDeleteConfirmId(null)}>No</Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 justify-end">
                          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(cat)} aria-label="Editar"><Pencil size={15} /></Button>
                          <Button variant="ghost" size="icon-sm" className="hover:text-destructive hover:bg-destructive/10" onClick={() => { setDeleteError(null); setDeleteConfirmId(cat.id); }} aria-label="Eliminar"><Trash2 size={15} /></Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </GridContainer>
      )}

      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar categoría" : "Nueva categoría de gasto"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <FormField label="Nombre" required>
              <Input value={form.nombre} onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Ej: Combustible" />
            </FormField>
            <FormField label="Descripción">
              <Input value={form.descripcion} onChange={(e) => setForm(f => ({ ...f, descripcion: e.target.value }))} placeholder="Ej: Gasoil, nafta y lubricantes" />
            </FormField>
            <FormField label="IVA habitual (%)" required>
              <Input type="number" step="0.01" min="0" max="100" value={form.tasa_iva_habitual} onChange={(e) => setForm(f => ({ ...f, tasa_iva_habitual: parseFloat(e.target.value) || 0 }))} />
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
