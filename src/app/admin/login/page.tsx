"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, LogIn, AlertCircle } from "lucide-react";
import { toast } from "sonner";

/**
 * Where to land after signing in. src/proxy.ts appends ?redirect=<path> when it
 * bounces an unauthenticated request, so the editor returns to the page they
 * were actually going to. Only same-origin /admin paths are accepted — anything
 * else (a protocol-relative "//evil.com", an absolute URL, a non-admin path)
 * falls back to the dashboard so this cannot become an open redirect.
 */
function safeRedirect(target: string | null): string {
  if (!target) return "/admin";
  if (!target.startsWith("/admin")) return "/admin";
  if (target.startsWith("//")) return "/admin";
  return target;
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("ایمیل و رمز عبور الزامی است");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // The route replies with { error }, not { message } — reading the wrong
        // key meant every failure showed the generic "wrong password" text.
        throw new Error(data.error || data.message || "ایمیل یا رمز عبور اشتباه است");
      }

      toast.success("ورود موفقیت‌آمیز بود");

      // A FULL page load, deliberately — not router.push(). AdminAuthContext
      // fetches /api/auth once on mount, so after a soft navigation it still
      // holds the null user from before login, and the admin layout's guard
      // immediately router.replace()s back to /admin/login — which is exactly
      // the "login just reloads the login page" symptom. A document load
      // remounts the provider with the cookie present and also sidesteps any
      // /admin entry cached in the client Router Cache from before signing in.
      // Read at click time from the live URL rather than with useSearchParams(),
      // which would pull this page into a Suspense boundary for a value only
      // needed here.
      window.location.assign(
        safeRedirect(new URLSearchParams(window.location.search).get("redirect"))
      );
      return; // keep the button spinning; the document is being replaced
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در ورود");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg, #001E6E 0%, #001550 40%, #000B30 100%)",
      }}
    >
      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(220, 200, 150, 0.3) 2px, transparent 0)`,
          backgroundSize: "50px 50px",
        }}
      />

      <Card className="w-full max-w-md relative z-10 border-0 shadow-2xl">
        <CardHeader className="text-center pb-2 pt-8">
          {/* Logo */}
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: "#001E6E" }}
          >
            <span
              className="text-2xl font-bold"
              style={{ color: "#DCC896" }}
            >
              R24
            </span>
          </div>
          <CardTitle className="text-xl font-bold" style={{ color: "#001E6E" }}>
            Residency24 Admin
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            برای ورود به پنل مدیریت اطلاعات خود را وارد کنید
          </p>
        </CardHeader>
        <CardContent className="pb-8 pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@residency24.com"
                  dir="ltr"
                  className="text-left pr-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور"
                  dir="ltr"
                  className="text-left pr-10"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gap-2 text-base font-bold py-5"
              disabled={loading}
              style={{
                backgroundColor: "#DCC896",
                color: "#001E6E",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  در حال ورود...
                </span>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  ورود
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
