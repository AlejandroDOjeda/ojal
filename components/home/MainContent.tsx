"use client";

import React from "react";

export default function MainContent({ userEmail }: { userEmail: string | null }) {
  return (
    <main className="flex-1 p-8">
      <div className="max-w-6xl">
        <h2 className="text-3xl font-bold text-gray-900">Bienvenido</h2>
        <p className="mt-2 text-gray-600">Iniciaste sesión como: {userEmail}</p>

        {/* Dashboard Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Card 1</h3>
            <p className="mt-2 text-gray-600">Contenido del card 1</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Card 2</h3>
            <p className="mt-2 text-gray-600">Contenido del card 2</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Card 3</h3>
            <p className="mt-2 text-gray-600">Contenido del card 3</p>
          </div>
        </div>

        {/* Additional Content */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Sección Principal</h3>
          <p className="mt-2 text-gray-600">Aquí puedes agregar el contenido principal de tu aplicación.</p>
        </div>
      </div>
    </main>
  );
}
