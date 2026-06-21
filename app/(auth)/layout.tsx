"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Sidebar from "@/components/home/Sidebar";
import Header from "@/components/home/Header";
import { AuthContext } from "@/contexts/AuthContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { session, userEmail, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/");
    }
  }, [session, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!session) return null;

  const ctxValue = {
    userEmail,
    userId: session.user?.id,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={ctxValue}>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </AuthContext.Provider>
  );
}
