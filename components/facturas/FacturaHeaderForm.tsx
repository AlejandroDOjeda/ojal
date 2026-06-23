"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionCard, FormField } from "@/components/app";
import { TIPO_COMPROBANTE_OPTIONS, TIPO_COMPROBANTE_ITEMS, CONDICION_PAGO_OPTIONS, CONDICION_PAGO_ITEMS } from "@/lib/opciones";
import type { FacturaHeaderData } from "./types";

type EntidadOption = { id: number; RazonSocial: string };

type Props = {
  data: FacturaHeaderData;
  entidades: EntidadOption[];
  entidadLabel: string;
  onChange: <K extends keyof FacturaHeaderData>(field: K, value: FacturaHeaderData[K]) => void;
};

export function FacturaHeaderForm({ data, entidades, entidadLabel, onChange }: Props) {
  // Id_CondicionPago "2" = Cuenta corriente
  const esCuentaCorriente = data.Id_CondicionPago === "2";

  return (
    <SectionCard title="Datos del comprobante">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <FormField label="Tipo" required>
            <Select items={TIPO_COMPROBANTE_ITEMS} value={data.Id_TipoComprobante || undefined}
              onValueChange={(v) => onChange("Id_TipoComprobante", v ?? "")}>
              <SelectTrigger className="w-full"><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                {TIPO_COMPROBANTE_OPTIONS.filter(o => o.value !== 4).map((o) => (
                  <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Pto. venta">
            <Input value={data.PuntoVenta} onChange={(e) => onChange("PuntoVenta", e.target.value)} placeholder="0001" maxLength={4} />
          </FormField>
          <FormField label="Número">
            <Input value={data.Numero} onChange={(e) => onChange("Numero", e.target.value)} placeholder="00000001" maxLength={8} />
          </FormField>
          <FormField label="Fecha" required>
            <Input type="date" value={data.Fecha} onChange={(e) => onChange("Fecha", e.target.value)} />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label={entidadLabel} required className="sm:col-span-2">
            <Select
              items={Object.fromEntries(entidades.map((e) => [String(e.id), e.RazonSocial]))}
              value={data.Id_EntidadLegal || undefined}
              onValueChange={(v) => onChange("Id_EntidadLegal", v ?? "")}>
              <SelectTrigger className="w-full"><SelectValue placeholder="— Seleccioná —" /></SelectTrigger>
              <SelectContent>
                {entidades.map((e) => <SelectItem key={e.id} value={String(e.id)}>{e.RazonSocial}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Condición de pago">
            <Select items={CONDICION_PAGO_ITEMS} value={data.Id_CondicionPago}
              onValueChange={(v) => onChange("Id_CondicionPago", v ?? "1")}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CONDICION_PAGO_OPTIONS.map((o) => <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        {esCuentaCorriente && (
          <FormField label="Fecha de vencimiento" required className="max-w-xs">
            <Input type="date" value={data.FechaVencimiento} onChange={(e) => onChange("FechaVencimiento", e.target.value)} />
          </FormField>
        )}
      </div>
    </SectionCard>
  );
}
