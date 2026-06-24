"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string | number; label: string };

type Props = {
  options: readonly SelectOption[];
  value: string | null | undefined;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function SelectBox({
  options,
  value,
  onValueChange,
  placeholder = "— Seleccioná —",
  className,
  disabled,
}: Props) {
  const items = Object.fromEntries(options.map((o) => [String(o.value), o.label]));

  return (
    <Select
      items={items}
      value={value || null}
      onValueChange={(v) => onValueChange(v ?? "")}
      disabled={disabled}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={String(o.value)} value={String(o.value)}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
