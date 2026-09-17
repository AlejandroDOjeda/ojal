"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Layers, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageShell, SectionCard, EmptyState } from "@/components/app";
import { CampoFormDialog, type CampoFormData } from "../CampoFormDialog";
import { LoteFormDialog } from "./LoteFormDialog";
import type { CampoRow } from "../CamposContainer";
import type { LoteRow, LoteFormData } from "./CampoDetalleContainer";

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex gap-2 text-sm">
    <span className="text-muted-foreground w-32 shrink-0">{label}</span>
    <span className="text-foreground font-medium">{value}</span>
  </div>
);

const backLink = (
  <Link href="/campos">
    <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground -ml-2"><ArrowLeft size={14} />Volver a Campos</Button>
  </Link>
);

type Props = {
  campo: CampoRow | null;
  lotes: LoteRow[];
  loading: boolean;
  notFound: boolean;
  error: string | null;
  onUpdateCampo: (data: CampoFormData) => Promise<void>;
  onDeleteCampo: () => Promise<void>;
  onCreateLote: (data: LoteFormData) => Promise<void>;
  onUpdateLote: (id: number, data: LoteFormData) => Promise<void>;
  onDeleteLote: (id: number) => Promise<void>;
};

export default function CampoDetalleView({
  campo, lotes, loading, notFound, error,
  onUpdateCampo, onDeleteCampo, onCreateLote, onUpdateLote, onDeleteLote,
}: Props) {
  const [editCampoOpen, setEditCampoOpen]   = useState(false);
  const [confirmDeleteCampo, setConfirmDeleteCampo] = useState(false);
  const [deletingCampo, setDeletingCampo]   = useState(false);

  const [loteDialogOpen, setLoteDialogOpen] = useState(false);
  const [editingLote, setEditingLote]       = useState<LoteRow | null>(null);
  const [confirmDeleteLoteId, setConfirmDeleteLoteId] = useState<number | null>(null);
  const [deletingLote, setDeletingLote]     = useState(false);

  const openCreateLote = () => { setEditingLote(null); setLoteDialogOpen(true); };
  const openEditLote = (l: LoteRow) => { setEditingLote(l); setLoteDialogOpen(true); };

  const totalCabezas = lotes.reduce((sum, l) => sum + l.Cabezas, 0);

  const handleDeleteCampo = async () => {
    setDeletingCampo(true);
    try {
      await onDeleteCampo();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar.");
      setConfirmDeleteCampo(false);
    } finally {
      setDeletingCampo(false);
    }
  };

  const handleDeleteLote = async (id: number) => {
    setDeletingLote(true);
    try {
      await onDeleteLote(id);
      setConfirmDeleteLoteId(null);
      toast.success("Lote eliminado.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar.");
    } finally {
      setDeletingLote(false);
    }
  };

  if (loading && !campo) {
    return <PageShell title="Campo" back={backLink}><p className="text-muted-foreground">Cargando...</p></PageShell>;
  }

  if (notFound || !campo) {
    return (
      <PageShell title="Campo no encontrado" back={backLink}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MapPin size={48} className="text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">Este campo no existe o no tenés acceso a él.</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={campo.Nombre}
      back={backLink}
      action={
        confirmDeleteCampo ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">¿Eliminar campo?</span>
            <Button variant="destructive" size="sm" onClick={handleDeleteCampo} disabled={deletingCampo}>Sí</Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteCampo(false)}>No</Button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => setEditCampoOpen(true)}><Pencil size={15} /></Button>
            <Button variant="ghost" size="icon-sm" className="hover:text-destructive hover:bg-destructive/10" onClick={() => setConfirmDeleteCampo(true)}><Trash2 size={15} /></Button>
          </div>
        )
      }
    >
      <div className="space-y-6">
        <SectionCard title="Datos del campo">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow label="RENSPA" value={campo.Renspa ?? "—"} />
            <InfoRow label="Ubicación" value={campo.Ubicacion ?? "—"} />
            <InfoRow label="Superficie" value={campo.Superficie != null ? `${campo.Superficie.toLocaleString("es-AR")} ha` : "—"} />
            <InfoRow label="Cabezas totales" value={loading ? "—" : totalCabezas} />
          </div>
        </SectionCard>

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Lotes</h2>
            <Button size="sm" onClick={openCreateLote}><Plus size={14} />Nuevo lote</Button>
          </div>

          {lotes.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card text-center p-8">
              <EmptyState
                icon={<Layers size={40} />}
                title="Este campo todavía no tiene lotes"
                description="Creá el primer lote para empezar a llevar el rodeo por potrero."
                action={<Button onClick={openCreateLote}><Plus size={14} />Nuevo lote</Button>}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lotes.map((lote) => (
                <div key={lote.Id_Lote} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/campos/${campo.Id_Campo}/lotes/${lote.Id_Lote}`}
                      className="font-semibold text-foreground hover:underline underline-offset-2"
                    >
                      {lote.Nombre}
                    </Link>
                    {confirmDeleteLoteId === lote.Id_Lote ? (
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Button variant="destructive" size="xs" onClick={() => handleDeleteLote(lote.Id_Lote)} disabled={deletingLote}>Sí</Button>
                        <Button variant="ghost" size="xs" onClick={() => setConfirmDeleteLoteId(null)}>No</Button>
                      </div>
                    ) : (
                      <div className="flex shrink-0 items-center gap-0.5">
                        <Button variant="ghost" size="icon-sm" onClick={() => openEditLote(lote)}><Pencil size={13} /></Button>
                        <Button variant="ghost" size="icon-sm" className="hover:text-destructive hover:bg-destructive/10" onClick={() => setConfirmDeleteLoteId(lote.Id_Lote)}><Trash2 size={13} /></Button>
                      </div>
                    )}
                  </div>

                  <span className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground tabular-nums">{lote.Cabezas}</span> cabezas
                  </span>

                  <Link
                    href={`/campos/${campo.Id_Campo}/lotes/${lote.Id_Lote}`}
                    className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Ver detalle
                    <ChevronRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CampoFormDialog open={editCampoOpen} onOpenChange={setEditCampoOpen} campo={campo} onSubmit={onUpdateCampo} />
      <LoteFormDialog open={loteDialogOpen} onOpenChange={setLoteDialogOpen} lote={editingLote}
        onSubmit={(data) => editingLote ? onUpdateLote(editingLote.Id_Lote, data) : onCreateLote(data)} />
    </PageShell>
  );
}
