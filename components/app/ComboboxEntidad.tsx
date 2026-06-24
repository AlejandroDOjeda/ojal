"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatCuit } from "@/lib/formato";

export type EntidadOption = {
  id: number;
  RazonSocial: string;
  CuitCuil: string;
};

type Props = {
  entidades: EntidadOption[];
  value: string;          // id como string (compatibilidad con FacturaHeaderData)
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function ComboboxEntidad({
  entidades,
  value,
  onValueChange,
  placeholder = "— Seleccioná —",
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);

  const selected = entidades.find((e) => String(e.id) === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "flex h-8 w-full items-center justify-between rounded-lg border border-input bg-background px-2.5 py-1 text-sm transition-colors outline-none",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          !selected && "text-muted-foreground"
        )}
      >
        <span className="truncate">
          {selected ? selected.RazonSocial : placeholder}
        </span>
        <ChevronsUpDown size={14} className="shrink-0 text-muted-foreground ml-2" />
      </PopoverTrigger>

      <PopoverContent
        className="p-0 w-[--anchor-width] min-w-72"
        side="bottom"
        align="start"
        sideOffset={4}
      >
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            {entidades.map((e) => (
              <CommandItem
                key={e.id}
                value={`${e.RazonSocial} ${e.CuitCuil}`}
                onSelect={() => {
                  onValueChange(String(e.id));
                  setOpen(false);
                }}
              >
                {/* Checkmark de seleccionado */}
                <Check
                  size={14}
                  className={cn(
                    "mr-2 shrink-0",
                    value === String(e.id) ? "opacity-100" : "opacity-0"
                  )}
                />

                {/* Dos columnas: Razón Social + CUIT */}
                <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
                  <span className="truncate font-medium">{e.RazonSocial}</span>
                  <span className="shrink-0 text-xs text-muted-foreground font-mono">
                    {formatCuit(e.CuitCuil)}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
