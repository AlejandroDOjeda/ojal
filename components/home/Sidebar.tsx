"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Settings, Building2, Beef,
  ReceiptText, ShoppingBag, ChevronDown, ChevronRight, Package, MapPin, Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

const configItems = [
  { href: "/rodeo", label: "Rodeo", icon: Package, prefix: true },
  { href: "/configuracion/campos", label: "Campos", icon: MapPin },
  { href: "/configuracion/entidades-legales", label: "Entidades Legales", icon: Building2 },
  { href: "/configuracion/categoria-hacienda", label: "Categorías Hacienda", icon: Beef },
  { href: "/configuracion/categoria-gasto", label: "Categorías Gasto", icon: ShoppingBag },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const inConfigGroup = pathname.startsWith("/configuracion") || pathname.startsWith("/rodeo");
  const [configOpen, setConfigOpen] = useState(inConfigGroup);
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isItemActive = (item: (typeof configItems)[number]) =>
    item.prefix ? pathname.startsWith(item.href) : pathname === item.href;

  return (
    <Sidebar collapsible="icon">
      {/* Logo */}
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="justify-center" render={<Link href="/home" />}>
              <span className="text-xl font-bold">
                {isCollapsed ? "Oj" : "Ojeda Corp."}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>

              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Inicio" isActive={pathname === "/home"} render={<Link href="/home" />}>
                  <Home />
                  <span>Inicio</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Facturas" isActive={pathname.startsWith("/facturas")} render={<Link href="/facturas" />}>
                  <ReceiptText />
                  <span>Facturas</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton tooltip="IVA" isActive={pathname.startsWith("/iva")} render={<Link href="/iva" />}>
                  <Percent />
                  <span>IVA</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarSeparator />

              {/* Configuración */}
              <SidebarMenuItem>
                {isCollapsed ? (
                  /* Modo colapsado: ícono + chevron inline */
                  <button
                    onClick={() => setConfigOpen((o) => !o)}
                    className={cn(
                      "flex h-8 w-full items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      (inConfigGroup || configOpen) &&
                        "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    )}
                  >
                    <Settings size={16} className="size-4 shrink-0" />
                    <ChevronRight
                      size={12}
                      className={cn("shrink-0 transition-transform duration-200", configOpen && "rotate-90")}
                    />
                  </button>
                ) : (
                  /* Modo expandido: botón normal */
                  <SidebarMenuButton
                    tooltip="Configuración"
                    isActive={inConfigGroup}
                    onClick={() => setConfigOpen((o) => !o)}
                  >
                    <Settings />
                    <span>Configuración</span>
                    <ChevronDown
                      className={cn("ml-auto transition-transform duration-200", configOpen && "rotate-180")}
                    />
                  </SidebarMenuButton>
                )}

                {/* Submenú expandido */}
                {configOpen && !isCollapsed && (
                  <SidebarMenuSub>
                    {configItems.map((item) => (
                      <SidebarMenuSubItem key={item.href}>
                        <SidebarMenuSubButton
                          isActive={isItemActive(item)}
                          render={<Link href={item.href} />}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}

                {/* Submenú colapsado: íconos indentados */}
                {configOpen && isCollapsed && (
                  <div className="ml-2 mt-0.5 flex flex-col gap-0.5">
                    {configItems.map((item) => (
                      <SidebarMenuButton
                        key={item.href}
                        size="sm"
                        tooltip={item.label}
                        isActive={isItemActive(item)}
                        render={<Link href={item.href} />}
                      >
                        <item.icon />
                      </SidebarMenuButton>
                    ))}
                  </div>
                )}
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <p className="px-2 text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
          v1.0.0
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
