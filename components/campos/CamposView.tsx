"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, MapPin, ChevronRight } from "lucide-react";
import { PageShell, DataTable, EmptyState } from "@/components/app";
import { Button } from "@/components/ui/button";
import { CampoFormDialog, type CampoFormData } from "./CampoFormDialog";
import type { CampoListRow } from "./CamposContainer";

type Props = {
  campos:   CampoListRow[];
  loading:  boolean;
  error:    string | null;
  onCreate: (data: CampoFormData) => Promise<void>;
};

export default function CamposView({ campos, loading, error, onCreate }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const columns = useMemo<ColumnDef<CampoListRow, unknown>[]>(() => [
    {
      accessorKey: "Nombre",
      header: "Nombre",
      cell: ({ row }) => (
        <Link href={`/campos/${row.original.Id_Campo}`} className="font-medium text-foreground hover:underline underline-offset-2">
          {row.original.Nombre}
        </Link>
      ),
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
      accessorKey: "Cabezas",
      header: "Cabezas",
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="text-right block font-semibold text-foreground tabular-nums">
          {row.original.Cabezas}
        </span>
      ),
    },
    {
      id: "acciones",
      header: "",
      enableSorting: false,
      size: 40,
      cell: ({ row }) => (
        <Link href={`/campos/${row.original.Id_Campo}`} className="flex justify-end text-muted-foreground">
          <ChevronRight size={16} />
        </Link>
      ),
    },
  ], []);

  return (
    <PageShell
      title="Campos"
      action={<Button size="icon" onClick={() => setModalOpen(true)}><Plus /></Button>}
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
            description="Creá tu primer campo para comenzar a gestionar establecimientos, lotes y rodeo."
            action={<Button onClick={() => setModalOpen(true)}><Plus />Nuevo Campo</Button>}
          />
        </div>
      ) : (
        <DataTable data={campos} columns={columns} loading={loading} />
      )}

      <CampoFormDialog open={modalOpen} onOpenChange={setModalOpen} campo={null} onSubmit={onCreate} />
    </PageShell>
  );
}
