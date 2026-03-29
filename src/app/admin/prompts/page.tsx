"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Plus, Hash, Eye } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Prompt {
  id: string;
  name: string;
  type: string;
  content: string;
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPromptsPage() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newPrompt, setNewPrompt] = useState({
    name: "",
    type: "SYSTEM",
    content: "",
  });

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/prompts");
      if (!res.ok) throw new Error("خطا در دریافت پرامت‌ها");
      const json = await res.json();
      setPrompts(Array.isArray(json) ? json : json.prompts || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleCreate = async () => {
    if (!newPrompt.name.trim()) {
      toast.error("نام پرامت الزامی است");
      return;
    }
    if (!newPrompt.content.trim()) {
      toast.error("محتوای پرامت الزامی است");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrompt),
      });
      if (!res.ok) throw new Error("خطا در ایجاد پرامت");
      toast.success("پرامت با موفقیت ایجاد شد");
      setDialogOpen(false);
      setNewPrompt({ name: "", type: "SYSTEM", content: "" });
      fetchPrompts();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (prompt: Prompt) => {
    try {
      const res = await fetch(`/api/prompts/${prompt.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !prompt.isActive }),
      });
      if (!res.ok) throw new Error("خطا در تغییر وضعیت");
      toast.success(
        prompt.isActive ? "پرامت غیرفعال شد" : "پرامت فعال شد"
      );
      fetchPrompts();
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
                <Skeleton className="h-4 w-full" />
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
          مجموع: {prompts.length.toLocaleString("fa-IR")} پرامت
        </h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" style={{ backgroundColor: "#001E6E" }}>
              <Plus className="h-4 w-4" />
              افزودن پرامت جدید
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>پرامت جدید</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">نام</Label>
                <Input
                  id="new-name"
                  value={newPrompt.name}
                  onChange={(e) =>
                    setNewPrompt((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="نام پرامت"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-type">نوع</Label>
                <Select
                  value={newPrompt.type}
                  onValueChange={(v) =>
                    setNewPrompt((prev) => ({ ...prev, type: v }))
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
              <div className="space-y-2">
                <Label htmlFor="new-content">محتوا</Label>
                <Textarea
                  id="new-content"
                  value={newPrompt.content}
                  onChange={(e) =>
                    setNewPrompt((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="محتوای پرامت را وارد کنید..."
                  rows={8}
                  dir="ltr"
                  className="text-left font-mono text-sm"
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
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

      {/* Prompts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prompts.length ? (
          prompts.map((prompt) => (
            <Card
              key={prompt.id}
              className={cn(
                "border shadow-sm cursor-pointer hover:shadow-md transition-shadow",
                prompt.isActive ? "border-green-200" : "border-gray-200"
              )}
              onClick={() => router.push(`/admin/prompts/${prompt.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">
                    {prompt.name}
                  </CardTitle>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Switch
                      checked={prompt.isActive}
                      onCheckedChange={() => handleToggleActive(prompt)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    variant="secondary"
                    className={
                      prompt.type === "SYSTEM"
                        ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                    }
                  >
                    {prompt.type}
                  </Badge>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    نسخه {prompt.version?.toLocaleString("fa-IR") ?? "۱"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed" dir="ltr">
                  {prompt.content}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-400">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
            پرامتی وجود ندارد
          </div>
        )}
      </div>
    </div>
  );
}
