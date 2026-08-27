"use client";

import { useCallback, useEffect, useState } from "react";
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
import { Plus, Edit, Trash2, Save, Upload, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/context/AdminAuthContext";

const LANGS = [
  { code: "fa", label: "فارسی" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "ru", label: "Русский" },
] as const;

const SOCIAL_FIELDS = [
  { key: "website", label: "وب‌سایت", placeholder: "https://example.com" },
  { key: "linkedin", label: "لینکدین", placeholder: "https://www.linkedin.com/in/…" },
  { key: "instagram", label: "اینستاگرام", placeholder: "https://www.instagram.com/…" },
  { key: "telegram", label: "تلگرام", placeholder: "https://t.me/…" },
  { key: "x", label: "X (توییتر)", placeholder: "https://x.com/…" },
] as const;

type SocialKey = (typeof SOCIAL_FIELDS)[number]["key"];
type Links = Record<SocialKey, string | null>;

interface Translation {
  locale: string;
  name: string;
  title: string | null;
  bio: string | null;
}

interface AuthorRow {
  id: string;
  slug: string;
  userId: number | null;
  user: { id: number; name: string; email: string; role: string } | null;
  isActive: boolean;
  sortOrder: number;
  links: Links;
  avatar: { id: string; filePath: string | null } | null;
  translations: Translation[];
  articleCount: number;
}

interface UserOption {
  id: number;
  name: string;
  email: string;
  role: string;
  hasProfile: boolean;
}

const NO_USER = "__none";
const emptyLinks: Links = { website: "", linkedin: "", instagram: "", telegram: "", x: "" };

/** The name to show in the table: Persian first, else English, else anything. */
function displayName(a: AuthorRow): string {
  return (
    a.translations.find((t) => t.locale === "fa")?.name ??
    a.translations.find((t) => t.locale === "en")?.name ??
    a.translations[0]?.name ??
    a.slug
  );
}

export default function AdminAuthorsPage() {
  const { user: currentUser, loading: authLoading } = useAdminAuth();

  const [rows, setRows] = useState<AuthorRow[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AuthorRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AuthorRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [slug, setSlug] = useState("");
  const [userId, setUserId] = useState<string>(NO_USER);
  const [isActive, setIsActive] = useState(true);
  const [links, setLinks] = useState<Links>({ ...emptyLinks });
  const [avatar, setAvatar] = useState<{ id: string; filePath: string | null } | null>(null);
  const [trans, setTrans] = useState<Record<string, { name: string; title: string; bio: string }>>({});
  const [activeLang, setActiveLang] = useState<string>("fa");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/authors");
      const json = await res.json();
      setRows(json.data ?? []);
      setUsers(json.users ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && currentUser?.role === "ADMIN") load();
  }, [authLoading, currentUser, load]);

  const resetForm = () => {
    setSlug("");
    setUserId(NO_USER);
    setIsActive(true);
    setLinks({ ...emptyLinks });
    setAvatar(null);
    setTrans({});
    setActiveLang("fa");
  };

  const openCreate = () => {
    setEditing(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (a: AuthorRow) => {
    setEditing(a);
    setSlug(a.slug);
    setUserId(a.userId != null ? String(a.userId) : NO_USER);
    setIsActive(a.isActive);
    setLinks({
      website: a.links.website ?? "",
      linkedin: a.links.linkedin ?? "",
      instagram: a.links.instagram ?? "",
      telegram: a.links.telegram ?? "",
      x: a.links.x ?? "",
    });
    setAvatar(a.avatar);
    const t: Record<string, { name: string; title: string; bio: string }> = {};
    for (const tr of a.translations) {
      t[tr.locale] = { name: tr.name, title: tr.title ?? "", bio: tr.bio ?? "" };
    }
    setTrans(t);
    setActiveLang(a.translations[0]?.locale ?? "fa");
    setDialogOpen(true);
  };

  const setField = (locale: string, field: "name" | "title" | "bio", value: string) => {
    setTrans((prev) => ({
      ...prev,
      [locale]: {
        name: prev[locale]?.name ?? "",
        title: prev[locale]?.title ?? "",
        bio: prev[locale]?.bio ?? "",
        [field]: value,
      },
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setAvatar({ id: data.id, filePath: data.url });
      toast.success("تصویر آپلود شد");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "آپلود ناموفق بود");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    const translations = Object.entries(trans)
      .map(([locale, v]) => ({ locale, name: v.name.trim(), title: v.title, bio: v.bio }))
      .filter((t) => t.name);

    if (translations.length === 0) {
      toast.error("حداقل نام نویسنده در یک زبان الزامی است");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        userId: userId === NO_USER ? null : Number(userId),
        isActive,
        links,
        avatarId: avatar?.id ?? null,
        translations,
      };
      // slug is only settable on create — it is a live indexed URL afterwards.
      if (!editing) payload.slug = slug.trim() || undefined;

      const res = await fetch(
        editing ? `/api/admin/authors/${editing.id}` : "/api/admin/authors",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || `HTTP ${res.status}`);
      }
      toast.success(editing ? "پروفایل به‌روزرسانی شد" : "نویسنده ایجاد شد");
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/authors/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "خطا در حذف");
      }
      toast.success("پروفایل حذف شد");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در حذف");
    }
  };

  if (authLoading || currentUser?.role !== "ADMIN") {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">نویسندگان</h1>
          <p className="text-sm text-gray-500 mt-1">
            {rows.length.toLocaleString("fa-IR")} پروفایل — نام، بیو و شبکه‌های اجتماعی که در
            صفحه نویسنده و زیر هر مقاله نمایش داده می‌شود
          </p>
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
                <TableHead className="text-right">نویسنده</TableHead>
                <TableHead className="text-right">slug</TableHead>
                <TableHead className="text-right">حساب کاربری</TableHead>
                <TableHead className="text-right">زبان‌ها</TableHead>
                <TableHead className="text-right">مقالات</TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
                <TableHead className="text-right w-28"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    <TableCell colSpan={7}>
                      <Skeleton className="h-9 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-400 py-12">
                    هنوز نویسنده‌ای ثبت نشده است
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {a.avatar?.filePath ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={a.avatar.filePath}
                            alt={displayName(a)}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <span className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                            {displayName(a).charAt(0)}
                          </span>
                        )}
                        {displayName(a)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 font-mono" dir="ltr">
                      <a
                        href={`/fa/blog/author/${a.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-navy"
                      >
                        {a.slug}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-sm">
                      {a.user ? (
                        <span className="text-gray-700">{a.user.name}</span>
                      ) : (
                        <span className="text-amber-600 text-xs">متصل نیست</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 font-mono uppercase" dir="ltr">
                      {a.translations.map((t) => t.locale).join(" · ")}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {a.articleCount.toLocaleString("fa-IR")}
                    </TableCell>
                    <TableCell>
                      {a.isActive ? (
                        <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                          فعال
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          مخفی
                        </Badge>
                      )}
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

      {/* Create / edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl" className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "ویرایش نویسنده" : "نویسنده جدید"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Avatar */}
            <div className="space-y-2">
              <Label>تصویر نویسنده</Label>
              <div className="flex items-center gap-4">
                {avatar?.filePath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatar.filePath}
                    alt=""
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-100 border flex items-center justify-center text-gray-400 text-xs">
                    بدون تصویر
                  </div>
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                  <span className="inline-flex items-center gap-2 text-sm border rounded-lg px-3 py-2 hover:bg-gray-50">
                    <Upload className="h-4 w-4" />
                    {uploading ? "در حال آپلود…" : "انتخاب تصویر"}
                  </span>
                </label>
                {avatar && (
                  <Button variant="ghost" size="sm" onClick={() => setAvatar(null)}>
                    حذف
                  </Button>
                )}
              </div>
            </div>

            {/* slug + user binding */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="a-slug">slug</Label>
                <Input
                  id="a-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="(خالی = از نام انگلیسی ساخته می‌شود)"
                  dir="ltr"
                  className="font-mono text-sm"
                  disabled={!!editing}
                />
                {editing && (
                  <p className="text-[11px] text-gray-500">
                    آدرس صفحه‌ی نویسنده روی این slug ساخته شده و قابل تغییر نیست.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="a-user">حساب کاربری</Label>
                <Select value={userId} onValueChange={setUserId}>
                  <SelectTrigger id="a-user">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_USER}>متصل نیست</SelectItem>
                    {users
                      .filter((u) => !u.hasProfile || String(u.id) === userId)
                      .map((u) => (
                        <SelectItem key={u.id} value={String(u.id)}>
                          {u.name} — {u.role}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-gray-500">
                  اتصال به حساب پنل. هر حساب فقط یک پروفایل نویسنده دارد.
                </p>
              </div>
            </div>

            {/* Per-language name / title / bio */}
            <div className="space-y-2">
              <Label>نام و معرفی (به تفکیک زبان)</Label>
              <div className="flex gap-1 flex-wrap">
                {LANGS.map((l) => {
                  const filled = Boolean(trans[l.code]?.name?.trim());
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setActiveLang(l.code)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        activeLang === l.code
                          ? "bg-navy text-white border-navy"
                          : "hover:bg-gray-50"
                      }`}
                      style={activeLang === l.code ? { backgroundColor: "#001E6E" } : undefined}
                    >
                      {l.label}
                      {filled && <span className="ms-1 text-emerald-500">•</span>}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-3 border rounded-lg p-3">
                <div className="space-y-1.5">
                  <Label htmlFor="a-name" className="text-xs">
                    نام
                  </Label>
                  <Input
                    id="a-name"
                    value={trans[activeLang]?.name ?? ""}
                    onChange={(e) => setField(activeLang, "name", e.target.value)}
                    dir={activeLang === "fa" || activeLang === "ar" ? "rtl" : "ltr"}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="a-title" className="text-xs">
                    سمت / تخصص
                  </Label>
                  <Input
                    id="a-title"
                    value={trans[activeLang]?.title ?? ""}
                    onChange={(e) => setField(activeLang, "title", e.target.value)}
                    dir={activeLang === "fa" || activeLang === "ar" ? "rtl" : "ltr"}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="a-bio" className="text-xs">
                    توضیحات
                  </Label>
                  <Textarea
                    id="a-bio"
                    rows={4}
                    value={trans[activeLang]?.bio ?? ""}
                    onChange={(e) => setField(activeLang, "bio", e.target.value)}
                    dir={activeLang === "fa" || activeLang === "ar" ? "rtl" : "ltr"}
                  />
                </div>
                <p className="text-[11px] text-gray-500">
                  زبانی که نام نداشته باشد ذخیره نمی‌شود؛ اگر خواننده‌ای به آن زبان بیاید،
                  نزدیک‌ترین زبان موجود نمایش داده می‌شود.
                </p>
              </div>
            </div>

            {/* Socials */}
            <div className="space-y-3">
              <Label>شبکه‌های اجتماعی</Label>
              {SOCIAL_FIELDS.map((f) => (
                <div key={f.key} className="grid grid-cols-[7rem_1fr] items-center gap-3">
                  <span className="text-xs text-gray-600">{f.label}</span>
                  <Input
                    value={links[f.key] ?? ""}
                    onChange={(e) => setLinks((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    dir="ltr"
                    className="text-sm"
                  />
                </div>
              ))}
            </div>

            {/* Visibility */}
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              پروفایل فعال باشد (اگر خاموش شود، صفحه‌ی نویسنده و نام او زیر مقالات نمایش
              داده نمی‌شود)
            </label>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              انصراف
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
              style={{ backgroundColor: "#001E6E" }}
            >
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
            <DialogTitle>حذف پروفایل نویسنده</DialogTitle>
            <DialogDescription>
              پروفایل «{deleteTarget ? displayName(deleteTarget) : ""}» حذف می‌شود. اگر مقاله‌ای
              به این نویسنده وصل باشد، حذف انجام نمی‌شود — اول نویسنده‌ی مقالات را عوض کنید یا
              پروفایل را مخفی کنید.
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
