"use client";
import { useSupabaseContext } from "@/providers/supabse.provider";
import { UserRoles } from "@/types/global.types";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useSupabaseContext();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/auth/login");
    } else if (user?.user_metadata?.role == UserRoles.USER) {
      router.replace("/dashbaord");
    }
  }, [user, isLoading]);

  if (isLoading) return <>Loading ...</>;
  return <>{children}</>;
}
