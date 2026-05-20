"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  FileText,
  Cpu,
  Settings,
  LogOut,
  X,
  ChevronRight,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAdminAuth } from "@/context/AdminAuthContext";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const adminNavItems = [
  { label: "داشبورد", icon: LayoutDashboard, href: "/admin" },
  { label: "سشن‌ها", icon: MessageSquare, href: "/admin/sessions" },
  { label: "لیدها", icon: Users, href: "/admin/leads" },
  { label: "پرامت‌ها", icon: FileText, href: "/admin/prompts" },
  { label: "تامین‌کننده‌ها", icon: Cpu, href: "/admin/providers" },
  { label: "نویسنده‌ها", icon: UserCog, href: "/admin/authors" },
  { label: "تنظیمات", icon: Settings, href: "/admin/settings" },
];

const editorNavItems = [
  { label: "داشبورد", icon: LayoutDashboard, href: "/admin" },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAdminAuth();

  const isAdmin = user?.role === "ADMIN";
  const navItems = isAdmin ? adminNavItems : editorNavItems;

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-64 flex flex-col transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
        style={{ backgroundColor: "#001E6E" }}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-6 py-5">
          <h1
            className="text-lg font-bold tracking-tight"
            style={{ color: "#DCC896" }}
          >
            Residency24 Admin
          </h1>
          <button
            onClick={onClose}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role badge */}
        {user && (
          <div className="px-6 pb-3">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={
                isAdmin
                  ? { backgroundColor: "rgba(220,200,150,0.2)", color: "#DCC896" }
                  : { backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }
              }
            >
              {isAdmin ? "مدیر ارشد" : "نویسنده"}
            </span>
          </div>
        )}

        <Separator className="bg-white/10" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
                style={
                  active
                    ? { backgroundColor: "rgba(220, 200, 150, 0.15)", color: "#DCC896" }
                    : undefined
                }
              >
                <item.icon
                  className="h-5 w-5 flex-shrink-0"
                  style={active ? { color: "#DCC896" } : undefined}
                />
                <span>{item.label}</span>
                {active && (
                  <ChevronRight
                    className="h-4 w-4 mr-auto"
                    style={{ color: "#DCC896" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-white/10" />

        {/* User info + logout */}
        <div className="px-3 py-4 space-y-2">
          {user && (
            <div className="px-4 py-2">
              <p className="text-xs text-white/40 truncate">{user.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/5"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>خروج</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
