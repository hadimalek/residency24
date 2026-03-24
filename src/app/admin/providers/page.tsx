"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Cpu,
  Plus,
  Edit,
  Trash2,
  Zap,
  Star,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Provider {
  id: string;
  name: string;
  model: string;
  apiKey: string;
  baseUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    model: "",
    apiKey: "",
    baseUrl: "",
  });

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/providers");
      if (!res.ok) throw new Error("خطا در دریافت تامین‌کننده‌ها");
      const json = await res.json();
      setProviders(Array.isArray(json) ? json : json.providers || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", model: "", apiKey: "", baseUrl: "" });
  };

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.model.trim() || !formData.apiKey.trim()) {
      toast.error("نام، مدل و کلید API الزامی است");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("خطا در ایجاد تامین‌کننده");
      toast.success("تامین‌کننده با موفقیت ایجاد شد");
      setAddDialogOpen(false);
      resetForm();
      fetchProviders();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (provider: Provider) => {
    setSelectedProvider(provider);
    setFormData({
      name: provider.name,
      model: provider.model,
      apiKey: provider.apiKey,
      baseUrl: provider.baseUrl || "",
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedProvider) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/providers/${selectedProvider.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("خطا در بروزرسانی تامین‌کننده");
      toast.success("تامین‌کننده با موفقیت بروزرسانی شد");
      setEditDialogOpen(false);
      resetForm();
      setSelectedProvider(null);
      fetchProviders();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProvider) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/providers/${selectedProvider.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("خطا در حذف تامین‌کننده");
      toast.success("تامین‌کننده با موفقیت حذف شد");
      setDeleteDialogOpen(false);
      setSelectedProvider(null);
      fetchProviders();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleTest = async (provider: Provider) => {
    setTestingId(provider.id);
    try {
      const res = await fetch("/api/providers/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: provider.id }),
      });
      if (!res.ok) throw new Error("اتصال ناموفق بود");
      toast.success("اتصال با موفقیت برقرار شد");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setTestingId(null);
    }
  };

  const handleSetActive = async (provider: Provider) => {
    try {
      const res = await fetch(`/api/providers/${provider.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      });
      if (!res.ok) throw new Error("خطا در فعال‌سازی");
      toast.success("تامین‌کننده فعال شد");
      fetchProviders();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-gray-500">
          مجموع: {providers.length.toLocaleString("fa-IR")} تامین‌کننده
        </h3>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2"
              style={{ backgroundColor: "#001E6E" }}
              onClick={() => {
                resetForm();
                setAddDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              افزودن تامین‌کننده جدید
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>تامین‌کننده جدید</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">نام</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="مثلاً OpenAI"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-model">مدل</Label>
                <Input
                  id="add-model"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, model: e.target.value }))
                  }
                  placeholder="مثلاً gpt-4o"
                  dir="ltr"
                  className="text-left"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-apiKey">کلید API</Label>
                <Input
                  id="add-apiKey"
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, apiKey: e.target.value }))
                  }
                  placeholder="sk-..."
                  dir="ltr"
                  className="text-left"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-baseUrl">آدرس پایه (اختیاری)</Label>
                <Input
                  id="add-baseUrl"
                  value={formData.baseUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      baseUrl: e.target.value,
                    }))
                  }
                  placeholder="https://api.openai.com/v1"
                  dir="ltr"
                  className="text-left"
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
              >
                انصراف
              </Button>
              <Button
                onClick={handleCreate}
                disabled={creating}
                style={{ backgroundColor: "#001E6E" }}
              >
                {creating ? "در حال ایجاد..." : "ایجاد"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Providers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.length ? (
          providers.map((provider) => (
            <Card
              key={provider.id}
              className={cn(
                "shadow-sm transition-all",
                provider.isActive
                  ? "border-2"
                  : "border border-gray-200"
              )}
              style={
                provider.isActive
                  ? { borderColor: "#DCC896" }
                  : undefined
              }
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    {provider.name}
                  </CardTitle>
                  {provider.isActive && (
                    <Badge
                      variant="secondary"
                      className="gap-1"
                      style={{
                        backgroundColor: "rgba(220, 200, 150, 0.2)",
                        color: "#8B7730",
                      }}
                    >
                      <Star className="h-3 w-3" />
                      فعال
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">مدل:</span>
                  <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                    {provider.model}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">وضعیت:</span>
                  {provider.isActive ? (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      فعال
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      غیرفعال
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs"
                    onClick={() => handleEdit(provider)}
                  >
                    <Edit className="h-3 w-3" />
                    ویرایش
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs"
                    onClick={() => handleTest(provider)}
                    disabled={testingId === provider.id}
                  >
                    {testingId === provider.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Zap className="h-3 w-3" />
                    )}
                    تست اتصال
                  </Button>
                  {!provider.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-xs"
                      onClick={() => handleSetActive(provider)}
                    >
                      <Star className="h-3 w-3" />
                      فعال‌سازی
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      setSelectedProvider(provider);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-400">
            <Cpu className="h-8 w-8 mx-auto mb-2 opacity-30" />
            تامین‌کننده‌ای وجود ندارد
          </div>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent dir="rtl" className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>ویرایش تامین‌کننده</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">نام</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-model">مدل</Label>
              <Input
                id="edit-model"
                value={formData.model}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, model: e.target.value }))
                }
                dir="ltr"
                className="text-left"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-apiKey">کلید API</Label>
              <Input
                id="edit-apiKey"
                type="password"
                value={formData.apiKey}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, apiKey: e.target.value }))
                }
                dir="ltr"
                className="text-left"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-baseUrl">آدرس پایه (اختیاری)</Label>
              <Input
                id="edit-baseUrl"
                value={formData.baseUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    baseUrl: e.target.value,
                  }))
                }
                dir="ltr"
                className="text-left"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              انصراف
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updating}
              style={{ backgroundColor: "#001E6E" }}
            >
              {updating ? "در حال بروزرسانی..." : "بروزرسانی"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف تامین‌کننده</DialogTitle>
            <DialogDescription>
              آیا مطمئن هستید که می‌خواهید تامین‌کننده &quot;{selectedProvider?.name}&quot; را حذف کنید؟
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
  );
}
