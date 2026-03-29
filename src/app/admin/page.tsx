"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Users,
  Activity,
  UserPlus,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DashboardData {
  stats: {
    totalSessions: number;
    activeSessions: number;
    totalLeads: number;
    newLeads: number;
  };
  recentSessions: Array<{
    id: string;
    language: string;
    status: string;
    messageCount: number;
    createdAt: string;
  }>;
  recentLeads: Array<{
    id: string;
    name: string;
    email: string;
    nationality: string;
    status: string;
    createdAt: string;
  }>;
}

const statsConfig = [
  {
    key: "totalSessions" as const,
    label: "کل سشن‌ها",
    icon: MessageSquare,
    color: "#001E6E",
    bgColor: "bg-blue-50",
  },
  {
    key: "activeSessions" as const,
    label: "سشن‌های فعال",
    icon: Activity,
    color: "#16a34a",
    bgColor: "bg-green-50",
  },
  {
    key: "totalLeads" as const,
    label: "کل لیدها",
    icon: Users,
    color: "#001E6E",
    bgColor: "bg-indigo-50",
  },
  {
    key: "newLeads" as const,
    label: "لیدهای جدید",
    icon: UserPlus,
    color: "#DCC896",
    bgColor: "bg-amber-50",
  },
];

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("خطا در دریافت اطلاعات");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-500">
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat) => (
          <Card key={stat.key} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500 font-medium">
                  {stat.label}
                </span>
                <div
                  className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center",
                    stat.bgColor
                  )}
                >
                  <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                </div>
              </div>
              <p
                className="text-3xl font-bold"
                style={{ color: "#001E6E" }}
              >
                {data?.stats[stat.key]?.toLocaleString("fa-IR") ?? "۰"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              آخرین سشن‌ها
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">شناسه</TableHead>
                  <TableHead className="text-right">زبان</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">پیام‌ها</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.recentSessions?.length ? (
                  data.recentSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <Link
                          href={`/admin/sessions/${session.id}`}
                          className="text-blue-600 hover:underline text-xs font-mono"
                        >
                          {session.id.substring(0, 8)}...
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm">{session.language}</TableCell>
                      <TableCell>
                        <Badge
                          variant={session.status === "ACTIVE" ? "default" : "secondary"}
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
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-400 py-8">
                      سشنی یافت نشد
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Users className="h-4 w-4" />
              آخرین لیدها
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">نام</TableHead>
                  <TableHead className="text-right">ایمیل</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.recentLeads?.length ? (
                  data.recentLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {lead.name || "—"}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {lead.email || "—"}
                      </TableCell>
                      <TableCell>
                        <LeadStatusBadge status={lead.status} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-400 py-8">
                      لیدی یافت نشد
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LeadStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    NEW: { label: "جدید", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
    FOLLOWING: { label: "پیگیری", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
    CONVERTED: { label: "تبدیل شده", className: "bg-green-100 text-green-700 hover:bg-green-100" },
    ARCHIVED: { label: "آرشیو", className: "bg-gray-100 text-gray-600 hover:bg-gray-100" },
  };
  const c = config[status] || config.NEW;
  return (
    <Badge variant="secondary" className={c.className}>
      {c.label}
    </Badge>
  );
}
