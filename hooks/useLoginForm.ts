"use client";

import React from "react";

type AuthHandlers = {
  onSignInWithEmail: (email: string, password: string) => Promise<void>;
  onSignUpWithEmail: (email: string, password: string) => Promise<void>;
};

export default function useLoginForm({ onSignInWithEmail, onSignUpWithEmail }: AuthHandlers) {
  const [isRegister, setIsRegister] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = React.useState<number>(0);

  React.useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const t = setInterval(() => setCooldownSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldownSeconds]);

  const translateError = (message: string) => {
    const lower = message.toLowerCase();
    if (lower.includes("invalid") && lower.includes("credential")) return "Credenciales inválidas";
    if (lower.includes("invalid") && lower.includes("email")) return "Email inválido";
    if (lower.includes("password") && lower.includes("weak")) return "La contraseña es demasiado débil";
    if (lower.includes("already registered")) return "El usuario ya está registrado";
    return message;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      if (isRegister) await onSignUpWithEmail(email, password);
      else await onSignInWithEmail(email, password);
    } catch (err: unknown) {
      let message = "Ha ocurrido un error";
      if (typeof err === "string") message = err;
      else if (err && typeof err === "object") {
        const maybeMessage = (err as { message?: unknown }).message;
        if (typeof maybeMessage === "string") message = maybeMessage;
        else {
          const errObj = err as { error_description?: unknown };
          if (errObj.error_description && typeof errObj.error_description === "string") message = errObj.error_description;
        }
      } else if (err !== undefined) message = String(err);

      const userMessage = translateError(message);
      setErrorMessage(userMessage);
      console.error("Auth error:", err);

      const lower = message.toLowerCase();
      if (lower.includes("once every") || lower.includes("every minute") || lower.includes("only request this")) {
        setCooldownSeconds(60);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isRegister,
    setIsRegister,
    toggleRegister: () => setIsRegister((s) => !s),
    loading,
    errorMessage,
    cooldownSeconds,
    submit,
  } as const;
}
