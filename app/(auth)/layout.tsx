"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/home/Sidebar";
import Header from "@/components/home/Header";
import { AuthContext } from "@/contexts/AuthContext";
import { CampoProvider } from "@/contexts/CampoContext";

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
      <CampoProvider>
        <SidebarProvider
          className="h-screen overflow-hidden"
          style={{ "--sidebar-width-icon": "3.5rem" } as React.CSSProperties}
        >
          <AppSidebar />
          <SidebarInset className="min-w-0">
            <Header />
            <div className="flex-1 overflow-y-auto min-w-0">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </CampoProvider>
    </AuthContext.Provider>
  );
}
