"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header({ userEmail, onSignOut }: { userEmail: string | null; onSignOut: () => Promise<void> }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await onSignOut();
    router.replace("/");
  };

  const initials = userEmail
    ? userEmail
        .split("@")[0]
        .split("")
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <header className="border-b bg-white">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex-1" />

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors cursor-pointer">
              {initials}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:bg-red-50">
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
