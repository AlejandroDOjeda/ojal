"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { SelectOption } from "./SelectBox";

type Props = {
  options: readonly SelectOption[];
  value: string | null | undefined;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
};

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "— Seleccioná —",
  className,
  disabled = false,
  error,
}: Props) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => String(o.value) === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "flex h-8 w-full items-center justify-between rounded-lg border border-input bg-background px-2.5 py-1 text-sm transition-colors outline-none",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          !selected && "text-muted-foreground",
          error && "border-destructive focus-visible:ring-destructive/20",
          className
        )}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronsUpDown size={14} className="shrink-0 text-muted-foreground ml-2" />
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[--anchor-width] min-w-48" side="bottom" align="start" sideOffset={4}>
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            {options.map((o) => (
              <CommandItem
                key={String(o.value)}
                value={o.label}
                onSelect={() => { onValueChange(String(o.value)); setOpen(false); }}
              >
                <Check size={14} className={cn("mr-2 shrink-0", value === String(o.value) ? "opacity-100" : "opacity-0")} />
                {o.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
