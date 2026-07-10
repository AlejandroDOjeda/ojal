"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/app";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Leer el hash de la URL directamente es más confiable que esperar el evento,
    // porque PASSWORD_RECOVERY puede dispararse antes de que el listener se registre.
    const params = new URLSearchParams(window.location.hash.slice(1));
    if (params.get("type") === "recovery") {
      setReady(true);
      return;
    }

    // Fallback: escuchar el evento por si el hash ya fue procesado y limpiado
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const validate = (): boolean => {
    let valid = true;
    if (!password) { setPasswordError("La contraseña es obligatoria"); valid = false; }
    else if (password.length < 6) { setPasswordError("Mínimo 6 caracteres"); valid = false; }
    else setPasswordError(null);
    if (!confirm) { setConfirmError("Confirmá la contraseña"); valid = false; }
    else if (confirm !== password) { setConfirmError("Las contraseñas no coinciden"); valid = false; }
    else setConfirmError(null);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      await supabase.auth.signOut();
      router.replace("/");
    }
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="w-full max-w-md bg-card rounded-lg shadow p-8 text-center space-y-2">
          <p className="font-medium">Verificando enlace...</p>
          <p className="text-sm text-muted-foreground">Si llegaste desde el email de recuperación, esperá un momento.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md bg-card rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">Nueva contraseña</h1>
        <p className="text-sm text-muted-foreground mb-6 text-center">Ingresá la contraseña que querés usar de ahora en adelante</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Nueva contraseña" required error={passwordError ?? undefined}>
            <Input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(null); }}
            />
          </FormField>

          <FormField label="Confirmar contraseña" required error={confirmError ?? undefined}>
            <Input
              type="password"
              placeholder="Repetí la contraseña"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setConfirmError(null); }}
            />
          </FormField>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar contraseña"}
          </Button>
        </form>
      </div>
    </main>
  );
}
