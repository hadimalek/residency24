"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight, Save, Trash2, FileText, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const TiptapEditor = dynamic(() => import("@/components/admin/TiptapEditor"), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg p-4 min-h-[400px] bg-gray-50 text-sm text-gray-500">
      در حال بارگذاری ادیتور…
    </div>
  ),
});

const LANGS = [
  { code: "fa", label: "فارسی" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "ar", label: "العربية" },
];

const STATUSES = [
  { code: "DRAFT", label: "پیش‌نویس" },
  { code: "PUBLISHED", label: "منتشر شده" },
  { code: "ARCHIVED", label: "بایگانی" },
];

interface MediaRow {
  id: string;
  filePath: string;
  fileName: string;
  mimeType: string;
}

export interface PostFormInitial {
  id?: string;
  slug?: string;
  status?: string;
  primaryLocale?: string | null;
  featuredImage?: MediaRow | null;
  translations?: Array<{
    locale: string;
    title: string;
    excerpt: string | null;
    content: string;
    contentJson: any | null;
    metaTitle: string | null;
    metaDescription: string | null;
  }>;
}

export interface PostFormProps {
  mode: "new" | "edit";
  initial?: PostFormInitial;
}

export default function PostForm({ mode, initial }: PostFormProps) {
  const router = useRouter();

  const initialLang = initial?.primaryLocale ?? "fa";
  const initialTrans = initial?.translations?.find((t) => t.locale === initialLang) ??
    initial?.translations?.[0];

  const [lang, setLang] = useState<string>(initialLang);
  const [title, setTitle] = useState<string>(initialTrans?.title ?? "");
  const [slug, setSlug] = useState<string>(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState<boolean>(!!initial?.slug);
  const [status, setStatus] = useState<string>(initial?.status ?? "DRAFT");
  const [featuredImage, setFeaturedImage] = useState<MediaRow | null>(initial?.featuredImage ?? null);
  const [excerpt, setExcerpt] = useState<string>(initialTrans?.excerpt ?? "");
  const [contentJson, setContentJson] = useState<any | null>(initialTrans?.contentJson ?? null);
  const [metaTitle, setMetaTitle] = useState<string>(initialTrans?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState<string>(initialTrans?.metaDescription ?? "");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);

  // Auto-fill slug from title until user manually edits it.
  useEffect(() => {
    if (!slugTouched && title) {
      const auto = title
        .toLowerCase()
        .normalize("NFKC")
        .replace(/[\s_]+/g, "-")
        .replace(/[!-,./:-@[-`{-~]+/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 200);
      setSlug(auto);
    }
  }, [title, slugTouched]);

  const dir = lang === "en" || lang === "ru" ? "ltr" : "rtl";

  const handleFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadingFeatured(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setFeaturedImage({
        id: data.id,
        filePath: data.url,
        fileName: data.fileName,
        mimeType: data.mimeType,
      });
      toast.success("تصویر شاخص آپلود شد");
    } catch (err: any) {
      toast.error(err.message || "آپلود ناموفق بود");
    } finally {
      setUploadingFeatured(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("عنوان الزامی است");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        lang,
        title,
        slug: slug || undefined,
        status,
        featuredImageId: featuredImage?.id ?? null,
        excerpt: excerpt || null,
        contentJson,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      };

      const url = mode === "new" ? "/api/admin/posts" : `/api/admin/posts/${initial?.id}`;
      const method = mode === "new" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      toast.success(mode === "new" ? "پست ایجاد شد" : "پست ذخیره شد");

      if (mode === "new" && data.id) {
        router.push(`/admin/posts/${data.id}/edit`);
      }
    } catch (err: any) {
      toast.error(err.message || "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initial?.id) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/posts/${initial.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("خطا در حذف");
      toast.success("پست حذف شد");
      router.push("/admin/posts");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/admin/posts")}
        className="gap-2"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به لیست پست‌ها
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {mode === "new" ? "ایجاد پست جدید" : "ویرایش پست"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان پست"
                dir={dir}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">slug (در URL)</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
                placeholder="my-post-slug"
                dir="ltr"
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">خلاصه (excerpt)</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="یک خلاصه کوتاه برای کارت پست و SEO"
                dir={dir}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>محتوا</Label>
              <TiptapEditor
                value={contentJson}
                onChange={setContentJson}
                dir={dir as "ltr" | "rtl"}
              />
            </div>
            <Separator />
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-gray-500">SEO</Label>
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta title</Label>
                <Input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="(پیش‌فرض: عنوان پست)"
                  dir={dir}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-desc">Meta description</Label>
                <Textarea
                  id="meta-desc"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="(پیش‌فرض: خلاصه پست)"
                  dir={dir}
                  rows={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar column */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">انتشار</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lang">زبان</Label>
                <Select value={lang} onValueChange={setLang}>
                  <SelectTrigger id="lang">
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
                <Label htmlFor="status">وضعیت</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.code} value={s.code}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full gap-2"
                style={{ backgroundColor: "#001E6E" }}
              >
                <Save className="h-4 w-4" />
                {saving ? "در حال ذخیره…" : mode === "new" ? "ایجاد پست" : "ذخیره تغییرات"}
              </Button>
              {mode === "edit" && (
                <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full gap-2">
                      <Trash2 className="h-4 w-4" />
                      حذف پست
                    </Button>
                  </DialogTrigger>
                  <DialogContent dir="rtl">
                    <DialogHeader>
                      <DialogTitle>حذف پست</DialogTitle>
                      <DialogDescription>
                        آیا مطمئن هستید این پست حذف شود؟ این عمل قابل بازگشت نیست.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                        انصراف
                      </Button>
                      <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                        {deleting ? "در حال حذف…" : "بله، حذف شود"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                تصویر شاخص
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {featuredImage ? (
                <div className="space-y-2">
                  <img
                    src={featuredImage.filePath}
                    alt=""
                    className="w-full h-32 object-cover rounded border"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setFeaturedImage(null)}
                  >
                    حذف تصویر
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded cursor-pointer text-gray-500 hover:bg-gray-50">
                  <Upload className="h-5 w-5 mb-1" />
                  <span className="text-xs">{uploadingFeatured ? "در حال آپلود…" : "آپلود تصویر"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFeaturedUpload}
                  />
                </label>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
