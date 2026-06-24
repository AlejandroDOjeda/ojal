"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, SelectBox } from "@/components/app";
import { TIPO_PERSONA_OPTIONS, CONDICION_IVA_OPTIONS } from "@/lib/opciones";
import type { RegisterProfileData } from "@/hooks/useLoginForm";

const formatCuit = (digits: string): string => {
  if (digits.length <= 2) return digits;
  if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10)}`;
};

type ViewProps = {
  userEmail?: string | null;
  email: string;
  password: string;
  isRegister: boolean;
  profileData: RegisterProfileData;
  setProfileField: (field: keyof RegisterProfileData, value: string) => void;
  loading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  emailError: string | null;
  passwordError: string | null;
  telefonoError: string | null;
  cuitCuilError: string | null;
  cooldownSeconds: number;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  toggleRegister: () => void;
  submit: (e: React.FormEvent) => Promise<void>;
  onSignOut: () => Promise<void>;
};

export default function LoginCardView({
  userEmail, email, password, isRegister, profileData, setProfileField,
  loading, errorMessage, successMessage, emailError, passwordError, telefonoError, cuitCuilError,
  cooldownSeconds, setEmail, setPassword, toggleRegister, submit, onSignOut,
}: ViewProps) {
  return (
    <div className={`w-full bg-card rounded-lg shadow p-8 ${isRegister ? "max-w-lg" : "max-w-md"}`}>
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

          {successMessage && (
            <div className="rounded-md bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-700 dark:text-green-400">
              {successMessage}
            </div>
          )}

          <div className="space-y-1">
            <FormField label="Email" required error={emailError ?? undefined}>
              <Input
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>
            {isRegister && (
              <p className="text-xs text-muted-foreground">
                Usá un correo válido al que tengas acceso, se enviará un link de verificación.
              </p>
            )}
          </div>

          <FormField label="Contraseña" required error={passwordError ?? undefined}>
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>

          {isRegister && (
            <div className="flex flex-col gap-4 pt-1">
              <p className="text-xs font-medium text-muted-foreground -mb-1">Datos del perfil (opcionales)</p>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Nombre">
                  <Input placeholder="Nombre" value={profileData.nombre} onChange={(e) => setProfileField("nombre", e.target.value)} />
                </FormField>
                <FormField label="Apellido">
                  <Input placeholder="Apellido" value={profileData.apellido} onChange={(e) => setProfileField("apellido", e.target.value)} />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Teléfono" error={telefonoError ?? undefined}>
                  <Input
                    type="tel"
                    placeholder="Ej: 3491123456"
                    value={profileData.telefono}
                    onChange={(e) => setProfileField("telefono", e.target.value.replace(/\D/g, ""))}
                    maxLength={15}
                  />
                </FormField>
                <FormField label="CUIT / CUIL" error={cuitCuilError ?? undefined}>
                  <Input
                    placeholder="20-12345678-9"
                    value={formatCuit(profileData.cuitCuil)}
                    onChange={(e) => setProfileField("cuitCuil", e.target.value.replace(/\D/g, "").slice(0, 11))}
                    maxLength={13}
                  />
                </FormField>
              </div>

              <FormField label="Razón Social">
                <Input placeholder="Razón Social" value={profileData.razonSocial} onChange={(e) => setProfileField("razonSocial", e.target.value)} />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Tipo de persona">
                  <SelectBox
                    options={TIPO_PERSONA_OPTIONS}
                    value={profileData.idTipoPersona}
                    onValueChange={(v) => setProfileField("idTipoPersona", v)}
                    placeholder="— Seleccioná —"
                  />
                </FormField>
                <FormField label="Condición IVA">
                  <SelectBox
                    options={CONDICION_IVA_OPTIONS}
                    value={profileData.idCondicionIva}
                    onValueChange={(v) => setProfileField("idCondicionIva", v)}
                    placeholder="— Seleccioná —"
                  />
                </FormField>
              </div>
            </div>
          )}

          <Button type="submit" variant="outline" disabled={loading || cooldownSeconds > 0}>
            {loading ? "Procesando..." : isRegister ? "Crear cuenta" : "Iniciar sesión"}
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
