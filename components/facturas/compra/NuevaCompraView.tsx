"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";
import { MODALIDAD_PRECIO_OPTIONS, TASA_IVA_OPTIONS } from "@/lib/opciones";
import {
  EMPTY_HEADER, emptyItemCompraGasto, emptyItemCompraHacienda, calcItemCompraSubtotal, calcTotalesCompra, formatARS,
  type FacturaHeaderData, type ItemCompraForm, type ItemCompraGasto, type ItemCompraHacienda,
} from "@/components/facturas/types";
import type { CategoriaGastoOption, EntidadOption } from "./NuevaCompraContainer";
import type { CategoriaHaciendaOption } from "@/components/facturas/venta/NuevaVentaContainer";
import type { CampoOption } from "@/components/facturas/venta/NuevaVentaView";

type TipoCompra = "gasto" | "hacienda";

type Props = {
  entidades: EntidadOption[];
  categorias: CategoriaGastoOption[];
  categoriasHacienda: CategoriaHaciendaOption[];
  campos: CampoOption[];
  campoActivoId: number | null;
  loadingData: boolean;
  initialHeader?: FacturaHeaderData;
  initialItems?: ItemCompraForm[];
  title?: string;
  cancelPath?: string;
  onSave: (header: FacturaHeaderData, items: ItemCompraForm[]) => Promise<void>;
};

let keyCounter = 0;
const newKey = () => String(++keyCounter);

type ItemGastoErrors = Partial<Record<"Descripcion" | "Cantidad" | "PrecioUnitario", true>>;
type ItemHaciendaErrors = Partial<Record<"Id_Campo" | "Id_CategoriaHacienda" | "Cabezas" | "KgPromedio" | "PrecioPorKg" | "PrecioPorCabeza", true>>;
type ItemCompraErrors = ItemGastoErrors & ItemHaciendaErrors;

export default function NuevaCompraView({ entidades, categorias, categoriasHacienda, campos, campoActivoId, loadingData, initialHeader, initialItems, title, cancelPath, onSave }: Props) {
  const router = useRouter();
  const [header, setHeader] = useState<FacturaHeaderData>(initialHeader ?? EMPTY_HEADER);
  const [tipoCompra, setTipoCompra] = useState<TipoCompra>(() => initialItems?.[0]?._tipo ?? "gasto");
  const [items, setItems] = useState<ItemCompraForm[]>(initialItems ?? [emptyItemCompraGasto(newKey())]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [headerErrors, setHeaderErrors] = useState<FacturaHeaderErrors>({});
  const [itemErrors, setItemErrors] = useState<Record<string, ItemCompraErrors>>({});
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useLeaveConfirmation(isDirty);
  const markDirty = () => setIsDirty(true);

  const setHeaderField = <K extends keyof FacturaHeaderData>(field: K, value: FacturaHeaderData[K]) => {
    markDirty(); setHeader((h) => ({ ...h, [field]: value }));
  };

  // Una factura de compra es o bien 100% gastos generales, o bien 100% compra
  // de hacienda (Campo, CategoriaHacienda, Cabezas, precio por kg/cabeza) —
  // nunca mezcla ambos. Al cambiar el tipo se reinicia la lista de ítems.
  const handleTipoCompraChange = (tipo: TipoCompra) => {
    if (tipo === tipoCompra) return;
    markDirty();
    setTipoCompra(tipo);
    setItems([tipo === "gasto" ? emptyItemCompraGasto(newKey()) : emptyItemCompraHacienda(newKey(), campoActivoId)]);
    setItemErrors({});
  };

  const addItem = () => {
    markDirty();
    setItems((p) => [...p, tipoCompra === "gasto" ? emptyItemCompraGasto(newKey()) : emptyItemCompraHacienda(newKey(), campoActivoId)]);
  };
  const removeItem = (key: string) => {
    markDirty();
    setItems((p) => p.filter((i) => i._key !== key));
    setItemErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const updateGastoItem = (key: string, field: keyof Omit<ItemCompraGasto, "_key" | "_tipo">, value: string) => {
    markDirty();
    setItems((p) => p.map((item) => {
      if (item._key !== key || item._tipo !== "gasto") return item;
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

  const updateHaciendaItem = (key: string, field: keyof Omit<ItemCompraHacienda, "_key" | "_tipo">, value: string) => {
    markDirty();
    setItems((p) => p.map((item) => {
      if (item._key !== key || item._tipo !== "hacienda") return item;
      const updated = { ...item, [field]: value };
      if (field === "Id_CategoriaHacienda") {
        const cat = categoriasHacienda.find((c) => String(c.id) === value);
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
    if (!header.PuntoVenta || parseInt(header.PuntoVenta) <= 0) hErrors.PuntoVenta = "Obligatorio";
    if (!header.Numero || parseInt(header.Numero) <= 0) hErrors.Numero = "Obligatorio";
    if (!header.Fecha) hErrors.Fecha = "Obligatorio";
    if (!header.Id_EntidadLegal) hErrors.Id_EntidadLegal = "Obligatorio";
    if (header.Id_CondicionPago === "2" && !header.FechaVencimiento) hErrors.FechaVencimiento = "Obligatorio";
    if (Object.keys(hErrors).length > 0) setHeaderErrors(hErrors);
    if (items.length === 0) { setError("Agregá al menos un ítem."); return false; }
    const newItemErrors: Record<string, ItemCompraErrors> = {};
    for (const item of items) {
      const err: ItemCompraErrors = {};
      if (item._tipo === "gasto") {
        if (!item.Descripcion.trim()) err.Descripcion = true;
        if (!item.Cantidad || parseFloat(item.Cantidad) <= 0) err.Cantidad = true;
        if (!item.PrecioUnitario || parseFloat(item.PrecioUnitario) <= 0) err.PrecioUnitario = true;
      } else {
        if (!item.Id_Campo) err.Id_Campo = true;
        if (!item.Id_CategoriaHacienda) err.Id_CategoriaHacienda = true;
        if (!item.Cabezas || parseInt(item.Cabezas) <= 0) err.Cabezas = true;
        if (item.Modalidad === "1") {
          if (!item.KgPromedio || parseFloat(item.KgPromedio) <= 0) err.KgPromedio = true;
          if (!item.PrecioPorKg || parseFloat(item.PrecioPorKg) <= 0) err.PrecioPorKg = true;
        } else {
          if (!item.PrecioPorCabeza || parseFloat(item.PrecioPorCabeza) <= 0) err.PrecioPorCabeza = true;
        }
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

  const handleCancel = () => { if (isDirty) setShowExitDialog(true); else router.push(cancelPath ?? "/facturas?tab=compras"); };

  const categoriasOptions = categorias.map((c) => ({ value: c.id, label: c.Nombre }));
  const categoriasHaciendaOptions = categoriasHacienda.map((c) => ({ value: c.id, label: c.Nombre }));
  const camposOptions = campos.map((c) => ({ value: c.Id_Campo, label: c.Nombre }));
  const totales = calcTotalesCompra(items, parseFloat(header.NoGravado) || 0);
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
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center rounded-lg border border-border p-0.5">
              <button
                type="button"
                onClick={() => handleTipoCompraChange("gasto")}
                className={cn(
                  "rounded-md px-3 py-1 text-sm transition-colors",
                  tipoCompra === "gasto" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Gasto general
              </button>
              <button
                type="button"
                onClick={() => handleTipoCompraChange("hacienda")}
                className={cn(
                  "rounded-md px-3 py-1 text-sm transition-colors",
                  tipoCompra === "hacienda" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Hacienda
              </button>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={addItem} className="gap-1.5"><Plus size={15} />Agregar ítem</Button>
          </div>

          {tipoCompra === "gasto" ? (
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
                  {items.filter((i): i is ItemCompraGasto => i._tipo === "gasto").map((item) => (
                    <TableRow key={item._key} className="hover:bg-transparent">
                      <TableCell className="pr-3">
                        <Input value={item.Descripcion} onChange={(e) => updateGastoItem(item._key, "Descripcion", e.target.value)} placeholder="Descripción" className={itemErrors[item._key]?.Descripcion ? "border-destructive" : undefined} />
                      </TableCell>
                      <TableCell className="px-3">
                        <Combobox
                          options={categoriasOptions}
                          value={item.Id_CategoriaGasto}
                          onValueChange={(v) => updateGastoItem(item._key, "Id_CategoriaGasto", v)}
                          placeholder="— Sin categoría —"
                        />
                      </TableCell>
                      <TableCell className="px-3">
                        <Input type="number" min="0" step="0.01" value={item.Cantidad} onChange={(e) => updateGastoItem(item._key, "Cantidad", e.target.value)} className={"text-right" + (itemErrors[item._key]?.Cantidad ? " border-destructive" : "")} />
                      </TableCell>
                      <TableCell className="px-3">
                        <InputGroup className={itemErrors[item._key]?.PrecioUnitario ? "border-destructive" : undefined}>
                          <InputGroupAddon>$</InputGroupAddon>
                          <InputGroupInput type="number" min="0" step="0.01" value={item.PrecioUnitario} onChange={(e) => updateGastoItem(item._key, "PrecioUnitario", e.target.value)} placeholder="0,00" className="text-right" />
                        </InputGroup>
                      </TableCell>
                      <TableCell className="px-3">
                        <SelectBox
                          options={TASA_IVA_OPTIONS}
                          value={item.TasaIva}
                          onValueChange={(v) => updateGastoItem(item._key, "TasaIva", v || "21")}
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium whitespace-nowrap pl-3">{formatARS(calcItemCompraSubtotal(item))}</TableCell>
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
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-muted-foreground w-36">Campo</TableHead>
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
                  {items.filter((i): i is ItemCompraHacienda => i._tipo === "hacienda").map((item) => (
                    <TableRow key={item._key} className="hover:bg-transparent">
                      <TableCell className="pr-3">
                        <SelectBox
                          options={camposOptions}
                          value={item.Id_Campo}
                          onValueChange={(v) => updateHaciendaItem(item._key, "Id_Campo", v)}
                          placeholder="— Campo —"
                          error={!!itemErrors[item._key]?.Id_Campo}
                        />
                      </TableCell>
                      <TableCell className="pr-3">
                        <SelectBox
                          options={categoriasHaciendaOptions}
                          value={item.Id_CategoriaHacienda}
                          onValueChange={(v) => updateHaciendaItem(item._key, "Id_CategoriaHacienda", v)}
                          placeholder="— Categoría —"
                          error={!!itemErrors[item._key]?.Id_CategoriaHacienda}
                        />
                      </TableCell>
                      <TableCell className="px-3">
                        <Input
                          type="number" min="1" step="1"
                          value={item.Cabezas}
                          onChange={(e) => updateHaciendaItem(item._key, "Cabezas", e.target.value.replace(/\./g, ""))}
                          onKeyDown={(e) => { if ([".", ",", "e", "E", "+", "-"].includes(e.key)) e.preventDefault(); }}
                          className={"text-right" + (itemErrors[item._key]?.Cabezas ? " border-destructive" : "")}
                          placeholder="0"
                        />
                      </TableCell>
                      <TableCell className="px-3">
                        <SelectBox
                          options={MODALIDAD_PRECIO_OPTIONS}
                          value={item.Modalidad}
                          onValueChange={(v) => updateHaciendaItem(item._key, "Modalidad", v || "1")}
                        />
                      </TableCell>
                      <TableCell className="px-3">
                        {item.Modalidad === "1" ? (
                          <Input type="number" min="0" step="0.1" value={item.KgPromedio} onChange={(e) => updateHaciendaItem(item._key, "KgPromedio", e.target.value)} className={"text-right" + (itemErrors[item._key]?.KgPromedio ? " border-destructive" : "")} placeholder="0,0" />
                        ) : <span className="block text-right text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="px-3">
                        {item.Modalidad === "1" ? (
                          <Input type="number" min="0" step="0.01" value={item.PrecioPorKg} onChange={(e) => updateHaciendaItem(item._key, "PrecioPorKg", e.target.value)} className={"text-right" + (itemErrors[item._key]?.PrecioPorKg ? " border-destructive" : "")} placeholder="$/kg" />
                        ) : (
                          <Input type="number" min="0" step="0.01" value={item.PrecioPorCabeza} onChange={(e) => updateHaciendaItem(item._key, "PrecioPorCabeza", e.target.value)} className={"text-right" + (itemErrors[item._key]?.PrecioPorCabeza ? " border-destructive" : "")} placeholder="$/cab." />
                        )}
                      </TableCell>
                      <TableCell className="px-3">
                        <SelectBox
                          options={TASA_IVA_OPTIONS}
                          value={item.TasaIva}
                          onValueChange={(v) => updateHaciendaItem(item._key, "TasaIva", v || "10.5")}
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium whitespace-nowrap pl-3">{formatARS(calcItemCompraSubtotal(item))}</TableCell>
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
          )}
        </SectionCard>

        <FacturaTotales totales={totales} noGravado={header.NoGravado} onNoGravadoChange={(v) => setHeaderField("NoGravado", v)} />

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
