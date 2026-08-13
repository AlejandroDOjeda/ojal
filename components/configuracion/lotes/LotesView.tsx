"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, Layers, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageShell, DataTable, FormField, SelectBox, EmptyState } from "@/components/app";
import type { Campo } from "@/contexts/CampoContext";
import type { LoteRow, LoteFormData } from "./LotesContainer";

const EMPTY_FORM: LoteFormData = { Id_Campo: "", Nombre: "" };
type Errors = Partial<Record<keyof LoteFormData, string>>;

type Props = {
  lotes:    LoteRow[];
  campos:   Campo[];
  loading:  boolean;
  error:    string | null;
  onCreate: (data: LoteFormData) => Promise<void>;
  onUpdate: (id: number, data: LoteFormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function LotesView({ lotes, campos, loading, error, onCreate, onUpdate, onDelete }: Props) {
  const [modalOpen, setModalOpen]             = useState(false);
  const [editing, setEditing]                 = useState<LoteRow | null>(null);
  const [form, setForm]                       = useState<LoteFormData>(EMPTY_FORM);
  const [saving, setSaving]                   = useState(false);
  const [formErrors, setFormErrors]           = useState<Errors>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting]               = useState(false);

  const campoOptions = campos.map((c) => ({ value: c.Id_Campo, label: c.Nombre }));

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setFormErrors({}); setModalOpen(true); };
  const openEdit = (l: LoteRow) => {
    setEditing(l);
    setForm({ Id_Campo: String(l.Id_Campo), Nombre: l.Nombre });
    setFormErrors({}); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(EMPTY_FORM); setFormErrors({}); };

  const setField = (field: keyof LoteFormData, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    if (formErrors[field]) setFormErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.Id_Campo) e.Id_Campo = "Obligatorio";
    if (!form.Nombre.trim()) e.Nombre = "Obligatorio";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setSaving(true);
    try {
      editing ? await onUpdate(editing.Id_Lote, form) : await onCreate(form);
      toast.success(editing ? "Lote actualizado." : "Lote creado.");
      closeModal();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      await onDelete(id);
      setDeleteConfirmId(null);
      toast.success("Lote eliminado.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo<ColumnDef<LoteRow, unknown>[]>(() => [
    {
      accessorKey: "Nombre",
      header: "Nombre",
      cell: ({ row }) => <span className="font-medium">{row.original.Nombre}</span>,
    },
    {
      id: "campo",
      header: "Campo",
      accessorFn: (row) => row.Campo?.Nombre ?? "",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.Campo?.Nombre ?? "—"}</span>,
    },
    {
      id: "acciones",
      header: "",
      enableSorting: false,
      size: 120,
      cell: ({ row }) => {
        const l = row.original;
        return deleteConfirmId === l.Id_Lote ? (
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs text-muted-foreground">¿Eliminar?</span>
            <Button variant="destructive" size="xs" onClick={() => handleDelete(l.Id_Lote)} disabled={deleting}>Sí</Button>
            <Button variant="ghost" size="xs" onClick={() => setDeleteConfirmId(null)}>No</Button>
          </div>
        ) : (
          <div className="flex items-center gap-1 justify-end">
            <Button variant="ghost" size="icon-sm" onClick={() => openEdit(l)}><Pencil size={15} /></Button>
            <Button variant="ghost" size="icon-sm" className="hover:text-destructive hover:bg-destructive/10"
              onClick={() => setDeleteConfirmId(l.Id_Lote)}><Trash2 size={15} /></Button>
          </div>
        );
      },
    },
  ], [deleteConfirmId, deleting]);

  return (
    <PageShell
      title="Lotes"
      action={<Button size="icon" onClick={openCreate} disabled={campos.length === 0}><Plus /></Button>}
    >
      {error && (
        <div className="mb-3 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {campos.length === 0 && !loading ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card text-center p-8">
          <EmptyState
            icon={<Layers size={48} />}
            title="Todavía no hay campos"
            description="Creá un campo primero — los lotes son subdivisiones de un campo."
          />
        </div>
      ) : lotes.length === 0 && !loading ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card text-center p-8">
          <EmptyState
            icon={<Layers size={48} />}
            title="No hay lotes cargados"
            description="Creá tu primer lote para empezar a llevar el rodeo por potrero."
            action={<Button onClick={openCreate}><Plus />Nuevo Lote</Button>}
          />
        </div>
      ) : (
        <DataTable data={lotes} columns={columns} loading={loading} />
      )}

      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar lote" : "Nuevo lote"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <FormField label="Campo" required error={formErrors.Id_Campo}>
              <SelectBox
                options={campoOptions}
                value={form.Id_Campo || null}
                onValueChange={(v) => setField("Id_Campo", v)}
                placeholder="— Seleccioná —"
                disabled={!!editing}
                error={!!formErrors.Id_Campo}
              />
            </FormField>
            <FormField label="Nombre" required error={formErrors.Nombre}>
              <Input
                value={form.Nombre}
                onChange={(e) => setField("Nombre", e.target.value)}
                placeholder="Ej: Lote Norte"
                aria-invalid={!!formErrors.Nombre}
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
    </PageShell>
  );
}
