"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageShell, SectionCard } from "@/components/app";
import { FacturaHeaderForm } from "@/components/facturas/FacturaHeaderForm";
import { FacturaTotales } from "@/components/facturas/FacturaTotales";
import { useLeaveConfirmation } from "@/hooks/useLeaveConfirmation";
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

export default function NuevaVentaView({ entidades, categorias, loadingData, onSave }: Props) {
  const router = useRouter();
  const [header, setHeader] = useState<FacturaHeaderData>(EMPTY_HEADER);
  const [items, setItems] = useState<ItemHaciendaForm[]>([{ _key: newKey(), ...EMPTY_ITEM_HACIENDA }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const isDirty = useRef(false);

  useLeaveConfirmation(isDirty.current);
  const markDirty = () => { isDirty.current = true; };

  const setHeaderField = <K extends keyof FacturaHeaderData>(field: K, value: FacturaHeaderData[K]) => {
    markDirty(); setHeader((h) => ({ ...h, [field]: value }));
  };

  const addItem = () => { markDirty(); setItems((p) => [...p, { _key: newKey(), ...EMPTY_ITEM_HACIENDA }]); };
  const removeItem = (key: string) => { markDirty(); setItems((p) => p.filter((i) => i._key !== key)); };

  const updateItem = (key: string, field: keyof Omit<ItemHaciendaForm, "_key">, value: string) => {
    markDirty();
    setItems((p) => p.map((item) => {
      if (item._key !== key) return item;
      const updated = { ...item, [field]: value };
      if (field === "categoria_hacienda_id") {
        const cat = categorias.find((c) => c.id === value);
        if (cat) updated.tasa_iva = String(cat.tasa_iva);
      }
      return updated;
    }));
  };

  const validate = (): string | null => {
    if (!header.tipo_comprobante) return "Seleccioná el tipo de comprobante.";
    if (!header.fecha) return "La fecha es obligatoria.";
    if (!header.entidad_legal_id) return "Seleccioná el cliente.";
    if (header.condicion_pago === "cuenta_corriente" && !header.fecha_vencimiento) return "Ingresá la fecha de vencimiento.";
    if (items.length === 0) return "Agregá al menos un ítem.";
    for (const item of items) {
      if (!item.categoria_hacienda_id) return "Todos los ítems deben tener categoría.";
      if (!item.cabezas || parseInt(item.cabezas) <= 0) return "La cantidad de cabezas debe ser mayor a 0.";
      if (item.modalidad === "por_kg") {
        if (!item.kg_promedio || parseFloat(item.kg_promedio) <= 0) return "Ingresá el peso promedio.";
        if (!item.precio_por_kg || parseFloat(item.precio_por_kg) <= 0) return "Ingresá el precio por kg.";
      } else {
        if (!item.precio_por_cabeza || parseFloat(item.precio_por_cabeza) <= 0) return "Ingresá el precio por cabeza.";
      }
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

  const totales = calcTotalesHacienda(items);
  const backLink = (
    <Link href="#" onClick={(e) => { e.preventDefault(); handleCancel(); }}>
      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground -ml-2">
        <ArrowLeft size={14} />Volver a Facturas
      </Button>
    </Link>
  );

  if (loadingData) {
    return <PageShell title="Nueva Factura de Venta" back={backLink} className="max-w-5xl"><p className="text-muted-foreground">Cargando...</p></PageShell>;
  }

  return (
    <PageShell title="Nueva Factura de Venta" back={backLink} className="max-w-5xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FacturaHeaderForm data={header} entidades={entidades} entidadLabel="Cliente" onChange={setHeaderField} />

        <SectionCard title="Hacienda">
          <div className="flex justify-end mb-3">
            <Button type="button" variant="ghost" size="sm" onClick={addItem} className="gap-1.5">
              <Plus size={15} />Agregar ítem
            </Button>
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
                      <Select value={item.categoria_hacienda_id || undefined} onValueChange={(v) => updateItem(item._key, "categoria_hacienda_id", v ?? "")}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="— Categoría —" /></SelectTrigger>
                        <SelectContent>
                          {categorias.map((c) => <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="px-3">
                      <Input type="number" min="1" step="1" value={item.cabezas} onChange={(e) => updateItem(item._key, "cabezas", e.target.value)} className="text-right" placeholder="0" />
                    </TableCell>
                    <TableCell className="px-3">
                      <Select value={item.modalidad} onValueChange={(v) => updateItem(item._key, "modalidad", v ?? "por_kg")}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="por_kg">Por kg</SelectItem>
                          <SelectItem value="por_cabeza">Por cabeza</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="px-3">
                      {item.modalidad === "por_kg" ? (
                        <Input type="number" min="0" step="0.1" value={item.kg_promedio} onChange={(e) => updateItem(item._key, "kg_promedio", e.target.value)} className="text-right" placeholder="0,0" />
                      ) : <span className="block text-right text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="px-3">
                      {item.modalidad === "por_kg" ? (
                        <Input type="number" min="0" step="0.01" value={item.precio_por_kg} onChange={(e) => updateItem(item._key, "precio_por_kg", e.target.value)} className="text-right" placeholder="$/kg" />
                      ) : (
                        <Input type="number" min="0" step="0.01" value={item.precio_por_cabeza} onChange={(e) => updateItem(item._key, "precio_por_cabeza", e.target.value)} className="text-right" placeholder="$/cab." />
                      )}
                    </TableCell>
                    <TableCell className="px-3">
                      <Select value={item.tasa_iva} onValueChange={(v) => updateItem(item._key, "tasa_iva", v ?? "10.5")}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="10.5">10.5%</SelectItem>
                          <SelectItem value="21">21%</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right font-medium whitespace-nowrap pl-3">
                      {formatARS(calcItemHaciendaSubtotal(item))}
                    </TableCell>
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
