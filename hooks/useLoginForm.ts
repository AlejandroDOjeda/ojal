"use client";

import React from "react";

export type RegisterProfileData = {
  nombre: string;
  apellido: string;
  telefono: string;
  razonSocial: string;
  cuitCuil: string;
  idTipoPersona: string;
  idCondicionIva: string;
};

const EMPTY_PROFILE: RegisterProfileData = {
  nombre: "", apellido: "", telefono: "",
  razonSocial: "", cuitCuil: "", idTipoPersona: "", idCondicionIva: "",
};

type AuthHandlers = {
  onSignInWithEmail: (email: string, password: string) => Promise<void>;
  onSignUpWithEmail: (email: string, password: string, profileData?: RegisterProfileData) => Promise<void>;
};

export default function useLoginForm({ onSignInWithEmail, onSignUpWithEmail }: AuthHandlers) {
  const [isRegister, setIsRegister] = React.useState(false);
  const [email, setEmailState] = React.useState("");
  const [password, setPasswordState] = React.useState("");
  const [profileData, setProfileData] = React.useState<RegisterProfileData>(EMPTY_PROFILE);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [telefonoError, setTelefonoError] = React.useState<string | null>(null);
  const [cuitCuilError, setCuitCuilError] = React.useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = React.useState<number>(0);

  React.useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const t = setInterval(() => setCooldownSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldownSeconds]);

  const setEmail = (v: string) => { setEmailState(v); setEmailError(null); };
  const setPassword = (v: string) => { setPasswordState(v); setPasswordError(null); };

  const setProfileField = (field: keyof RegisterProfileData, value: string) => {
    setProfileData((p) => ({ ...p, [field]: value }));
    if (field === "telefono") setTelefonoError(null);
    if (field === "cuitCuil") setCuitCuilError(null);
  };

  const validate = (): boolean => {
    let valid = true;
    if (!email.trim()) {
      setEmailError("El email es obligatorio");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Ingresá un email válido");
      valid = false;
    } else {
      setEmailError(null);
    }
    if (!password) {
      setPasswordError("La contraseña es obligatoria");
      valid = false;
    } else {
      setPasswordError(null);
    }
    if (profileData.telefono && profileData.telefono.length < 7) {
      setTelefonoError("El teléfono debe tener al menos 7 dígitos");
      valid = false;
    } else {
      setTelefonoError(null);
    }
    if (profileData.cuitCuil && profileData.cuitCuil.length !== 11) {
      setCuitCuilError("El CUIT/CUIL debe tener 11 dígitos");
      valid = false;
    } else {
      setCuitCuilError(null);
    }
    return valid;
  };

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
    setErrorMessage(null);
    setSuccessMessage(null);

    if (isRegister && !validate()) return;

    setLoading(true);
    try {
      if (isRegister) {
        await onSignUpWithEmail(email, password, profileData);
        setIsRegister(false);
        setProfileData(EMPTY_PROFILE);
        setPasswordState("");
        setEmailError(null);
        setPasswordError(null);
        setTelefonoError(null);
        setCuitCuilError(null);
        setSuccessMessage("¡Cuenta creada! Revisá tu correo y hacé clic en el link de verificación antes de iniciar sesión.");
      } else {
        await onSignInWithEmail(email, password);
      }
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

      setErrorMessage(translateError(message));
      console.error("Auth error:", err);

      const lower = message.toLowerCase();
      if (lower.includes("once every") || lower.includes("every minute") || lower.includes("only request this")) {
        setCooldownSeconds(60);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleRegister = () => {
    setIsRegister((s) => !s);
    setProfileData(EMPTY_PROFILE);
    setErrorMessage(null);
    setSuccessMessage(null);
    setEmailError(null);
    setPasswordError(null);
    setTelefonoError(null);
    setCuitCuilError(null);
  };

  return {
    email, setEmail,
    password, setPassword,
    profileData, setProfileField,
    isRegister, setIsRegister, toggleRegister,
    loading, errorMessage, successMessage,
    emailError, passwordError, telefonoError, cuitCuilError,
    cooldownSeconds,
    submit,
  } as const;
}
