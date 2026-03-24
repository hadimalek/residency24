"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
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
import { ArrowRight, Save, Trash2, FileText, Eye, Hash } from "lucide-react";
import { toast } from "sonner";

interface PromptDetail {
  id: string;
  name: string;
  type: string;
  content: string;
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPromptEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [prompt, setPrompt] = useState<PromptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "SYSTEM",
    content: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await fetch(`/api/prompts/${id}`);
        if (!res.ok) throw new Error("خطا در دریافت پرامت");
        const json = await res.json();
        setPrompt(json);
        setFormData({
          name: json.name || "",
          type: json.type || "SYSTEM",
          content: json.content || "",
          isActive: json.isActive ?? true,
        });
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompt();
  }, [id]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("نام پرامت الزامی است");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/prompts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("خطا در ذخیره تغییرات");
      const updated = await res.json();
      setPrompt(updated);
      toast.success("پرامت با موفقیت ذخیره شد");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/prompts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("خطا در حذف پرامت");
      toast.success("پرامت با موفقیت حذف شد");
      router.push("/admin/prompts");
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

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!prompt) {
    return (
      <Card>
        <CardContent className="p-12 text-center text-gray-400">
          پرامت یافت نشد
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
        onClick={() => router.push("/admin/prompts")}
        className="gap-2"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به لیست پرامت‌ها
      </Button>

      {/* Edit form */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              ویرایش پرامت
            </CardTitle>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                نسخه {prompt.version?.toLocaleString("fa-IR") ?? "۱"}
              </span>
              <span>آخرین ویرایش: {formatDate(prompt.updatedAt)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">نام</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="نام پرامت"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">نوع</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, type: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SYSTEM">SYSTEM</SelectItem>
                    <SelectItem value="KNOWLEDGE">KNOWLEDGE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Label htmlFor="active-toggle">وضعیت فعال</Label>
              <Switch
                id="active-toggle"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
              <span className="text-sm text-gray-500">
                {formData.isActive ? "فعال" : "غیرفعال"}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">محتوا</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="gap-2 text-xs"
                >
                  <Eye className="h-3 w-3" />
                  {showPreview ? "ویرایشگر" : "پیش‌نمایش"}
                </Button>
              </div>
              {showPreview ? (
                <div className="border rounded-lg p-4 min-h-[200px] bg-gray-50">
                  <pre
                    className="whitespace-pre-wrap text-sm leading-relaxed font-mono"
                    dir="ltr"
                  >
                    {formData.content || "محتوایی وجود ندارد"}
                  </pre>
                </div>
              ) : (
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="محتوای پرامت را وارد کنید..."
                  rows={12}
                  dir="ltr"
                  className="text-left font-mono text-sm"
                />
              )}
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="gap-2"
                style={{ backgroundColor: "#001E6E" }}
              >
                <Save className="h-4 w-4" />
                {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </Button>

              <Dialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    حذف پرامت
                  </Button>
                </DialogTrigger>
                <DialogContent dir="rtl">
                  <DialogHeader>
                    <DialogTitle>حذف پرامت</DialogTitle>
                    <DialogDescription>
                      آیا مطمئن هستید که می‌خواهید این پرامت را حذف کنید؟
                      این عمل قابل بازگشت نیست.
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
