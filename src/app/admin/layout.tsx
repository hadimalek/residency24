"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

const pageTitles: Record<string, string> = {
  "/admin": "داشبورد",
  "/admin/sessions": "سشن‌ها",
  "/admin/leads": "لیدها",
  "/admin/prompts": "پرامت‌ها",
  "/admin/providers": "تامین‌کننده‌ها",
  "/admin/settings": "تنظیمات",
  "/admin/login": "ورود",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/admin/sessions/")) return "جزئیات سشن";
  if (pathname.startsWith("/admin/leads/")) return "جزئیات لید";
  if (pathname.startsWith("/admin/prompts/")) return "ویرایش پرامت";
  return "پنل مدیریت";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Login page gets its own layout (no sidebar/header)
  if (pathname === "/admin/login") {
    return (
      <div dir="rtl" className="font-sans min-h-screen">
        {children}
        <Toaster position="top-center" dir="rtl" />
      </div>
    );
  }

  const title = getPageTitle(pathname);

  return (
    <div dir="rtl" className="font-sans min-h-screen bg-gray-50">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area - offset for sidebar on desktop */}
      <div className="lg:mr-64">
        <AdminHeader
          title={title}
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>

      <Toaster position="top-center" dir="rtl" />
    </div>
  );
}
