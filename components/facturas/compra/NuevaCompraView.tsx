"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageShell, SectionCard, SelectBox } from "@/components/app";
import { FacturaHeaderForm } from "@/components/facturas/FacturaHeaderForm";
import { FacturaTotales } from "@/components/facturas/FacturaTotales";
import { useLeaveConfirmation } from "@/hooks/useLeaveConfirmation";
import { TASA_IVA_OPTIONS } from "@/lib/opciones";
import {
  EMPTY_HEADER, EMPTY_ITEM_GASTO, calcItemGastoSubtotal, calcTotalesGasto, formatARS,
  type FacturaHeaderData, type ItemGastoForm,
} from "@/components/facturas/types";
import type { CategoriaGastoOption, EntidadOption } from "./NuevaCompraContainer";

type Props = {
  entidades: EntidadOption[];
  categorias: CategoriaGastoOption[];
  loadingData: boolean;
  onSave: (header: FacturaHeaderData, items: ItemGastoForm[]) => Promise<void>;
};

let keyCounter = 0;
const newKey = () => String(++keyCounter);

export default function NuevaCompraView({ entidades, categorias, loadingData, onSave }: Props) {
  const router = useRouter();
  const [header, setHeader] = useState<FacturaHeaderData>(EMPTY_HEADER);
  const [items, setItems] = useState<ItemGastoForm[]>([{ _key: newKey(), ...EMPTY_ITEM_GASTO }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const isDirty = useRef(false);

  useLeaveConfirmation(isDirty.current);
  const markDirty = () => { isDirty.current = true; };

  const setHeaderField = <K extends keyof FacturaHeaderData>(field: K, value: FacturaHeaderData[K]) => {
    markDirty(); setHeader((h) => ({ ...h, [field]: value }));
  };

  const addItem = () => { markDirty(); setItems((p) => [...p, { _key: newKey(), ...EMPTY_ITEM_GASTO }]); };
  const removeItem = (key: string) => { markDirty(); setItems((p) => p.filter((i) => i._key !== key)); };

  const updateItem = (key: string, field: keyof Omit<ItemGastoForm, "_key">, value: string) => {
    markDirty();
    setItems((p) => p.map((item) => {
      if (item._key !== key) return item;
      const updated = { ...item, [field]: value };
      if (field === "Id_CategoriaGasto") {
        const cat = categorias.find((c) => String(c.id) === value);
        if (cat) updated.TasaIva = String(cat.TasaIvaHabitual);
      }
      return updated;
    }));
  };

  const validate = (): string | null => {
    if (!header.Id_TipoComprobante) return "Seleccioná el tipo de comprobante.";
    if (!header.Fecha) return "La fecha es obligatoria.";
    if (!header.Id_EntidadLegal) return "Seleccioná el proveedor.";
    if (header.Id_CondicionPago === "2" && !header.FechaVencimiento) return "Ingresá la fecha de vencimiento.";
    if (items.length === 0) return "Agregá al menos un ítem.";
    for (const item of items) {
      if (!item.Descripcion.trim()) return "Todos los ítems deben tener descripción.";
      if (!item.Cantidad || parseFloat(item.Cantidad) <= 0) return "La cantidad debe ser mayor a 0.";
      if (!item.PrecioUnitario || parseFloat(item.PrecioUnitario) <= 0) return "El precio unitario debe ser mayor a 0.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(); if (v) { setError(v); return; }
    setSaving(true); setError(null);
    try { await onSave(header, items); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Error al guardar."); setSaving(false); }
  };

  const handleCancel = () => { if (isDirty.current) setShowExitDialog(true); else router.push("/facturas"); };

  const categoriasOptions = categorias.map((c) => ({ value: c.id, label: c.Nombre }));
  const totales = calcTotalesGasto(items);
  const backLink = (
    <Link href="#" onClick={(e) => { e.preventDefault(); handleCancel(); }}>
      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground -ml-2"><ArrowLeft size={14} />Volver a Facturas</Button>
    </Link>
  );

  if (loadingData) return <PageShell title="Nueva Factura de Compra" back={backLink} className="max-w-5xl"><p className="text-muted-foreground">Cargando...</p></PageShell>;

  return (
    <PageShell title="Nueva Factura de Compra" back={backLink} className="max-w-5xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FacturaHeaderForm data={header} entidades={entidades} entidadLabel="Proveedor" onChange={setHeaderField} />

        <SectionCard title="Ítems">
          <div className="flex justify-end mb-3">
            <Button type="button" variant="ghost" size="sm" onClick={addItem} className="gap-1.5"><Plus size={15} />Agregar ítem</Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Descripción</TableHead>
                  <TableHead className="text-muted-foreground w-44">Categoría</TableHead>
                  <TableHead className="text-muted-foreground text-right w-24">Cantidad</TableHead>
                  <TableHead className="text-muted-foreground text-right w-32">Precio unit.</TableHead>
                  <TableHead className="text-muted-foreground text-right w-24">IVA %</TableHead>
                  <TableHead className="text-muted-foreground text-right w-32">Subtotal</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item._key} className="hover:bg-transparent">
                    <TableCell className="pr-3">
                      <Input value={item.Descripcion} onChange={(e) => updateItem(item._key, "Descripcion", e.target.value)} placeholder="Descripción" />
                    </TableCell>
                    <TableCell className="px-3">
                      <SelectBox
                        options={categoriasOptions}
                        value={item.Id_CategoriaGasto}
                        onValueChange={(v) => updateItem(item._key, "Id_CategoriaGasto", v)}
                        placeholder="— Sin categoría —"
                      />
                    </TableCell>
                    <TableCell className="px-3">
                      <Input type="number" min="0" step="0.001" value={item.Cantidad} onChange={(e) => updateItem(item._key, "Cantidad", e.target.value)} className="text-right" />
                    </TableCell>
                    <TableCell className="px-3">
                      <Input type="number" min="0" step="0.01" value={item.PrecioUnitario} onChange={(e) => updateItem(item._key, "PrecioUnitario", e.target.value)} placeholder="0,00" className="text-right" />
                    </TableCell>
                    <TableCell className="px-3">
                      <SelectBox
                        options={TASA_IVA_OPTIONS}
                        value={item.TasaIva}
                        onValueChange={(v) => updateItem(item._key, "TasaIva", v || "21")}
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium whitespace-nowrap pl-3">{formatARS(calcItemGastoSubtotal(item))}</TableCell>
                    <TableCell className="pl-2">
                      {items.length > 1 && (
                        <Button type="button" variant="ghost" size="icon-sm" className="hover:text-destructive hover:bg-destructive/10" onClick={() => removeItem(item._key)}>
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <FacturaTotales totales={totales} />

        {error && <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={handleCancel}>Cancelar</Button>
          <Button type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar y confirmar"}</Button>
        </div>
      </form>

      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent showCloseButton={false}>
          <DialogHeader><DialogTitle>¿Salir sin guardar?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Se perderán todos los cambios realizados en esta factura.</p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowExitDialog(false)}>Quedarme</Button>
            <Button variant="destructive" onClick={() => router.push("/facturas")}>Salir</Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
