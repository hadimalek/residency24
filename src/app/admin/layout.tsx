"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Toaster } from "@/components/ui/sonner";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";

const pageTitles: Record<string, string> = {
  "/admin": "داشبورد",
  "/admin/sessions": "سشن‌ها",
  "/admin/leads": "لیدها",
  "/admin/prompts": "پرامت‌ها",
  "/admin/providers": "تامین‌کننده‌ها",
  "/admin/settings": "تنظیمات",
  "/admin/authors": "مدیریت نویسنده‌ها",
  "/admin/login": "ورود",
};

// Pages accessible only by ADMIN role
const adminOnlyPaths = [
  "/admin/sessions",
  "/admin/leads",
  "/admin/prompts",
  "/admin/providers",
  "/admin/authors",
  "/admin/settings",
];

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/admin/sessions/")) return "جزئیات سشن";
  if (pathname.startsWith("/admin/leads/")) return "جزئیات لید";
  if (pathname.startsWith("/admin/prompts/")) return "ویرایش پرامت";
  return "پنل مدیریت";
}

function isAdminOnly(pathname: string): boolean {
  return adminOnlyPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAdminAuth();

  // Redirect unauthenticated users (except on login page)
  useEffect(() => {
    if (loading || pathname === "/admin/login") return;
    if (!user) {
      router.replace("/admin/login");
      return;
    }
    // Redirect EDITOR away from admin-only pages
    if (user.role !== "ADMIN" && isAdminOnly(pathname)) {
      router.replace("/admin");
    }
  }, [loading, user, pathname, router]);

  if (pathname === "/admin/login") {
    return (
      <div dir="rtl" className="font-sans min-h-screen">
        {children}
        <Toaster position="top-center" dir="rtl" />
      </div>
    );
  }

  // Show loading spinner while auth loads
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-10 w-10 border-4 border-[#001E6E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Block render if EDITOR is on admin-only page
  if (user && user.role !== "ADMIN" && isAdminOnly(pathname)) {
    return null;
  }

  const title = getPageTitle(pathname);

  return (
    <div dir="rtl" className="font-sans min-h-screen bg-gray-50">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
