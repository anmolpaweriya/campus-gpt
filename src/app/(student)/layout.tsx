"use client";
import { useSupabaseContext } from "@/providers/supabse.provider";
import { useAxios } from "@/services/axios/axios.hooks";
import { UserRoles } from "@/types/global.types";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import axiosLib from "axios";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useSupabaseContext();
  const { axios } = useAxios();
  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/auth/login");
    } else if (user?.user_metadata?.role == UserRoles.ADMIN) {
      router.replace("/admin");
    }

    async function checkCourseJoined() {
      try {
        const res = await axios.get("/education/course/joined");
        if (res.data.data) {
          router.replace("/dashboard");
        } else {
          router.replace("/select-course");
        }
      } catch (err: any) {
        if (axiosLib.isAxiosError(err) && err.response?.status === 404) {
          router.replace("/select-course");
        } else {
          console.error("Unexpected error:", err);
          // Optionally handle other errors (e.g., 500, 401) differently
        }
      }
    }

    checkCourseJoined();
  }, [user, isLoading]);

  if (isLoading) return <>Loading ...</>;
  return <>{children}</>;
}
