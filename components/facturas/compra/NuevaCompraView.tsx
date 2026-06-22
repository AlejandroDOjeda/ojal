"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageShell, SectionCard, AppSelect } from "@/components/app";
import { FacturaHeaderForm } from "@/components/facturas/FacturaHeaderForm";
import { FacturaTotales } from "@/components/facturas/FacturaTotales";
import { useLeaveConfirmation } from "@/hooks/useLeaveConfirmation";
import {
  EMPTY_HEADER,
  EMPTY_ITEM_GASTO,
  calcItemGastoSubtotal,
  calcTotalesGasto,
  formatARS,
  type FacturaHeaderData,
  type ItemGastoForm,
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
    markDirty();
    setHeader((h) => ({ ...h, [field]: value }));
  };

  const addItem = () => {
    markDirty();
    setItems((prev) => [...prev, { _key: newKey(), ...EMPTY_ITEM_GASTO }]);
  };

  const removeItem = (key: string) => {
    markDirty();
    setItems((prev) => prev.filter((i) => i._key !== key));
  };

  const updateItem = (key: string, field: keyof Omit<ItemGastoForm, "_key">, value: string) => {
    markDirty();
    setItems((prev) =>
      prev.map((item) => {
        if (item._key !== key) return item;
        const updated = { ...item, [field]: value };
        if (field === "categoria_gasto_id") {
          const cat = categorias.find((c) => c.id === value);
          if (cat) updated.tasa_iva = String(cat.tasa_iva_habitual);
        }
        return updated;
      })
    );
  };

  const validate = (): string | null => {
    if (!header.tipo_comprobante) return "Seleccioná el tipo de comprobante.";
    if (!header.fecha) return "La fecha es obligatoria.";
    if (!header.entidad_legal_id) return "Seleccioná el proveedor.";
    if (header.condicion_pago === "cuenta_corriente" && !header.fecha_vencimiento) return "Ingresá la fecha de vencimiento.";
    if (items.length === 0) return "Agregá al menos un ítem.";
    for (const item of items) {
      if (!item.descripcion.trim()) return "Todos los ítems deben tener descripción.";
      if (!item.cantidad || parseFloat(item.cantidad) <= 0) return "La cantidad debe ser mayor a 0.";
      if (!item.precio_unitario || parseFloat(item.precio_unitario) <= 0) return "El precio unitario debe ser mayor a 0.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setSaving(true); setError(null);
    try { await onSave(header, items); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Error al guardar."); setSaving(false); }
  };

  const handleCancel = () => {
    if (isDirty.current) setShowExitDialog(true);
    else router.push("/facturas");
  };

  const totales = calcTotalesGasto(items);
  const backLink = (
    <button onClick={handleCancel} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
      <ArrowLeft size={14} /> Volver a Facturas
    </button>
  );

  if (loadingData) {
    return (
      <PageShell title="Nueva Factura de Compra" back={backLink} className="max-w-5xl">
        <p className="text-muted-foreground">Cargando...</p>
      </PageShell>
    );
  }

  return (
    <PageShell title="Nueva Factura de Compra" back={backLink} className="max-w-5xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FacturaHeaderForm data={header} entidades={entidades} entidadLabel="Proveedor" onChange={setHeaderField} />

        <SectionCard
          title="Ítems"
          className="space-y-0"
        >
          <div className="flex items-center justify-between mb-4">
            <span />
            <button type="button" onClick={addItem} className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors">
              <Plus size={15} /> Agregar ítem
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-2 font-medium text-muted-foreground">Descripción</th>
                  <th className="text-left pb-2 font-medium text-muted-foreground pl-3 w-44">Categoría</th>
                  <th className="text-right pb-2 font-medium text-muted-foreground pl-3 w-24">Cantidad</th>
                  <th className="text-right pb-2 font-medium text-muted-foreground pl-3 w-32">Precio unit.</th>
                  <th className="text-right pb-2 font-medium text-muted-foreground pl-3 w-24">IVA %</th>
                  <th className="text-right pb-2 font-medium text-muted-foreground pl-3 w-32">Subtotal</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item._key}>
                    <td className="py-2 pr-3">
                      <Input value={item.descripcion} onChange={(e) => updateItem(item._key, "descripcion", e.target.value)} placeholder="Descripción" />
                    </td>
                    <td className="py-2 pl-3 pr-3">
                      <AppSelect value={item.categoria_gasto_id} onChange={(e) => updateItem(item._key, "categoria_gasto_id", e.target.value)}>
                        <option value="">— Sin categoría —</option>
                        {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                      </AppSelect>
                    </td>
                    <td className="py-2 pl-3 pr-3">
                      <Input type="number" min="0" step="0.001" value={item.cantidad} onChange={(e) => updateItem(item._key, "cantidad", e.target.value)} className="text-right" />
                    </td>
                    <td className="py-2 pl-3 pr-3">
                      <Input type="number" min="0" step="0.01" value={item.precio_unitario} onChange={(e) => updateItem(item._key, "precio_unitario", e.target.value)} placeholder="0,00" className="text-right" />
                    </td>
                    <td className="py-2 pl-3 pr-3">
                      <AppSelect value={item.tasa_iva} onChange={(e) => updateItem(item._key, "tasa_iva", e.target.value)}>
                        <option value="0">0%</option>
                        <option value="10.5">10.5%</option>
                        <option value="21">21%</option>
                      </AppSelect>
                    </td>
                    <td className="py-2 pl-3 text-right font-medium text-foreground whitespace-nowrap">
                      {formatARS(calcItemGastoSubtotal(item))}
                    </td>
                    <td className="py-2 pl-2">
                      {items.length > 1 && (
                        <button type="button" onClick={() => removeItem(item._key)} className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <FacturaTotales totales={totales} />

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={handleCancel} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
          <button type="submit" disabled={saving} className="inline-flex items-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {saving ? "Guardando..." : "Guardar y confirmar"}
          </button>
        </div>
      </form>

      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent showCloseButton={false}>
          <DialogHeader><DialogTitle>¿Salir sin guardar?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Se perderán todos los cambios realizados en esta factura.</p>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowExitDialog(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Quedarme</button>
            <button onClick={() => router.push("/facturas")} className="inline-flex items-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors">Salir</button>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
