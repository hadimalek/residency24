"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAdminAuth } from "@/context/AdminAuthContext";

interface AdminHeaderProps {
  title: string;
  onMenuToggle: () => void;
}

export default function AdminHeader({ title, onMenuToggle }: AdminHeaderProps) {
  const [currentDate, setCurrentDate] = useState("");
  const { user } = useAdminAuth();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString("fa-IR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "RA";

  const displayName = user
    ? user.role === "ADMIN"
      ? user.name
      : user.name
    : "مدیر سیستم";

  const roleLabel = user?.role === "ADMIN" ? "مدیر ارشد" : "نویسنده";

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500 hidden sm:block">{currentDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 hidden md:block">{currentDate}</span>
          <Separator orientation="vertical" className="h-6 hidden md:block" />
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback
                className="text-xs font-bold text-white"
                style={{ backgroundColor: "#001E6E" }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700 leading-none">{displayName}</p>
              {user && (
                <p className="text-xs text-gray-400 mt-0.5">{roleLabel}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
