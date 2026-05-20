"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  UserCog,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  Feather,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAdminAuth } from "@/context/AdminAuthContext";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface FormState {
  name: string;
  email: string;
  password: string;
  role: string;
}

const emptyForm: FormState = { name: "", email: "", password: "", role: "EDITOR" };

export default function AuthorsPage() {
  const router = useRouter();
  const { user: currentUser, loading: authLoading } = useAdminAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading && currentUser && currentUser.role !== "ADMIN") {
      router.replace("/admin");
    }
  }, [authLoading, currentUser, router]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(data.users);
    } catch {
      toast.error("خطا در دریافت لیست کاربران");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && currentUser?.role === "ADMIN") {
      fetchUsers();
    }
  }, [authLoading, currentUser, fetchUsers]);

  const openCreate = () => {
    setForm(emptyForm);
    setShowPassword(false);
    setCreateOpen(true);
  };

  const openEdit = (u: User) => {
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
    setShowPassword(false);
    setEditUser(u);
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("نام، ایمیل و رمز عبور الزامی است");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("کاربر با موفقیت ایجاد شد");
      setCreateOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "خطا در ایجاد کاربر");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editUser) return;
    const payload: Record<string, string> = {};
    if (form.name.trim()) payload.name = form.name.trim();
    if (form.email.trim()) payload.email = form.email.trim();
    if (form.password.trim()) payload.password = form.password.trim();
    if (form.role) payload.role = form.role;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("اطلاعات کاربر بروزرسانی شد");
      setEditUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "خطا در بروزرسانی");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("کاربر حذف شد");
      setDeleteUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "خطا در حذف کاربر");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || (!authLoading && currentUser?.role !== "ADMIN")) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="h-8 w-8 border-4 border-[#001E6E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,30,110,0.08)" }}
          >
            <UserCog className="h-5 w-5" style={{ color: "#001E6E" }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">مدیریت نویسنده‌ها</h1>
            <p className="text-sm text-gray-500">
              افزودن و مدیریت کاربران و سطح دسترسی آن‌ها
            </p>
          </div>
        </div>
        <Button
          onClick={openCreate}
          className="gap-2 font-semibold"
          style={{ backgroundColor: "#001E6E", color: "#DCC896" }}
        >
          <Plus className="h-4 w-4" />
          نویسنده جدید
        </Button>
      </div>

      {/* Users table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800">
            لیست کاربران ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              هیچ کاربری یافت نشد
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-right font-semibold text-gray-700">نام</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">ایمیل</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">نقش</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">تاریخ ثبت</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className="hover:bg-gray-50/70">
                    <TableCell className="font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: u.role === "ADMIN" ? "#001E6E" : "#6B7280" }}
                        >
                          {u.name.charAt(0)}
                        </div>
                        <span>{u.name}</span>
                        {u.id === currentUser?.id && (
                          <Badge variant="outline" className="text-xs py-0">
                            شما
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 font-mono text-sm" dir="ltr">
                      {u.email}
                    </TableCell>
                    <TableCell>
                      {u.role === "ADMIN" ? (
                        <Badge
                          className="gap-1.5 font-medium"
                          style={{ backgroundColor: "rgba(0,30,110,0.1)", color: "#001E6E" }}
                        >
                          <ShieldCheck className="h-3 w-3" />
                          مدیر ارشد
                        </Badge>
                      ) : (
                        <Badge
                          className="gap-1.5 font-medium"
                          style={{ backgroundColor: "rgba(107,114,128,0.1)", color: "#4B5563" }}
                        >
                          <Feather className="h-3 w-3" />
                          نویسنده
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {formatDate(u.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => openEdit(u)}
                          title="ویرایش"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                          onClick={() => setDeleteUser(u)}
                          disabled={u.id === currentUser?.id}
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right flex items-center gap-2">
              <Plus className="h-5 w-5" style={{ color: "#001E6E" }} />
              افزودن نویسنده جدید
            </DialogTitle>
          </DialogHeader>
          <UserForm
            form={form}
            setForm={setForm}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            passwordRequired
          />
          <DialogFooter className="flex-row-reverse gap-2 pt-2">
            <Button
              onClick={handleCreate}
              disabled={saving}
              className="gap-2 font-semibold"
              style={{ backgroundColor: "#001E6E", color: "#DCC896" }}
            >
              {saving ? (
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              ذخیره
            </Button>
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={saving}>
              <X className="h-4 w-4 ml-1" />
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right flex items-center gap-2">
              <Pencil className="h-5 w-5" style={{ color: "#001E6E" }} />
              ویرایش کاربر: {editUser?.name}
            </DialogTitle>
          </DialogHeader>
          <UserForm
            form={form}
            setForm={setForm}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            passwordRequired={false}
          />
          <DialogFooter className="flex-row-reverse gap-2 pt-2">
            <Button
              onClick={handleEdit}
              disabled={saving}
              className="gap-2 font-semibold"
              style={{ backgroundColor: "#001E6E", color: "#DCC896" }}
            >
              {saving ? (
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              ذخیره تغییرات
            </Button>
            <Button variant="outline" onClick={() => setEditUser(null)} disabled={saving}>
              <X className="h-4 w-4 ml-1" />
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteUser} onOpenChange={(o) => !o && setDeleteUser(null)}>
        <DialogContent className="max-w-sm" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              حذف کاربر
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 text-right">
            آیا از حذف کاربر <strong>{deleteUser?.name}</strong> اطمینان دارید؟
            این عمل قابل بازگشت نیست.
          </p>
          <DialogFooter className="flex-row-reverse gap-2 pt-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
              className="gap-2"
            >
              {saving ? (
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              حذف
            </Button>
            <Button variant="outline" onClick={() => setDeleteUser(null)} disabled={saving}>
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Reusable form component ────────────────────────────────────────────────
function UserForm({
  form,
  setForm,
  showPassword,
  setShowPassword,
  passwordRequired,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  passwordRequired: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">نام و نام خانوادگی</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="مثلاً علی احمدی"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">ایمیل</Label>
        <Input
          id="email"
          type="email"
          dir="ltr"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="example@residency24.com"
          className="text-left"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">
          رمز عبور{" "}
          {!passwordRequired && (
            <span className="text-xs text-gray-400 font-normal">
              (خالی بگذارید تا تغییر نکند)
            </span>
          )}
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            dir="ltr"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder={passwordRequired ? "حداقل ۸ کاراکتر" : "رمز عبور جدید"}
            className="text-left pl-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="role">سطح دسترسی</Label>
        <Select
          value={form.role}
          onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}
        >
          <SelectTrigger id="role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EDITOR">
              <div className="flex items-center gap-2">
                <Feather className="h-4 w-4 text-gray-500" />
                نویسنده — فقط انتشار محتوا
              </div>
            </SelectItem>
            <SelectItem value="ADMIN">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#001E6E]" />
                مدیر ارشد — دسترسی کامل
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-400">
          {form.role === "EDITOR"
            ? "نویسنده فقط می‌تواند محتوا منتشر کند و به بخش‌های مدیریتی دسترسی ندارد."
            : "مدیر ارشد به تمام بخش‌های پنل دسترسی کامل دارد."}
        </p>
      </div>
    </div>
  );
}
