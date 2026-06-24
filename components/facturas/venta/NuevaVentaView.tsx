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
import { PageShell, SectionCard, SelectBox } from "@/components/app";
import { FacturaHeaderForm, type FacturaHeaderErrors } from "@/components/facturas/FacturaHeaderForm";
import { FacturaTotales } from "@/components/facturas/FacturaTotales";
import { useLeaveConfirmation } from "@/hooks/useLeaveConfirmation";
import { MODALIDAD_PRECIO_OPTIONS, TASA_IVA_OPTIONS } from "@/lib/opciones";
import {
  EMPTY_HEADER, EMPTY_ITEM_HACIENDA, calcItemHaciendaSubtotal, calcTotalesHacienda, formatARS,
  type FacturaHeaderData, type ItemHaciendaForm,
} from "@/components/facturas/types";
import type { CategoriaHaciendaOption, EntidadOption } from "./NuevaVentaContainer";

type Props = {
  entidades: EntidadOption[];
  categorias: CategoriaHaciendaOption[];
  loadingData: boolean;
  onSave: (header: FacturaHeaderData, items: ItemHaciendaForm[]) => Promise<void>;
};

let keyCounter = 0;
const newKey = () => String(++keyCounter);

type ItemHaciendaErrors = Partial<Record<"Id_CategoriaHacienda" | "Cabezas" | "KgPromedio" | "PrecioPorKg" | "PrecioPorCabeza", true>>;

export default function NuevaVentaView({ entidades, categorias, loadingData, onSave }: Props) {
  const router = useRouter();
  const [header, setHeader] = useState<FacturaHeaderData>(EMPTY_HEADER);
  const [items, setItems] = useState<ItemHaciendaForm[]>([{ _key: newKey(), ...EMPTY_ITEM_HACIENDA }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [headerErrors, setHeaderErrors] = useState<FacturaHeaderErrors>({});
  const [itemErrors, setItemErrors] = useState<Record<string, ItemHaciendaErrors>>({});
  const [showExitDialog, setShowExitDialog] = useState(false);
  const isDirty = useRef(false);

  useLeaveConfirmation(isDirty.current);
  const markDirty = () => { isDirty.current = true; };

  const setHeaderField = <K extends keyof FacturaHeaderData>(field: K, value: FacturaHeaderData[K]) => {
    markDirty(); setHeader((h) => ({ ...h, [field]: value }));
  };

  const addItem = () => { markDirty(); setItems((p) => [...p, { _key: newKey(), ...EMPTY_ITEM_HACIENDA }]); };
  const removeItem = (key: string) => {
    markDirty();
    setItems((p) => p.filter((i) => i._key !== key));
    setItemErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const updateItem = (key: string, field: keyof Omit<ItemHaciendaForm, "_key">, value: string) => {
    markDirty();
    setItems((p) => p.map((item) => {
      if (item._key !== key) return item;
      const updated = { ...item, [field]: value };
      if (field === "Id_CategoriaHacienda") {
        const cat = categorias.find((c) => String(c.id) === value);
        if (cat) updated.TasaIva = String(cat.TasaIva);
      }
      return updated;
    }));
    setItemErrors((prev) => {
      const itemErr = prev[key];
      if (!itemErr) return prev;
      if (field === "Modalidad") {
        const { KgPromedio: _a, PrecioPorKg: _b, PrecioPorCabeza: _c, ...rest } = itemErr;
        const result = { ...prev, [key]: rest };
        if (Object.keys(rest).length === 0) delete result[key];
        return result;
      }
      if (!itemErr[field as keyof ItemHaciendaErrors]) return prev;
      const next = { ...itemErr };
      delete next[field as keyof ItemHaciendaErrors];
      const result = { ...prev, [key]: next };
      if (Object.keys(next).length === 0) delete result[key];
      return result;
    });
  };

  const validate = (): boolean => {
    const hErrors: FacturaHeaderErrors = {};
    if (!header.Id_TipoComprobante) hErrors.Id_TipoComprobante = "Obligatorio";
    if (!header.Fecha) hErrors.Fecha = "Obligatorio";
    if (!header.Id_EntidadLegal) hErrors.Id_EntidadLegal = "Obligatorio";
    if (header.Id_CondicionPago === "2" && !header.FechaVencimiento) hErrors.FechaVencimiento = "Obligatorio";
    if (Object.keys(hErrors).length > 0) setHeaderErrors(hErrors);
    const newItemErrors: Record<string, ItemHaciendaErrors> = {};
    for (const item of items) {
      const err: ItemHaciendaErrors = {};
      if (!item.Id_CategoriaHacienda) err.Id_CategoriaHacienda = true;
      if (!item.Cabezas || parseInt(item.Cabezas) <= 0) err.Cabezas = true;
      if (item.Modalidad === "1") {
        if (!item.KgPromedio || parseFloat(item.KgPromedio) <= 0) err.KgPromedio = true;
        if (!item.PrecioPorKg || parseFloat(item.PrecioPorKg) <= 0) err.PrecioPorKg = true;
      } else {
        if (!item.PrecioPorCabeza || parseFloat(item.PrecioPorCabeza) <= 0) err.PrecioPorCabeza = true;
      }
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

  const handleCancel = () => { if (isDirty.current) setShowExitDialog(true); else router.push("/facturas?tab=ventas"); };

  const categoriasOptions = categorias.map((c) => ({ value: c.id, label: c.Nombre }));
  const totales = calcTotalesHacienda(items);
  const backLink = (
    <Link href="#" onClick={(e) => { e.preventDefault(); handleCancel(); }}>
      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground -ml-2"><ArrowLeft size={14} />Volver a Facturas</Button>
    </Link>
  );

  if (loadingData) return <PageShell title="Nueva Factura de Venta" back={backLink} className="max-w-5xl"><p className="text-muted-foreground">Cargando...</p></PageShell>;

  return (
    <PageShell title="Nueva Factura de Venta" back={backLink} className="max-w-5xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FacturaHeaderForm data={header} errors={headerErrors} entidades={entidades} entidadLabel="Cliente" onChange={setHeaderField} />

        <SectionCard title="Hacienda">
          <div className="flex justify-end mb-3">
            <Button type="button" variant="ghost" size="sm" onClick={addItem} className="gap-1.5"><Plus size={15} />Agregar ítem</Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground w-40">Categoría</TableHead>
                  <TableHead className="text-muted-foreground text-right w-24">Cabezas</TableHead>
                  <TableHead className="text-muted-foreground w-32">Precio por</TableHead>
                  <TableHead className="text-muted-foreground text-right w-28">Kg prom.</TableHead>
                  <TableHead className="text-muted-foreground text-right w-28">Precio</TableHead>
                  <TableHead className="text-muted-foreground text-right w-20">IVA %</TableHead>
                  <TableHead className="text-muted-foreground text-right w-32">Subtotal</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item._key} className="hover:bg-transparent">
                    <TableCell className="pr-3">
                      <SelectBox
                        options={categoriasOptions}
                        value={item.Id_CategoriaHacienda}
                        onValueChange={(v) => updateItem(item._key, "Id_CategoriaHacienda", v)}
                        placeholder="— Categoría —"
                        error={!!itemErrors[item._key]?.Id_CategoriaHacienda}
                      />
                    </TableCell>
                    <TableCell className="px-3">
                      <Input type="number" min="1" step="1" value={item.Cabezas} onChange={(e) => updateItem(item._key, "Cabezas", e.target.value)} className={"text-right" + (itemErrors[item._key]?.Cabezas ? " border-destructive" : "")} placeholder="0" />
                    </TableCell>
                    <TableCell className="px-3">
                      <SelectBox
                        options={MODALIDAD_PRECIO_OPTIONS}
                        value={item.Modalidad}
                        onValueChange={(v) => updateItem(item._key, "Modalidad", v || "1")}
                      />
                    </TableCell>
                    <TableCell className="px-3">
                      {item.Modalidad === "1" ? (
                        <Input type="number" min="0" step="0.1" value={item.KgPromedio} onChange={(e) => updateItem(item._key, "KgPromedio", e.target.value)} className={"text-right" + (itemErrors[item._key]?.KgPromedio ? " border-destructive" : "")} placeholder="0,0" />
                      ) : <span className="block text-right text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="px-3">
                      {item.Modalidad === "1" ? (
                        <Input type="number" min="0" step="0.01" value={item.PrecioPorKg} onChange={(e) => updateItem(item._key, "PrecioPorKg", e.target.value)} className={"text-right" + (itemErrors[item._key]?.PrecioPorKg ? " border-destructive" : "")} placeholder="$/kg" />
                      ) : (
                        <Input type="number" min="0" step="0.01" value={item.PrecioPorCabeza} onChange={(e) => updateItem(item._key, "PrecioPorCabeza", e.target.value)} className={"text-right" + (itemErrors[item._key]?.PrecioPorCabeza ? " border-destructive" : "")} placeholder="$/cab." />
                      )}
                    </TableCell>
                    <TableCell className="px-3">
                      <SelectBox
                        options={TASA_IVA_OPTIONS}
                        value={item.TasaIva}
                        onValueChange={(v) => updateItem(item._key, "TasaIva", v || "10.5")}
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium whitespace-nowrap pl-3">{formatARS(calcItemHaciendaSubtotal(item))}</TableCell>
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
            <Button variant="destructive" onClick={() => router.push("/facturas?tab=ventas")}>Salir</Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
