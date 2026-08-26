"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface CategoryRow {
  /** null = the category exists because articles use its slug, but it has no
   *  BlogCategory row yet, so its name is still the prettified latin slug. */
  id: string | null;
  locale: string;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
  postCount: number;
  /** false for slugs the site deliberately does not link or index. */
  hub: boolean;
  /** true once a localised name has been saved for it. */
  named: boolean;
}

const LANGS = [
  { code: "fa", label: "فارسی" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "ar", label: "العربية" },
];

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [locale, setLocale] = useState("fa");
  const [description, setDescription] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const json = await res.json();
      setRows(json.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Derived categories still showing a prettified latin slug instead of a real
  // localised name — the thing an editor actually needs to act on.
  const unnamed = rows.filter((r) => !r.named).length;

  const openCreate = () => {
    setEditing(null);
    setName("");
    setSlug("");
    setLocale("fa");
    setDescription("");
    setCreating(true);
  };

  const openEdit = (cat: CategoryRow) => {
    setEditing(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setLocale(cat.locale);
    setDescription(cat.description ?? "");
    setCreating(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("نام الزامی است");
      return;
    }
    setSaving(true);
    try {
      // A row with no id has no BlogCategory record yet — saving it creates one
      // for the slug the articles already use, which is how a derived category
      // gets its localised name. Only an existing record is PATCHed, and its
      // slug is never sent: articles join on that string.
      const isOverlay = Boolean(editing?.id);
      const payload = isOverlay
        ? { name, description: description || null }
        : { name, slug: slug || undefined, locale, description: description || null };
      const url = isOverlay ? `/api/admin/categories/${editing!.id}` : "/api/admin/categories";
      const method = isOverlay ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      toast.success(isOverlay ? "دسته‌بندی به‌روزرسانی شد" : "نام دسته‌بندی ذخیره شد");
      setCreating(false);
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("خطا در حذف");
      toast.success("دسته‌بندی حذف شد");
      setDeleteTarget(null);
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">دسته‌بندی‌ها</h1>
          <p className="text-sm text-gray-500 mt-1">
            {rows.length.toLocaleString("fa-IR")} دسته
            {unnamed > 0 && ` — ${unnamed.toLocaleString("fa-IR")} مورد هنوز نام بومی ندارد`}
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2" style={{ backgroundColor: "#001E6E" }}>
          <Plus className="h-4 w-4" />
          دسته جدید
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">نام</TableHead>
                <TableHead className="text-right">slug</TableHead>
                <TableHead className="text-right">زبان</TableHead>
                <TableHead className="text-right">پست‌ها</TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
                <TableHead className="text-right w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-12">
                    دسته‌بندی‌ای وجود ندارد
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((c) => (
                  <TableRow key={`${c.locale}/${c.slug}`}>
                    <TableCell className="font-medium">
                      {c.name}
                      {!c.named && (
                        <span className="ms-2 text-[11px] text-amber-600">(نام خودکار)</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 font-mono" dir="ltr">
                      {c.slug}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono uppercase">
                        {c.locale}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {c.postCount.toLocaleString("fa-IR")}
                    </TableCell>
                    <TableCell>
                      {c.hub ? (
                        <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                          فعال
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          نمایش داده نمی‌شود
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => openEdit(c)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {c.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteTarget(c)}
                            title="حذف نام بومی (دسته خودش باقی می‌ماند)"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit dialog */}
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>{editing ? "ویرایش دسته" : "دسته جدید"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">نام</Label>
              <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-slug">slug</Label>
              <Input
                id="cat-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="(خالی = از نام تولید می‌شود)"
                dir="ltr"
                className="font-mono text-sm"
                disabled={!!editing}
              />
              {editing && (
                <p className="text-[11px] text-gray-500">
                  slug قابل تغییر نیست — مقالات با همین رشته به دسته وصل‌اند و آدرس
                  /blog/category/{slug} روی آن ساخته شده است.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-locale">زبان</Label>
              <Select value={locale} onValueChange={setLocale} disabled={!!editing}>
                <SelectTrigger id="cat-locale">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGS.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-desc">توضیحات</Label>
              <Textarea
                id="cat-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCreating(false)}>
              انصراف
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2" style={{ backgroundColor: "#001E6E" }}>
              <Save className="h-4 w-4" />
              {saving ? "در حال ذخیره…" : "ذخیره"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف نام بومی</DialogTitle>
            <DialogDescription>
              نام بومی «{deleteTarget?.name}» حذف می‌شود و دسته به نام خودکار برمی‌گردد.
              خود دسته و پست‌هایش دست‌نخورده می‌مانند — تا وقتی مقاله‌ای با این slug
              وجود دارد، دسته هم وجود دارد.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              انصراف
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              بله، حذف شود
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
