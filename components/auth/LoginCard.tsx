"use client";

import React from "react";
import LoginCardView from "@/components/auth/LoginCardView";
import useLoginForm from "@/hooks/useLoginForm";
import type { RegisterProfileData } from "@/hooks/useLoginForm";

type Props = {
  onSignOut: () => Promise<void>;
  onSignInWithEmail: (email: string, password: string) => Promise<void>;
  onSignUpWithEmail: (email: string, password: string, profileData?: RegisterProfileData) => Promise<void>;
  onResetPasswordForEmail: (email: string) => Promise<void>;
  userEmail?: string | null;
};

export default function LoginCard(props: Props) {
  const { onSignInWithEmail, onSignUpWithEmail, onResetPasswordForEmail, onSignOut, userEmail } = props;
  const form = useLoginForm({ onSignInWithEmail, onSignUpWithEmail, onResetPasswordForEmail });

  return <LoginCardView {...form} onSignOut={onSignOut} userEmail={userEmail} />;
}
