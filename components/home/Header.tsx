"use client";

import { useRouter } from "next/navigation";
import { Moon, Sun, Menu } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserTheme } from "@/hooks/useUserTheme";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CampoSelector from "@/components/home/CampoSelector";

export default function Header() {
  const router = useRouter();
  const { userEmail, signOut } = useAuthContext();
  const { toggleSidebar } = useSidebar();
  const { resolvedTheme, toggleTheme } = useUserTheme();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  const initials = userEmail
    ? userEmail.split("@")[0].split("").slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <header className="border-b bg-background shrink-0">
      <div className="flex items-center justify-between px-2 h-12">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
            <Menu size={18} />
          </Button>
          <CampoSelector />
        </div>
        <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle dark mode">
          {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm outline-none"
          >
            {initials}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:bg-destructive/10">
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
