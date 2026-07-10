"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginCard from "@/components/auth/LoginCard";
import useAuth from "@/hooks/useAuth";

export default function Home() {
  const { session, userEmail, loading, signOut, signInWithEmail, signUpWithEmail, resetPasswordForEmail } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si el usuario llega desde un link de recuperación de contraseña, redirigir
    // antes de que la sesión de recovery lo mande a /home.
    const params = new URLSearchParams(window.location.hash.slice(1));
    if (params.get("type") === "recovery") {
      router.replace("/reset-password");
      return;
    }
    if (!loading && session) {
      router.replace("/home");
    }
  }, [session, loading, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background">
        <p className="text-muted-foreground">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <LoginCard onSignInWithEmail={signInWithEmail} onSignUpWithEmail={signUpWithEmail} onResetPasswordForEmail={resetPasswordForEmail} onSignOut={signOut} userEmail={userEmail} />
    </main>
  );
}