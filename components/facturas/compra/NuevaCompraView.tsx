"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageShell, SectionCard, SelectBox, Combobox } from "@/components/app";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { FacturaHeaderForm, type FacturaHeaderErrors } from "@/components/facturas/FacturaHeaderForm";
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
  initialHeader?: FacturaHeaderData;
  initialItems?: ItemGastoForm[];
  title?: string;
  cancelPath?: string;
  onSave: (header: FacturaHeaderData, items: ItemGastoForm[]) => Promise<void>;
};

let keyCounter = 0;
const newKey = () => String(++keyCounter);

type ItemGastoErrors = Partial<Record<"Descripcion" | "Cantidad" | "PrecioUnitario", true>>;

export default function NuevaCompraView({ entidades, categorias, loadingData, initialHeader, initialItems, title, cancelPath, onSave }: Props) {
  const router = useRouter();
  const [header, setHeader] = useState<FacturaHeaderData>(initialHeader ?? EMPTY_HEADER);
  const [items, setItems] = useState<ItemGastoForm[]>(initialItems ?? [{ _key: newKey(), ...EMPTY_ITEM_GASTO }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [headerErrors, setHeaderErrors] = useState<FacturaHeaderErrors>({});
  const [itemErrors, setItemErrors] = useState<Record<string, ItemGastoErrors>>({});
  const [showExitDialog, setShowExitDialog] = useState(false);
  const isDirty = useRef(false);

  useLeaveConfirmation(isDirty.current);
  const markDirty = () => { isDirty.current = true; };

  const setHeaderField = <K extends keyof FacturaHeaderData>(field: K, value: FacturaHeaderData[K]) => {
    markDirty(); setHeader((h) => ({ ...h, [field]: value }));
  };

  const addItem = () => { markDirty(); setItems((p) => [...p, { _key: newKey(), ...EMPTY_ITEM_GASTO }]); };
  const removeItem = (key: string) => {
    markDirty();
    setItems((p) => p.filter((i) => i._key !== key));
    setItemErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

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
    setItemErrors((prev) => {
      const itemErr = prev[key];
      if (!itemErr?.[field as keyof ItemGastoErrors]) return prev;
      const next = { ...itemErr };
      delete next[field as keyof ItemGastoErrors];
      const result = { ...prev, [key]: next };
      if (Object.keys(next).length === 0) delete result[key];
      return result;
    });
  };

  const validate = (): boolean => {
    const hErrors: FacturaHeaderErrors = {};
    if (!header.Id_TipoComprobante) hErrors.Id_TipoComprobante = "Obligatorio";
    if (!header.PuntoVenta || parseInt(header.PuntoVenta) <= 0) hErrors.PuntoVenta = "Obligatorio";
    if (!header.Numero || parseInt(header.Numero) <= 0) hErrors.Numero = "Obligatorio";
    if (!header.Fecha) hErrors.Fecha = "Obligatorio";
    if (!header.Id_EntidadLegal) hErrors.Id_EntidadLegal = "Obligatorio";
    if (header.Id_CondicionPago === "2" && !header.FechaVencimiento) hErrors.FechaVencimiento = "Obligatorio";
    if (Object.keys(hErrors).length > 0) setHeaderErrors(hErrors);
    if (items.length === 0) { setError("Agregá al menos un ítem."); return false; }
    const newItemErrors: Record<string, ItemGastoErrors> = {};
    for (const item of items) {
      const err: ItemGastoErrors = {};
      if (!item.Descripcion.trim()) err.Descripcion = true;
      if (!item.Cantidad || parseFloat(item.Cantidad) <= 0) err.Cantidad = true;
      if (!item.PrecioUnitario || parseFloat(item.PrecioUnitario) <= 0) err.PrecioUnitario = true;
      if (Object.keys(err).length > 0) newItemErrors[item._key] = err;
    }
    setItemErrors(newItemErrors);
    if (Object.keys(newItemErrors).length > 0) { setError("Completá todos los campos obligatorios de los ítems."); return false; }
    return Object.keys(hErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) { toast.error("Complete los campos obligatorios"); return; }
    setSaving(true); setError(null);
    try { await onSave(header, items); }
    catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Error al guardar."); setSaving(false); }
  };

  const handleCancel = () => { if (isDirty.current) setShowExitDialog(true); else router.push(cancelPath ?? "/facturas?tab=compras"); };

  const categoriasOptions = categorias.map((c) => ({ value: c.id, label: c.Nombre }));
  const totales = calcTotalesGasto(items);
  const backLink = (
    <Link href="#" onClick={(e) => { e.preventDefault(); handleCancel(); }}>
      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground -ml-2"><ArrowLeft size={14} />Volver a Facturas</Button>
    </Link>
  );

  if (loadingData) return <PageShell title={title ?? "Nueva Factura de Compra"} back={backLink} className="max-w-none"><p className="text-muted-foreground">Cargando...</p></PageShell>;

  return (
    <PageShell title={title ?? "Nueva Factura de Compra"} back={backLink} className="max-w-none">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FacturaHeaderForm data={header} errors={headerErrors} entidades={entidades} entidadLabel="Proveedor" onChange={setHeaderField} />

        <SectionCard title="Ítems">
          <div className="flex justify-end mb-3">
            <Button type="button" variant="ghost" size="sm" onClick={addItem} className="gap-1.5"><Plus size={15} />Agregar ítem</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground min-w-48">Descripción</TableHead>
                <TableHead className="text-muted-foreground min-w-44">Categoría</TableHead>
                <TableHead className="text-muted-foreground text-right min-w-24">Cantidad</TableHead>
                <TableHead className="text-muted-foreground text-right min-w-32">Precio unit.</TableHead>
                <TableHead className="text-muted-foreground text-right min-w-24">IVA %</TableHead>
                <TableHead className="text-muted-foreground text-right min-w-32">Subtotal</TableHead>
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._key} className="hover:bg-transparent">
                  <TableCell className="pr-3">
                    <Input value={item.Descripcion} onChange={(e) => updateItem(item._key, "Descripcion", e.target.value)} placeholder="Descripción" className={itemErrors[item._key]?.Descripcion ? "border-destructive" : undefined} />
                  </TableCell>
                  <TableCell className="px-3">
                    <Combobox
                      options={categoriasOptions}
                      value={item.Id_CategoriaGasto}
                      onValueChange={(v) => updateItem(item._key, "Id_CategoriaGasto", v)}
                      placeholder="— Sin categoría —"
                    />
                  </TableCell>
                  <TableCell className="px-3">
                    <Input type="number" min="0" step="0.01" value={item.Cantidad} onChange={(e) => updateItem(item._key, "Cantidad", e.target.value)} className={"text-right" + (itemErrors[item._key]?.Cantidad ? " border-destructive" : "")} />
                  </TableCell>
                  <TableCell className="px-3">
                    <InputGroup className={itemErrors[item._key]?.PrecioUnitario ? "border-destructive" : undefined}>
                      <InputGroupAddon>$</InputGroupAddon>
                      <InputGroupInput type="number" min="0" step="0.01" value={item.PrecioUnitario} onChange={(e) => updateItem(item._key, "PrecioUnitario", e.target.value)} placeholder="0,00" className="text-right" />
                    </InputGroup>
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
            <Button variant="destructive" onClick={() => router.push(cancelPath ?? "/facturas?tab=compras")}>Salir</Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
