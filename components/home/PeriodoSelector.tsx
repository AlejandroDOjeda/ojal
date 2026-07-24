"use client";

import { SelectBox } from "@/components/app";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

type Props = {
  mes: number;
  anio: number;
  onMesChange: (mes: number) => void;
  onAnioChange: (anio: number) => void;
};

export function PeriodoSelector({ mes, anio, onMesChange, onAnioChange }: Props) {
  const anioActual = new Date().getFullYear();
  const anios = Array.from({ length: 5 }, (_, i) => anioActual - i);

  return (
    <div className="flex items-center gap-2">
      <SelectBox
        className="w-36"
        value={String(mes)}
        onValueChange={(v) => onMesChange(Number(v))}
        options={MESES.map((label, i) => ({ value: i, label }))}
      />
      <SelectBox
        className="w-24"
        value={String(anio)}
        onValueChange={(v) => onAnioChange(Number(v))}
        options={anios.map((a) => ({ value: a, label: String(a) }))}
      />
    </div>
  );
}
