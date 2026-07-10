"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageShell, DataTable, FormField, EmptyState } from "@/components/app";
import { formatRenspa, renspaToDigits } from "@/lib/formato";
import { validarRenspa } from "@/lib/validaciones";
import type { CampoRow, CampoFormData } from "./CamposContainer";

const EMPTY_FORM: CampoFormData = { Nombre: "", Renspa: "", Ubicacion: "", Superficie: "" };
type Errors = Partial<Record<keyof CampoFormData, string>>;

type Props = {
  campos:   CampoRow[];
  loading:  boolean;
  error:    string | null;
  onCreate: (data: CampoFormData) => Promise<void>;
  onUpdate: (id: number, data: CampoFormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function CamposView({ campos, loading, error, onCreate, onUpdate, onDelete }: Props) {
  const [modalOpen, setModalOpen]           = useState(false);
  const [editing, setEditing]               = useState<CampoRow | null>(null);
  const [form, setForm]                     = useState<CampoFormData>(EMPTY_FORM);
  const [saving, setSaving]                 = useState(false);
  const [formErrors, setFormErrors]         = useState<Errors>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting]             = useState(false);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setFormErrors({}); setModalOpen(true); };
  const openEdit = (c: CampoRow) => {
    setEditing(c);
    setForm({
      Nombre:     c.Nombre,
      Renspa:     (c.Renspa ?? "").replace(/\D/g, ""),  // guardar dígitos en state
      Ubicacion:  c.Ubicacion ?? "",
      Superficie: c.Superficie != null ? String(c.Superficie) : "",
    });
    setFormErrors({}); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(EMPTY_FORM); setFormErrors({}); };

  const setField = (field: keyof CampoFormData, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    if (formErrors[field]) setFormErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.Nombre.trim()) e.Nombre = "Obligatorio";
    if (form.Renspa && !validarRenspa(form.Renspa)) e.Renspa = "Formato inválido — debe tener 13 dígitos (XX.XXX.X.XXXXX/XX)";
    if (form.Superficie) {
      const sup = parseFloat(form.Superficie);
      if (isNaN(sup) || sup <= 0) e.Superficie = "Debe ser un número mayor que 0";
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setSaving(true);
    try {
      editing ? await onUpdate(editing.Id_Campo, form) : await onCreate(form);
      toast.success(editing ? "Campo actualizado." : "Campo creado.");
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
      toast.success("Campo eliminado.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo<ColumnDef<CampoRow, unknown>[]>(() => [
    {
      accessorKey: "Nombre",
      header: "Nombre",
      cell: ({ row }) => <span className="font-medium">{row.original.Nombre}</span>,
    },
    {
      accessorKey: "Renspa",
      header: "RENSPA",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.Renspa ?? "—"}</span>,
    },
    {
      accessorKey: "Ubicacion",
      header: "Ubicación",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.Ubicacion ?? "—"}</span>,
    },
    {
      accessorKey: "Superficie",
      header: "Superficie (ha)",
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">
          {row.original.Superficie != null ? row.original.Superficie.toLocaleString("es-AR") : "—"}
        </span>
      ),
    },
    {
      id: "acciones",
      header: "",
      enableSorting: false,
      size: 120,
      cell: ({ row }) => {
        const c = row.original;
        return deleteConfirmId === c.Id_Campo ? (
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs text-muted-foreground">¿Eliminar?</span>
            <Button variant="destructive" size="xs" onClick={() => handleDelete(c.Id_Campo)} disabled={deleting}>Sí</Button>
            <Button variant="ghost" size="xs" onClick={() => setDeleteConfirmId(null)}>No</Button>
          </div>
        ) : (
          <div className="flex items-center gap-1 justify-end">
            <Button variant="ghost" size="icon-sm" onClick={() => openEdit(c)}><Pencil size={15} /></Button>
            <Button variant="ghost" size="icon-sm" className="hover:text-destructive hover:bg-destructive/10"
              onClick={() => setDeleteConfirmId(c.Id_Campo)}><Trash2 size={15} /></Button>
          </div>
        );
      },
    },
  ], [deleteConfirmId, deleting]);

  return (
    <PageShell
      title="Campos"
      action={<Button size="icon" onClick={openCreate}><Plus /></Button>}
    >
      {error && (
        <div className="mb-3 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {campos.length === 0 && !loading ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card text-center p-8">
          <EmptyState
            icon={<MapPin size={48} />}
            title="No hay campos cargados"
            description="Creá tu primer campo para comenzar a gestionar establecimientos."
            action={<Button onClick={openCreate}><Plus />Nuevo Campo</Button>}
          />
        </div>
      ) : (
        <DataTable data={campos} columns={columns} loading={loading} />
      )}

      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar campo" : "Nuevo campo"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <FormField label="Nombre" required error={formErrors.Nombre}>
              <Input
                value={form.Nombre}
                onChange={(e) => setField("Nombre", e.target.value)}
                placeholder="Ej: Campo Norte"
                aria-invalid={!!formErrors.Nombre}
              />
            </FormField>
            <FormField label="RENSPA" error={formErrors.Renspa}>
              <Input
                value={formatRenspa(form.Renspa)}
                onChange={(e) => setField("Renspa", renspaToDigits(e.target.value))}
                placeholder="12.345.6.78901/12"
                inputMode="numeric"
                maxLength={18}
                aria-invalid={!!formErrors.Renspa}
              />
            </FormField>
            <FormField label="Ubicación" error={formErrors.Ubicacion}>
              <Input
                value={form.Ubicacion}
                onChange={(e) => setField("Ubicacion", e.target.value)}
                placeholder="Ej: Partido de Azul, Buenos Aires"
              />
            </FormField>
            <FormField label="Superficie (hectáreas)" error={formErrors.Superficie}>
              <Input
                value={form.Superficie}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9.]/g, "");
                  const parts = v.split(".");
                  const clean = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : v;
                  setField("Superficie", clean);
                }}
                placeholder="Ej: 1500"
                inputMode="decimal"
                min={0}
                aria-invalid={!!formErrors.Superficie}
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
