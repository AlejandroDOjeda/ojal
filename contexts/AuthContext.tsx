"use client";

import { createContext, useContext } from "react";

export type AuthContextValue = {
  userEmail: string | null;
  userId: string | undefined;
  loading: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext debe usarse dentro de AuthLayout");
  return ctx;
}
