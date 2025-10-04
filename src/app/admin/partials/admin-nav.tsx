"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  LayoutDashboard,
  UserCog,
  BookOpen,
  Calendar,
  LogOut,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabse";
import { useSupabaseContext } from "@/providers/supabse.provider";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useSupabaseContext();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/courses", label: "Courses", icon: BookOpen },
    { href: "/admin/faculty", label: "Faculty", icon: UserCog },
    { href: "/admin/events", label: "Events", icon: Calendar },
    { href: "/admin/building", label: "Buildings", icon: Building },
  ];

  return (
    <nav className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 font-bold text-lg"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              Campus<span className="text-primary">GPT</span>
              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                Admin
              </span>
            </Link>
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "gap-2",
                        isActive &&
                          "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="bg-gray-200 py-2 px-5  rounded-2xl">
              {user?.user_metadata?.name}
            </div>

            <Button variant="ghost" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
