"use client";

import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserTheme } from "@/hooks/useUserTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const router = useRouter();
  const { userEmail, signOut } = useAuthContext();
  const { resolvedTheme, toggleTheme } = useUserTheme();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  const initials = userEmail
    ? userEmail.split("@")[0].split("").slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <header className="border-b bg-background">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex-1" />

        <button
          onClick={toggleTheme}
          className="mr-3 flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted transition-colors"
          aria-label="Toggle dark mode"
        >
          {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors cursor-pointer">
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
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:bg-destructive/10">
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
