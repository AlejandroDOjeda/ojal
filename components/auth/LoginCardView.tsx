"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  userEmail, email, password, isRegister, loading, errorMessage,
  cooldownSeconds, setEmail, setPassword, toggleRegister, submit, onSignOut,
}: ViewProps) {
  return (
    <div className="w-full max-w-md bg-card rounded-lg shadow p-8">
      <h1 className="text-2xl font-bold mb-2 text-center">{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h1>
      <p className="text-sm text-muted-foreground mb-6 text-center">Usa tu email y contraseña</p>

      {userEmail ? (
        <div className="space-y-4 text-center">
          <p className="text-foreground">Conectado como:</p>
          <p className="font-medium">{userEmail}</p>
          <div className="flex justify-center">
            <Button variant="destructive" onClick={onSignOut} className="mt-4">Cerrar sesión</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <Button type="submit" variant="outline" disabled={loading || cooldownSeconds > 0}>
            {isRegister ? "Crear cuenta" : "Iniciar sesión"}
          </Button>

          {cooldownSeconds > 0 && <p className="text-sm text-destructive">Intenta de nuevo en {cooldownSeconds}s</p>}
          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Button type="button" variant="link" size="xs" onClick={toggleRegister} className="text-muted-foreground underline p-0 h-auto">
              {isRegister ? "¿Ya tenés cuenta? Iniciar sesión" : "¿No tenés cuenta? Registrate"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
