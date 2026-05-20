"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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

interface AuthorRow {
  id: string;
  slug: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  postCount: number;
}

export default function AdminAuthorsPage() {
  const [rows, setRows] = useState<AuthorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AuthorRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AuthorRow | null>(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/authors");
      const json = await res.json();
      setRows(json.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setSlug("");
    setBio("");
    setAvatarUrl("");
    setCreating(true);
  };

  const openEdit = (a: AuthorRow) => {
    setEditing(a);
    setName(a.name);
    setSlug(a.slug);
    setBio(a.bio ?? "");
    setAvatarUrl(a.avatarUrl ?? "");
    setCreating(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("نام الزامی است");
      return;
    }
    setSaving(true);
    try {
      const payload = { name, slug: slug || undefined, bio: bio || null, avatarUrl: avatarUrl || null };
      const url = editing ? `/api/admin/authors/${editing.id}` : "/api/admin/authors";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      toast.success(editing ? "نویسنده به‌روزرسانی شد" : "نویسنده ایجاد شد");
      setCreating(false);
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/authors/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("خطا در حذف");
      toast.success("نویسنده حذف شد");
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
          <h1 className="text-xl font-bold">نویسنده‌ها</h1>
          <p className="text-sm text-gray-500 mt-1">{rows.length.toLocaleString("fa-IR")} نویسنده</p>
        </div>
        <Button onClick={openCreate} className="gap-2" style={{ backgroundColor: "#001E6E" }}>
          <Plus className="h-4 w-4" />
          نویسنده جدید
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right w-12"></TableHead>
                <TableHead className="text-right">نام</TableHead>
                <TableHead className="text-right">slug</TableHead>
                <TableHead className="text-right">پست‌ها</TableHead>
                <TableHead className="text-right w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-12">
                    نویسنده‌ای وجود ندارد
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      {a.avatarUrl ? (
                        <img src={a.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell className="text-sm text-gray-600 font-mono" dir="ltr">
                      {a.slug}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {a.postCount.toLocaleString("fa-IR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => openEdit(a)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteTarget(a)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>{editing ? "ویرایش نویسنده" : "نویسنده جدید"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aut-name">نام</Label>
              <Input id="aut-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aut-slug">slug</Label>
              <Input
                id="aut-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="(خالی = از نام تولید می‌شود)"
                dir="ltr"
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aut-avatar">URL تصویر پروفایل</Label>
              <Input
                id="aut-avatar"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://…"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aut-bio">بیوگرافی</Label>
              <Textarea
                id="aut-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
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

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف نویسنده</DialogTitle>
            <DialogDescription>
              نویسنده «{deleteTarget?.name}» حذف می‌شود. پست‌های وی بدون نویسنده می‌مانند.
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
