"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Home, Settings, HelpCircle, Building2, Beef, ReceiptText, ShoppingBag } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [configOpen, setConfigOpen] = useState(
    pathname.startsWith("/configuracion")
  );

  const isActive = (href: string, prefix = false) =>
    prefix ? pathname.startsWith(href) : pathname === href;
  const linkClass = (href: string, prefix = false) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${
      isActive(href, prefix)
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
        : "hover:bg-sidebar-accent/60"
    }`;

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen shadow-lg shrink-0">
      <Link href="/home" className="p-6 border-b border-sidebar-border hover:bg-sidebar-accent/40 transition-colors">
        <h1 className="text-2xl font-bold">Ojeda Corp.</h1>
      </Link>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link href="/home" className={linkClass("/home")}>
          <Home size={18} />
          <span>Inicio</span>
        </Link>

        <Link href="/facturas" className={linkClass("/facturas", true)}>
          <ReceiptText size={18} />
          <span>Facturas</span>
        </Link>

        {/* Configuración colapsable */}
        <div>
          <button
            onClick={() => setConfigOpen((o) => !o)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${
              pathname.startsWith("/configuracion")
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "hover:bg-sidebar-accent/60"
            }`}
          >
            <Settings size={18} />
            <span className="flex-1 text-left">Configuración</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${configOpen ? "rotate-180" : ""}`}
            />
          </button>

          {configOpen && (
            <div className="mt-1 ml-4 pl-3 border-l border-sidebar-border space-y-1">
              <Link
                href="/configuracion/entidades-legales"
                className={linkClass("/configuracion/entidades-legales")}
              >
                <Building2 size={16} />
                <span>Entidades Legales</span>
              </Link>
              <Link
                href="/configuracion/categoria-hacienda"
                className={linkClass("/configuracion/categoria-hacienda")}
              >
                <Beef size={16} />
                <span>Categorías Hacienda</span>
              </Link>
              <Link
                href="/configuracion/categoria-gasto"
                className={linkClass("/configuracion/categoria-gasto")}
              >
                <ShoppingBag size={16} />
                <span>Categorías Gasto</span>
              </Link>
            </div>
          )}
        </div>

        <Link href="/help" className={linkClass("/help")}>
          <HelpCircle size={18} />
          <span>Ayuda</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/60">
        <p>v1.0.0</p>
      </div>
    </aside>
  );
}
