"use client";

import { Input } from "@/components/ui/input";
import { SectionCard, FormField, AppSelect } from "@/components/app";
import type { FacturaHeaderData } from "./types";

type EntidadOption = { id: string; razon_social: string };

type Props = {
  data: FacturaHeaderData;
  entidades: EntidadOption[];
  entidadLabel: string;
  onChange: <K extends keyof FacturaHeaderData>(field: K, value: FacturaHeaderData[K]) => void;
};

export function FacturaHeaderForm({ data, entidades, entidadLabel, onChange }: Props) {
  return (
    <SectionCard title="Datos del comprobante">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <FormField label="Tipo" required>
            <AppSelect
              value={data.tipo_comprobante}
              onChange={(e) => onChange("tipo_comprobante", e.target.value as FacturaHeaderData["tipo_comprobante"])}
            >
              <option value="">—</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </AppSelect>
          </FormField>
          <FormField label="Pto. venta">
            <Input value={data.punto_venta} onChange={(e) => onChange("punto_venta", e.target.value)} placeholder="0001" maxLength={4} />
          </FormField>
          <FormField label="Número">
            <Input value={data.numero} onChange={(e) => onChange("numero", e.target.value)} placeholder="00000001" maxLength={8} />
          </FormField>
          <FormField label="Fecha" required>
            <Input type="date" value={data.fecha} onChange={(e) => onChange("fecha", e.target.value)} />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label={entidadLabel} required className="sm:col-span-2">
            <AppSelect
              value={data.entidad_legal_id}
              onChange={(e) => onChange("entidad_legal_id", e.target.value)}
            >
              <option value="">— Seleccioná —</option>
              {entidades.map((e) => (
                <option key={e.id} value={e.id}>{e.razon_social}</option>
              ))}
            </AppSelect>
          </FormField>
          <FormField label="Condición de pago">
            <AppSelect
              value={data.condicion_pago}
              onChange={(e) => onChange("condicion_pago", e.target.value as FacturaHeaderData["condicion_pago"])}
            >
              <option value="contado">Contado</option>
              <option value="cuenta_corriente">Cuenta corriente</option>
            </AppSelect>
          </FormField>
        </div>

        {data.condicion_pago === "cuenta_corriente" && (
          <FormField label="Fecha de vencimiento" required className="max-w-xs">
            <Input type="date" value={data.fecha_vencimiento} onChange={(e) => onChange("fecha_vencimiento", e.target.value)} />
          </FormField>
        )}
      </div>
    </SectionCard>
  );
}
