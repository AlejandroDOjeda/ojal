"use client";

import { Input } from "@/components/ui/input";
import { SectionCard, FormField, SelectBox, DatePicker, ComboboxEntidad } from "@/components/app";
import type { EntidadOption } from "@/components/app";
import { TIPO_COMPROBANTE_OPTIONS, CONDICION_PAGO_OPTIONS } from "@/lib/opciones";
import type { FacturaHeaderData } from "./types";

export type FacturaHeaderErrors = Partial<Record<keyof FacturaHeaderData, string>>;

type Props = {
  data: FacturaHeaderData;
  errors?: FacturaHeaderErrors;
  entidades: EntidadOption[];
  entidadLabel: string;
  onChange: <K extends keyof FacturaHeaderData>(field: K, value: FacturaHeaderData[K]) => void;
};

export function FacturaHeaderForm({ data, errors = {}, entidades, entidadLabel, onChange }: Props) {
  const esCuentaCorriente = data.Id_CondicionPago === "2";

  return (
    <SectionCard title="Datos del comprobante">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <FormField label="Tipo" required error={errors.Id_TipoComprobante}>
            <SelectBox
              options={TIPO_COMPROBANTE_OPTIONS.filter((o) => o.value !== 4)}
              value={data.Id_TipoComprobante}
              onValueChange={(v) => onChange("Id_TipoComprobante", v)}
              placeholder="—"
              error={!!errors.Id_TipoComprobante}
            />
          </FormField>
          <FormField label="Pto. venta">
            <Input value={data.PuntoVenta} onChange={(e) => onChange("PuntoVenta", e.target.value.replace(/\D/g, ""))} placeholder="0001" maxLength={4} inputMode="numeric" />
          </FormField>
          <FormField label="Número">
            <Input value={data.Numero} onChange={(e) => onChange("Numero", e.target.value.replace(/\D/g, ""))} placeholder="00000001" maxLength={8} inputMode="numeric" />
          </FormField>
          <FormField label="Fecha" required error={errors.Fecha}>
            <DatePicker value={data.Fecha} onChange={(v) => onChange("Fecha", v)} error={!!errors.Fecha} />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label={entidadLabel} required className="sm:col-span-2" error={errors.Id_EntidadLegal}>
            <ComboboxEntidad
              entidades={entidades}
              value={data.Id_EntidadLegal}
              onValueChange={(v) => onChange("Id_EntidadLegal", v)}
              error={!!errors.Id_EntidadLegal}
            />
          </FormField>
          <FormField label="Condición de pago">
            <SelectBox
              options={CONDICION_PAGO_OPTIONS}
              value={data.Id_CondicionPago}
              onValueChange={(v) => onChange("Id_CondicionPago", v || "1")}
            />
          </FormField>
        </div>

        {esCuentaCorriente && (
          <FormField label="Fecha de vencimiento" required error={errors.FechaVencimiento} className="max-w-xs">
            <DatePicker value={data.FechaVencimiento} onChange={(v) => onChange("FechaVencimiento", v)} error={!!errors.FechaVencimiento} />
          </FormField>
        )}
      </div>
    </SectionCard>
  );
}
