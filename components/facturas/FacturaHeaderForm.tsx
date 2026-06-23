"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionCard, FormField } from "@/components/app";
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
            <Select value={data.tipo_comprobante || undefined} onValueChange={(v) => onChange("tipo_comprobante", (v ?? "") as FacturaHeaderData["tipo_comprobante"])}>
              <SelectTrigger className="w-full"><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
              </SelectContent>
            </Select>
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
            <Select value={data.entidad_legal_id || undefined} onValueChange={(v) => onChange("entidad_legal_id", v ?? "")}>
              <SelectTrigger className="w-full"><SelectValue placeholder="— Seleccioná —" /></SelectTrigger>
              <SelectContent>
                {entidades.map((e) => <SelectItem key={e.id} value={e.id ?? ""}>{e.razon_social}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Condición de pago">
            <Select value={data.condicion_pago} onValueChange={(v) => onChange("condicion_pago", (v ?? "contado") as FacturaHeaderData["condicion_pago"])}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="contado">Contado</SelectItem>
                <SelectItem value="cuenta_corriente">Cuenta corriente</SelectItem>
              </SelectContent>
            </Select>
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
