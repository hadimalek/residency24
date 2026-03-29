"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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
import { ArrowRight, Save, Trash2, User, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface LeadDetail {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  status: string;
  sessionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminLeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    status: "NEW",
  });

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await fetch(`/api/leads/${id}`);
        if (!res.ok) throw new Error("خطا در دریافت جزئیات لید");
        const json = await res.json();
        setLead(json);
        setFormData({
          name: json.name || "",
          email: json.email || "",
          phone: json.phone || "",
          nationality: json.nationality || "",
          status: json.status || "NEW",
        });
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("خطا در ذخیره تغییرات");
      const updated = await res.json();
      setLead(updated);
      toast.success("تغییرات با موفقیت ذخیره شد");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("خطا در حذف لید");
      toast.success("لید با موفقیت حذف شد");
      router.push("/admin/leads");
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
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lead) {
    return (
      <Card>
        <CardContent className="p-12 text-center text-gray-400">
          لید یافت نشد
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
        onClick={() => router.push("/admin/leads")}
        className="gap-2"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به لیست لیدها
      </Button>

      {/* Lead info form */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <User className="h-5 w-5" />
              ویرایش لید
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>ایجاد: {formatDate(lead.createdAt)}</span>
              <span>|</span>
              <span>آخرین ویرایش: {formatDate(lead.updatedAt)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">نام</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="نام لید"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="email@example.com"
                dir="ltr"
                className="text-left"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">تلفن</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="+98..."
                dir="ltr"
                className="text-left"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">ملیت</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    nationality: e.target.value,
                  }))
                }
                placeholder="ملیت"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">وضعیت</Label>
              <Select
                value={formData.status}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, status: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">جدید</SelectItem>
                  <SelectItem value="FOLLOWING">پیگیری</SelectItem>
                  <SelectItem value="CONVERTED">تبدیل شده</SelectItem>
                  <SelectItem value="ARCHIVED">آرشیو</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Related session */}
          {lead.sessionId && (
            <div className="mt-6 flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">سشن مرتبط:</span>
              <Link
                href={`/admin/sessions/${lead.sessionId}`}
                className="text-sm text-blue-600 hover:underline"
              >
                مشاهده سشن
              </Link>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between flex-wrap gap-3">
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
                  حذف لید
                </Button>
              </DialogTrigger>
              <DialogContent dir="rtl">
                <DialogHeader>
                  <DialogTitle>حذف لید</DialogTitle>
                  <DialogDescription>
                    آیا مطمئن هستید که می‌خواهید این لید را حذف کنید؟ این عمل
                    قابل بازگشت نیست.
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
        </CardContent>
      </Card>
    </div>
  );
}
