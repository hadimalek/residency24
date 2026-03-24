"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  Trash2,
  MessageSquare,
  User,
  Bot,
  Clock,
  Globe,
  Hash,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  status: string;
}

interface SessionDetail {
  id: string;
  language: string;
  status: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  lead: Lead | null;
}

export default function AdminSessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/sessions/${id}`);
        if (!res.ok) throw new Error("خطا در دریافت جزئیات سشن");
        const json = await res.json();
        setSession(json);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("خطا در حذف سشن");
      toast.success("سشن با موفقیت حذف شد");
      router.push("/admin/sessions");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-3/4" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="p-12 text-center text-gray-400">
          سشن یافت نشد
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/admin/sessions")}
        className="gap-2"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به لیست سشن‌ها
      </Button>

      {/* Session info card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              اطلاعات سشن
            </CardTitle>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  حذف سشن
                </Button>
              </DialogTrigger>
              <DialogContent dir="rtl">
                <DialogHeader>
                  <DialogTitle>حذف سشن</DialogTitle>
                  <DialogDescription>
                    آیا مطمئن هستید که می‌خواهید این سشن را حذف کنید؟ این عمل قابل بازگشت نیست.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    انصراف
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? "در حال حذف..." : "بله، حذف شود"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Hash className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">شناسه</p>
                <p className="text-sm font-mono">{session.id.substring(0, 12)}...</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">زبان</p>
                <p className="text-sm">{session.language}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">تاریخ شروع</p>
                <p className="text-sm">{formatDate(session.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">آخرین فعالیت</p>
                <p className="text-sm">{formatDate(session.updatedAt)}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-gray-500">وضعیت:</span>
            <Badge
              variant="secondary"
              className={
                session.status === "ACTIVE"
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-100"
              }
            >
              {session.status === "ACTIVE" ? "فعال" : "بسته"}
            </Badge>
            <span className="text-xs text-gray-500 mr-4">تعداد پیام:</span>
            <span className="text-sm font-medium">
              {session.messageCount?.toLocaleString("fa-IR") ?? "۰"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Lead info card */}
      {session.lead && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <User className="h-5 w-5" />
              اطلاعات لید
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">نام</p>
                <p className="text-sm">{session.lead.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ایمیل</p>
                <p className="text-sm">{session.lead.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">تلفن</p>
                <p className="text-sm">{session.lead.phone || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ملیت</p>
                <p className="text-sm">{session.lead.nationality || "—"}</p>
              </div>
            </div>
            <div className="mt-3">
              <Link
                href={`/admin/leads/${session.lead.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                مشاهده جزئیات لید
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat history */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            تاریخچه گفتگو
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[600px] overflow-y-auto px-2">
            {session.messages?.length ? (
              session.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-bl-sm"
                        : msg.role === "assistant"
                        ? "bg-gray-100 text-gray-800 rounded-br-sm"
                        : "bg-yellow-50 text-yellow-800 border border-yellow-200 text-xs italic w-full max-w-full"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {msg.role === "user" ? (
                        <User className="h-3 w-3" />
                      ) : msg.role === "assistant" ? (
                        <Bot className="h-3 w-3" />
                      ) : null}
                      <span className="text-xs opacity-70">
                        {msg.role === "user"
                          ? "کاربر"
                          : msg.role === "assistant"
                          ? "دستیار"
                          : "سیستم"}
                      </span>
                      <span className="text-xs opacity-50 mr-auto">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                پیامی وجود ندارد
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
