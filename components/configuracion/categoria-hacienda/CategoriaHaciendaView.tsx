"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CategoriaHacienda, CategoriaHaciendaFormData } from "./CategoriaHaciendaContainer";

const EMPTY_FORM: CategoriaHaciendaFormData = { nombre: "", descripcion: "", tasa_iva: 10.5 };

type Props = {
  categorias: CategoriaHacienda[];
  loading: boolean;
  error: string | null;
  onCreate: (data: CategoriaHaciendaFormData) => Promise<void>;
  onUpdate: (id: string, data: CategoriaHaciendaFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export default function CategoriaHaciendaView({
  categorias,
  loading,
  error,
  onCreate,
  onUpdate,
  onDelete,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CategoriaHacienda | null>(null);
  const [form, setForm] = useState<CategoriaHaciendaFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (cat: CategoriaHacienda) => {
    setEditing(cat);
    setForm({ nombre: cat.nombre, descripcion: cat.descripcion ?? "", tasa_iva: cat.tasa_iva });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) { setFormError("El nombre es obligatorio."); return; }
    setSaving(true);
    setFormError(null);
    try {
      editing ? await onUpdate(editing.id, form) : await onCreate(form);
      closeModal();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteError(null);
    setDeleteConfirmId(id);
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await onDelete(id);
      setDeleteConfirmId(null);
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : "No se pudo eliminar.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="p-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categorías de Hacienda</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Categorías de ganado vacuno utilizadas en las facturas
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Error global */}
      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Error de eliminación */}
      {deleteError && (
        <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center justify-between">
          {deleteError}
          <button onClick={() => setDeleteError(null)} className="ml-4 underline text-xs">Cerrar</button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Descripción</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground w-28">Tasa IVA</th>
                <th className="px-4 py-3 w-32" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categorias.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                    No hay categorías cargadas.
                  </td>
                </tr>
              ) : (
                categorias.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{cat.nombre}</td>
                    <td className="px-4 py-3 text-muted-foreground">{cat.descripcion ?? "—"}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{cat.tasa_iva}%</td>
                    <td className="px-4 py-3">
                      {deleteConfirmId === cat.id ? (
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-xs text-muted-foreground">¿Eliminar?</span>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            disabled={deleting}
                            className="text-xs font-medium text-destructive hover:underline disabled:opacity-50"
                          >
                            Sí
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-xs text-muted-foreground hover:underline"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => openEdit(cat)}
                            className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            aria-label="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => confirmDelete(cat.id)}
                            className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                            aria-label="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal crear / editar */}
      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Nombre <span className="text-destructive">*</span>
              </label>
              <Input
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                placeholder="Ej: Ternero"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Descripción</label>
              <Input
                value={form.descripcion}
                onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                placeholder="Ej: Macho menor de 1 año"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Tasa IVA (%) <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={form.tasa_iva}
                onChange={(e) => setForm((f) => ({ ...f, tasa_iva: parseFloat(e.target.value) || 0 }))}
              />
            </div>

            {formError && <p className="text-sm text-destructive">{formError}</p>}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
