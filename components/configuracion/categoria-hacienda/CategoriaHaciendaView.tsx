"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageShell, DataTable, FormField, SelectBox } from "@/components/app";
import { TASA_IVA_OPTIONS } from "@/lib/opciones";
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
    setDeleting(true);
    try { await onDelete(id); setDeleteConfirmId(null); }
    catch (err: unknown) { setDeleteError(err instanceof Error ? err.message : "No se pudo eliminar."); }
    finally { setDeleting(false); }
  };

  const columns = useMemo<ColumnDef<CategoriaHacienda, unknown>[]>(() => [
    { accessorKey: "Nombre", header: "Nombre", cell: ({ row }) => <span className="font-medium">{row.original.Nombre}</span> },
    { accessorKey: "Descripcion", header: "Descripción", cell: ({ row }) => <span className="text-muted-foreground">{row.original.Descripcion ?? "—"}</span> },
    { accessorKey: "TasaIva", header: "Tasa IVA", size: 110, cell: ({ row }) => <span className="text-muted-foreground">{row.original.TasaIva}%</span> },
    {
      id: "acciones", header: "", enableSorting: false, size: 120,
      cell: ({ row }) => {
        const cat = row.original;
        return deleteConfirmId === cat.Id_CategoriaHacienda ? (
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
        );
      },
    },
  ], [deleteConfirmId, deleting]);

  return (
    <PageShell title="Categorías de Hacienda" description="Categorías de ganado vacuno utilizadas en las facturas"
      action={<Button size="icon" onClick={openCreate}><Plus /></Button>}>
      {error && <div className="mb-3 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}
      {deleteError && (
        <div className="mb-3 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center justify-between">
          {deleteError}<Button variant="link" size="xs" onClick={() => setDeleteError(null)}>Cerrar</Button>
        </div>
      )}
      <DataTable data={categorias} columns={columns} loading={loading} />

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
              <SelectBox
                options={TASA_IVA_OPTIONS}
                value={String(form.TasaIva)}
                onValueChange={(v) => setForm(f => ({ ...f, TasaIva: parseFloat(v || "10.5") }))}
              />
            </FormField>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <div className="flex justify-end pt-2"><Button type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
