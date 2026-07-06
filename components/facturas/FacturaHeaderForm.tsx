"use client";

import { useMemo } from "react";
import { parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { SectionCard, FormField, SelectBox, DatePicker, ComboboxEntidad } from "@/components/app";
import type { EntidadOption } from "@/components/app";
import { TIPO_COMPROBANTE_OPTIONS, CONDICION_PAGO_OPTIONS } from "@/lib/opciones";
import { formatCuit } from "@/lib/formato";
import { toDateStr } from "@/lib/fecha";
import type { FacturaHeaderData } from "./types";

export type FacturaHeaderErrors = Partial<Record<keyof FacturaHeaderData, string>>;

const DIAS_VENC_OPTIONS = [
  { value: 30,  label: "30 días"  },
  { value: 60,  label: "60 días"  },
  { value: 90,  label: "90 días"  },
  { value: 120, label: "120 días" },
] as const;

// Input tipo "odómetro": cada dígito tipeado entra por la derecha y el valor
// se muestra siempre con ceros a la izquierda hasta `maxLen`.
type DigitCodeInputProps = {
  value: string;
  maxLen: number;
  placeholder: string;
  invalid?: boolean;
  onValueChange: (value: string) => void;
};

function DigitCodeInput({ value, maxLen, placeholder, invalid, onValueChange }: DigitCodeInputProps) {
  const applyRaw = (raw: string) => {
    const digits = raw.replace(/\D/g, "").replace(/^0+/, "").slice(-maxLen);
    onValueChange(digits ? digits.padStart(maxLen, "0") : "");
  };

  return (
    <Input
      type="text"
      inputMode="numeric"
      value={value}
      placeholder={placeholder}
      aria-invalid={invalid}
      onChange={(e) => applyRaw(e.target.value)}
      onKeyDown={(e) => {
        const el = e.currentTarget;
        const allSelected = el.value.length > 0 && el.selectionStart === 0 && el.selectionEnd === el.value.length;

        if (e.key >= "0" && e.key <= "9") {
          e.preventDefault();
          applyRaw((allSelected ? "" : value) + e.key);
        } else if (e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault();
          applyRaw(allSelected ? "" : value.slice(0, -1));
        }
      }}
      onPaste={(e) => {
        e.preventDefault();
        applyRaw(value + e.clipboardData.getData("text"));
      }}
      onFocus={(e) => {
        const len = e.target.value.length;
        e.target.setSelectionRange(len, len);
      }}
    />
  );
}

type Props = {
  data: FacturaHeaderData;
  errors?: FacturaHeaderErrors;
  entidades: EntidadOption[];
  entidadLabel: string;
  onChange: <K extends keyof FacturaHeaderData>(field: K, value: FacturaHeaderData[K]) => void;
};

export function FacturaHeaderForm({ data, errors = {}, entidades, entidadLabel, onChange }: Props) {
  const esCuentaCorriente = data.Id_CondicionPago === "2";
  const entidadSeleccionada = entidades.find((e) => String(e.id) === data.Id_EntidadLegal);

  // Deriva los días de vencimiento desde las fechas almacenadas, para pre-seleccionar la opción correcta al editar.
  const diasVenc = useMemo(() => {
    if (!data.FechaVencimiento || !data.Fecha) return "";
    const diff = Math.round(
      (new Date(data.FechaVencimiento).getTime() - new Date(data.Fecha).getTime()) / 86_400_000
    );
    return [30, 60, 90, 120].includes(diff) ? String(diff) : "";
  }, [data.FechaVencimiento, data.Fecha]);

  const handleDiasVenc = (dias: string) => {
    if (dias && data.Fecha) {
      const d = parseISO(data.Fecha);
      d.setDate(d.getDate() + parseInt(dias));
      onChange("FechaVencimiento", toDateStr(d));
    } else {
      onChange("FechaVencimiento", "");
    }
  };

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
          <FormField label="Pto. venta" required error={errors.PuntoVenta}>
            <DigitCodeInput
              value={data.PuntoVenta}
              maxLen={5}
              placeholder="00001"
              invalid={!!errors.PuntoVenta}
              onValueChange={(v) => onChange("PuntoVenta", v)}
            />
          </FormField>
          <FormField label="Número" required error={errors.Numero}>
            <DigitCodeInput
              value={data.Numero}
              maxLen={8}
              placeholder="00000001"
              invalid={!!errors.Numero}
              onValueChange={(v) => onChange("Numero", v)}
            />
          </FormField>
          <FormField label="Fecha" required error={errors.Fecha}>
            <DatePicker value={data.Fecha} onChange={(v) => onChange("Fecha", v)} error={!!errors.Fecha} />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label={entidadLabel} required error={errors.Id_EntidadLegal}>
            <ComboboxEntidad
              entidades={entidades}
              value={data.Id_EntidadLegal}
              onValueChange={(v) => onChange("Id_EntidadLegal", v)}
              error={!!errors.Id_EntidadLegal}
            />
          </FormField>
          <FormField label="CUIT/CUIL">
            <div className="flex h-8 items-center px-2.5 text-sm text-muted-foreground font-mono">
              {entidadSeleccionada ? formatCuit(entidadSeleccionada.CuitCuil) : "—"}
            </div>
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
          <FormField label="Vencimiento" required error={errors.FechaVencimiento} className="max-w-xs">
            <SelectBox
              options={DIAS_VENC_OPTIONS}
              value={diasVenc || null}
              onValueChange={handleDiasVenc}
              placeholder="— Seleccionar —"
              error={!!errors.FechaVencimiento}
            />
          </FormField>
        )}
      </div>
    </SectionCard>
  );
}
