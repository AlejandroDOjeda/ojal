"use client";

import { useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { useAuthContext } from "@/contexts/AuthContext";

const themeKey = (userId: string) => `ojal_theme_${userId}`;

export function useUserTheme() {
  const { userId } = useAuthContext();
  const { resolvedTheme, setTheme } = useTheme();

  // Aplica el tema guardado en localStorage cuando cambia el usuario
  useEffect(() => {
    if (!userId) {
      setTheme("system");
      return;
    }
    const stored = localStorage.getItem(themeKey(userId));
    if (stored) setTheme(stored);
  }, [userId, setTheme]);

  // Toggle: sincrónico, sin llamadas async que interfieran
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (userId) {
      localStorage.setItem(themeKey(userId), newTheme);
    }
  }, [resolvedTheme, userId, setTheme]);

  return { resolvedTheme, toggleTheme };
}
