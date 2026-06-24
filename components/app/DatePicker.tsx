"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = {
  value: string;           // YYYY-MM-DD (formato DB)
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function DatePicker({
  value,
  onChange,
  placeholder = "Seleccioná una fecha",
  className,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);

  const date = value ? parseISO(value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "flex h-8 w-full items-center gap-2 rounded-lg border border-input bg-background px-2.5 py-1 text-sm transition-colors outline-none text-left",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          !date && "text-muted-foreground",
          className
        )}
      >
        <CalendarIcon size={14} className="shrink-0 text-muted-foreground" />
        <span>
          {date
            ? format(date, "d 'de' MMMM 'de' yyyy", { locale: es })
            : placeholder}
        </span>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start" side="bottom">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            if (d) {
              onChange(format(d, "yyyy-MM-dd"));
              setOpen(false);
            }
          }}
          locale={es}
          captionLayout="dropdown"
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  );
}
