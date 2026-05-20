"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, ChevronLeft, ChevronRight } from "lucide-react";

interface PostRow {
  id: string;
  slug: string;
  status: string;
  locale: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  updatedAt: string;
  author: { id: string; name: string } | null;
  category: { id: string; name: string } | null;
  featuredImagePath: string | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PUBLISHED: { label: "منتشر شده", color: "bg-green-100 text-green-800 border-green-200" },
  DRAFT: { label: "پیش‌نویس", color: "bg-amber-100 text-amber-800 border-amber-200" },
  ARCHIVED: { label: "بایگانی", color: "bg-gray-100 text-gray-700 border-gray-200" },
  REVIEW: { label: "در بازبینی", color: "bg-blue-100 text-blue-800 border-blue-200" },
};

export default function AdminPostsListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [meta, setMeta] = useState<{ total: number; lastPage: number }>({ total: 0, lastPage: 1 });
  const [lang, setLang] = useState<string>("__all");
  const [status, setStatus] = useState<string>("__all");
  const [q, setQ] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), per_page: String(perPage) });
      if (lang !== "__all") qs.set("lang", lang);
      if (status !== "__all") qs.set("status", status);
      if (q) qs.set("q", q);
      const res = await fetch(`/api/admin/posts?${qs}`);
      const json = await res.json();
      setRows(json.data ?? []);
      setMeta(json.meta ?? { total: 0, lastPage: 1 });
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, lang, status, q]);

  const formatDate = (s: string | null) => {
    if (!s) return "—";
    try {
      return new Date(s).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return s;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold">مقالات بلاگ</h1>
          <p className="text-sm text-gray-500 mt-1">
            مجموع: {meta.total.toLocaleString("fa-IR")} پست
          </p>
        </div>
        <Button asChild className="gap-2" style={{ backgroundColor: "#001E6E" }}>
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4" />
            پست جدید
          </Link>
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setQ(searchInput);
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
          >
            <div className="md:col-span-2 space-y-1">
              <Label className="text-xs">جستجو</Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="عنوان یا slug…"
                  className="pr-9"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">زبان</Label>
              <Select
                value={lang}
                onValueChange={(v) => {
                  setLang(v);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all">همه</SelectItem>
                  <SelectItem value="fa">فارسی</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">وضعیت</Label>
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all">همه</SelectItem>
                  <SelectItem value="PUBLISHED">منتشر شده</SelectItem>
                  <SelectItem value="DRAFT">پیش‌نویس</SelectItem>
                  <SelectItem value="ARCHIVED">بایگانی</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right w-12"></TableHead>
                  <TableHead className="text-right">عنوان</TableHead>
                  <TableHead className="text-right">زبان</TableHead>
                  <TableHead className="text-right">دسته</TableHead>
                  <TableHead className="text-right">نویسنده</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">به‌روزرسانی</TableHead>
                  <TableHead className="text-right w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={`sk-${i}`}>
                        <TableCell colSpan={8}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : rows.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-400 py-12">
                        پستی یافت نشد
                      </TableCell>
                    </TableRow>
                  )
                  : rows.map((r) => {
                      const sl = STATUS_LABELS[r.status] ?? { label: r.status, color: "" };
                      const blogPath = r.locale === "en" ? `/blog/${r.slug}` : `/${r.locale}/blog/${r.slug}`;
                      return (
                        <TableRow
                          key={r.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => router.push(`/admin/posts/${r.id}/edit`)}
                        >
                          <TableCell>
                            {r.featuredImagePath ? (
                              <img
                                src={r.featuredImagePath}
                                alt=""
                                className="w-10 h-10 object-cover rounded border"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded bg-gray-100 border" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium max-w-md truncate">
                            <div>{r.title}</div>
                            <div className="text-xs text-gray-400 truncate font-mono" dir="ltr">
                              {blogPath}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono uppercase">
                              {r.locale}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {r.category?.name ?? "—"}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {r.author?.name ?? "—"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={sl.color}>
                              {sl.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-gray-500">
                            {formatDate(r.updatedAt)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/admin/posts/${r.id}/edit`);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </div>

          {meta.lastPage > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-500">
                صفحه {page.toLocaleString("fa-IR")} از {meta.lastPage.toLocaleString("fa-IR")}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="gap-1"
                >
                  <ChevronRight className="h-4 w-4" />
                  قبلی
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.lastPage}
                  onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                  className="gap-1"
                >
                  بعدی
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
