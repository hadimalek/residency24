"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface Session {
  id: string;
  language: string;
  status: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface SessionsResponse {
  sessions: Session[];
  total: number;
  page: number;
  pageSize: number;
}

export default function AdminSessionsPage() {
  const router = useRouter();
  const [data, setData] = useState<SessionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const pageSize = 20;

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });
        if (statusFilter !== "ALL") params.set("status", statusFilter);

        const res = await fetch(`/api/sessions?${params}`);
        if (!res.ok) throw new Error("خطا در دریافت سشن‌ها");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [page, statusFilter]);

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">وضعیت:</span>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">همه</SelectItem>
                <SelectItem value="ACTIVE">فعال</SelectItem>
                <SelectItem value="CLOSED">بسته شده</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {data && (
            <span className="text-sm text-gray-500 mr-auto">
              مجموع: {data.total.toLocaleString("fa-IR")} سشن
            </span>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">شناسه</TableHead>
                <TableHead className="text-right">زبان</TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
                <TableHead className="text-right">تعداد پیام</TableHead>
                <TableHead className="text-right">شروع</TableHead>
                <TableHead className="text-right">آخرین فعالیت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data?.sessions?.length ? (
                data.sessions.map((session) => (
                  <TableRow
                    key={session.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push(`/admin/sessions/${session.id}`)}
                  >
                    <TableCell className="font-mono text-xs text-blue-600">
                      {session.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="text-sm">{session.language}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-sm">
                      {session.messageCount?.toLocaleString("fa-IR") ?? "۰"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(session.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(session.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-12">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    سشنی یافت نشد
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronRight className="h-4 w-4" />
            قبلی
          </Button>
          <span className="text-sm text-gray-600 px-3">
            صفحه {page.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            بعدی
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
