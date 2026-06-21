"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginCard from "@/components/auth/LoginCard";
import useAuth from "@/hooks/useAuth";

export default function Home() {
  const { session, userEmail, loading, signOut, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      router.replace("/home");
    }
  }, [session, loading, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-500">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <LoginCard onSignInWithEmail={signInWithEmail} onSignUpWithEmail={signUpWithEmail} onSignOut={signOut} userEmail={userEmail} />
    </main>
  );
}