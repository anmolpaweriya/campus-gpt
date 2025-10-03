"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabse";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        // User is already logged in → redirect to dashboard
        router.replace("/dashboard");
      }
    };

    checkAuth();
  }, [router]);

  return <>{children}</>;
}
