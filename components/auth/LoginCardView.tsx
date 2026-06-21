"use client";

import React from "react";

type ViewProps = {
  userEmail?: string | null;
  email: string;
  password: string;
  isRegister: boolean;
  loading: boolean;
  errorMessage: string | null;
  cooldownSeconds: number;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  toggleRegister: () => void;
  submit: (e: React.FormEvent) => Promise<void>;
  onSignOut: () => Promise<void>;
};

export default function LoginCardView({
  userEmail,
  email,
  password,
  isRegister,
  loading,
  errorMessage,
  cooldownSeconds,
  setEmail,
  setPassword,
  toggleRegister,
  submit,
  onSignOut,
}: ViewProps) {
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
      <h1 className="text-2xl font-bold mb-2 text-center">{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h1>
      <p className="text-sm text-gray-500 mb-6 text-center">Usa tu email y contraseña</p>

      {userEmail ? (
        <div className="space-y-4 text-center">
          <p className="text-gray-700">Conectado como:</p>
          <p className="font-medium">{userEmail}</p>
          <div className="flex justify-center">
            <button onClick={onSignOut} className="mt-4 inline-flex items-center gap-2 rounded bg-red-500 px-4 py-2 text-white hover:opacity-95">
              Cerrar sesión
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <button
            type="submit"
            disabled={loading || cooldownSeconds > 0}
            className="inline-flex items-center justify-center gap-3 rounded border px-4 py-2 hover:shadow-sm"
          >
            {isRegister ? "Crear cuenta" : "Iniciar sesión"}
          </button>

          {cooldownSeconds > 0 && <div className="text-sm text-red-500">Intenta de nuevo en {cooldownSeconds}s</div>}
          {errorMessage && <div className="text-sm text-red-500">{errorMessage}</div>}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <button type="button" onClick={toggleRegister} className="underline">
              {isRegister ? "¿Ya tenés cuenta? Iniciar sesión" : "¿No tenés cuenta? Registrate"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
