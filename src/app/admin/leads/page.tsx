"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
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
import { Users, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { toast } from "sonner";

interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  status: string;
  createdAt: string;
}

interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  pageSize: number;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  NEW: { label: "جدید", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  FOLLOWING: { label: "پیگیری", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
  CONVERTED: { label: "تبدیل شده", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  ARCHIVED: { label: "آرشیو", className: "bg-gray-100 text-gray-600 hover:bg-gray-100" },
};

export default function AdminLeadsPage() {
  const router = useRouter();
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [nationalityFilter, setNationalityFilter] = useState<string>("ALL");
  const [exporting, setExporting] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });
        if (statusFilter !== "ALL") params.set("status", statusFilter);
        if (nationalityFilter !== "ALL") params.set("nationality", nationalityFilter);

        const res = await fetch(`/api/leads?${params}`);
        if (!res.ok) throw new Error("خطا در دریافت لیدها");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [page, statusFilter, nationalityFilter]);

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (nationalityFilter !== "ALL") params.set("nationality", nationalityFilter);

      const res = await fetch(`/api/leads/export?${params}`);
      if (!res.ok) throw new Error("خطا در دریافت فایل خروجی");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("فایل CSV دانلود شد");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "short",
        day: "numeric",
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
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">همه</SelectItem>
                <SelectItem value="NEW">جدید</SelectItem>
                <SelectItem value="FOLLOWING">پیگیری</SelectItem>
                <SelectItem value="CONVERTED">تبدیل شده</SelectItem>
                <SelectItem value="ARCHIVED">آرشیو</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">ملیت:</span>
            <Select
              value={nationalityFilter}
              onValueChange={(v) => {
                setNationalityFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">همه</SelectItem>
                <SelectItem value="Iranian">ایرانی</SelectItem>
                <SelectItem value="Afghan">افغان</SelectItem>
                <SelectItem value="Iraqi">عراقی</SelectItem>
                <SelectItem value="Other">سایر</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mr-auto flex items-center gap-3">
            {data && (
              <span className="text-sm text-gray-500">
                مجموع: {data.total.toLocaleString("fa-IR")} لید
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exporting}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {exporting ? "در حال دانلود..." : "خروجی CSV"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">نام</TableHead>
                <TableHead className="text-right">ایمیل</TableHead>
                <TableHead className="text-right">تلفن</TableHead>
                <TableHead className="text-right">ملیت</TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
                <TableHead className="text-right">تاریخ</TableHead>
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
              ) : data?.leads?.length ? (
                data.leads.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push(`/admin/leads/${lead.id}`)}
                  >
                    <TableCell className="text-sm font-medium">
                      {lead.name || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {lead.email || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 font-mono">
                      {lead.phone || "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {lead.nationality || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          statusConfig[lead.status]?.className ??
                          statusConfig.NEW.className
                        }
                      >
                        {statusConfig[lead.status]?.label ?? lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(lead.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-400 py-12"
                  >
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    لیدی یافت نشد
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
            صفحه {page.toLocaleString("fa-IR")} از{" "}
            {totalPages.toLocaleString("fa-IR")}
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
