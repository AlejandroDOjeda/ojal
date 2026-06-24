"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TASA_IVA_OPTIONS, TASA_IVA_ITEMS } from "@/lib/opciones";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageShell, GridContainer, FormField } from "@/components/app";
import type { CategoriaHacienda, CategoriaHaciendaFormData } from "./CategoriaHaciendaContainer";

const EMPTY_FORM: CategoriaHaciendaFormData = { Nombre: "", Descripcion: "", TasaIva: 10.5 };

type Props = {
  categorias: CategoriaHacienda[];
  loading: boolean;
  error: string | null;
  onCreate: (data: CategoriaHaciendaFormData) => Promise<void>;
  onUpdate: (id: number, data: CategoriaHaciendaFormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function CategoriaHaciendaView({ categorias, loading, error, onCreate, onUpdate, onDelete }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CategoriaHacienda | null>(null);
  const [form, setForm] = useState<CategoriaHaciendaFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setFormError(null); setModalOpen(true); };
  const openEdit = (cat: CategoriaHacienda) => {
    setEditing(cat); setForm({ Nombre: cat.Nombre, Descripcion: cat.Descripcion ?? "", TasaIva: cat.TasaIva });
    setFormError(null); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(EMPTY_FORM); setFormError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.Nombre.trim()) { setFormError("El nombre es obligatorio."); return; }
    setSaving(true); setFormError(null);
    try { editing ? await onUpdate(editing.Id_CategoriaHacienda, form) : await onCreate(form); closeModal(); }
    catch (err: unknown) { setFormError(err instanceof Error ? err.message : "Error al guardar."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    setDeleting(true); setDeleteError(null);
    try { await onDelete(id); setDeleteConfirmId(null); }
    catch (err: unknown) { setDeleteError(err instanceof Error ? err.message : "No se pudo eliminar."); }
    finally { setDeleting(false); }
  };

  return (
    <PageShell title="Categorías de Hacienda" description="Categorías de ganado vacuno utilizadas en las facturas"
      action={<Button size="icon" onClick={openCreate}><Plus /></Button>}>
      {error && <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}
      {deleteError && (
        <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center justify-between">
          {deleteError}<Button variant="link" size="xs" onClick={() => setDeleteError(null)}>Cerrar</Button>
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
                <TableHead className="text-muted-foreground text-right w-28">Tasa IVA</TableHead>
                <TableHead className="w-32" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorias.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-12">No hay categorías cargadas.</TableCell></TableRow>
              ) : (
                categorias.map((cat) => (
                  <TableRow key={cat.Id_CategoriaHacienda}>
                    <TableCell className="font-medium">{cat.Nombre}</TableCell>
                    <TableCell className="text-muted-foreground">{cat.Descripcion ?? "—"}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{cat.TasaIva}%</TableCell>
                    <TableCell>
                      {deleteConfirmId === cat.Id_CategoriaHacienda ? (
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-xs text-muted-foreground">¿Eliminar?</span>
                          <Button variant="destructive" size="xs" onClick={() => handleDelete(cat.Id_CategoriaHacienda)} disabled={deleting}>Sí</Button>
                          <Button variant="ghost" size="xs" onClick={() => setDeleteConfirmId(null)}>No</Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 justify-end">
                          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(cat)}><Pencil size={15} /></Button>
                          <Button variant="ghost" size="icon-sm" className="hover:text-destructive hover:bg-destructive/10"
                            onClick={() => { setDeleteError(null); setDeleteConfirmId(cat.Id_CategoriaHacienda); }}><Trash2 size={15} /></Button>
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
          <DialogHeader><DialogTitle>{editing ? "Editar categoría" : "Nueva categoría"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <FormField label="Nombre" required>
              <Input value={form.Nombre} onChange={(e) => setForm(f => ({ ...f, Nombre: e.target.value }))} placeholder="Ej: Ternero" />
            </FormField>
            <FormField label="Descripción">
              <Input value={form.Descripcion} onChange={(e) => setForm(f => ({ ...f, Descripcion: e.target.value }))} placeholder="Ej: Macho menor de 1 año" />
            </FormField>
            <FormField label="Tasa IVA" required>
              <Select
                items={TASA_IVA_ITEMS}
                value={String(form.TasaIva)}
                onValueChange={(v) => setForm(f => ({ ...f, TasaIva: parseFloat(v ?? "10.5") }))}
              >
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TASA_IVA_OPTIONS.map((o) => <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
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
