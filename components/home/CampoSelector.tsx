"use client";

import { MapPin, ChevronDown } from "lucide-react";
import { useCampoContext } from "@/contexts/CampoContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function CampoSelector() {
  const { campos, campoActivo, setCampoActivo, loading } = useCampoContext();

  if (loading) return null;

  if (campos.length === 0) {
    return (
      <Link
        href="/configuracion/campos"
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <MapPin size={13} />
        <span>Sin campos</span>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium hover:bg-accent transition-colors outline-none">
        <MapPin size={13} className="shrink-0 text-muted-foreground" />
        <span className="max-w-[120px] truncate">
          {campoActivo ? campoActivo.Nombre : "Todos los campos"}
        </span>
        <ChevronDown size={12} className="shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuItem
          onClick={() => setCampoActivo(null)}
          className={!campoActivo ? "font-semibold" : ""}
        >
          Todos los campos
        </DropdownMenuItem>
        {campos.length > 0 && <DropdownMenuSeparator />}
        {campos.map((campo) => (
          <DropdownMenuItem
            key={campo.Id_Campo}
            onClick={() => setCampoActivo(campo)}
            className={campoActivo?.Id_Campo === campo.Id_Campo ? "font-semibold" : ""}
          >
            {campo.Nombre}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
