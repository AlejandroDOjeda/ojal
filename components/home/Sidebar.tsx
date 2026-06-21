"use client";

import React from "react";

type MenuItem = {
  label: string;
  href: string;
  icon?: string;
};

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/home", icon: "📊" },
  { label: "Perfil", href: "/profile", icon: "👤" },
  { label: "Configuración", href: "/settings", icon: "⚙️" },
  { label: "Ayuda", href: "/help", icon: "❓" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen shadow-lg">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Ojeda Corp.</h1>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
        <p>v1.0.0</p>
      </div>
    </aside>
  );
}
