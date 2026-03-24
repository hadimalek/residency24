"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Settings,
  Save,
  Bot,
  Globe,
  UserCheck,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

interface SettingsData {
  botName: string;
  welcomeMessage: string;
  avatarUrl: string;
  languages: {
    fa: boolean;
    en: boolean;
    ar: boolean;
    ru: boolean;
  };
  leadCapture: {
    name: boolean;
    email: boolean;
    phone: boolean;
    nationality: boolean;
  };
}

const defaultSettings: SettingsData = {
  botName: "Residency24 Bot",
  welcomeMessage: "سلام! به Residency24 خوش آمدید. چطور می‌تونم کمکتون کنم؟",
  avatarUrl: "",
  languages: { fa: true, en: true, ar: false, ru: false },
  leadCapture: { name: true, email: true, phone: false, nationality: true },
};

const languageLabels: Record<string, string> = {
  fa: "فارسی",
  en: "انگلیسی",
  ar: "عربی",
  ru: "روسی",
};

const leadFieldLabels: Record<string, string> = {
  name: "نام",
  email: "ایمیل",
  phone: "تلفن",
  nationality: "ملیت",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("خطا در دریافت تنظیمات");
        const json = await res.json();
        setSettings({
          ...defaultSettings,
          ...json,
          languages: { ...defaultSettings.languages, ...json.languages },
          leadCapture: { ...defaultSettings.leadCapture, ...json.leadCapture },
        });
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("خطا در ذخیره تنظیمات");
      toast.success("تنظیمات با موفقیت ذخیره شد");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Bot Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Bot className="h-5 w-5" />
            تنظیمات بات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="botName">نام بات</Label>
            <Input
              id="botName"
              value={settings.botName}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, botName: e.target.value }))
              }
              placeholder="نام بات"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">پیام خوش‌آمدگویی</Label>
            <Textarea
              id="welcomeMessage"
              value={settings.welcomeMessage}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  welcomeMessage: e.target.value,
                }))
              }
              placeholder="پیام خوش‌آمدگویی"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>آواتار بات</Label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">
                تصویر آواتار را اینجا بکشید یا کلیک کنید
              </p>
              <p className="text-xs text-gray-300 mt-1">
                PNG، JPG تا ۲ مگابایت
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Globe className="h-5 w-5" />
            تنظیمات زبان
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(Object.keys(settings.languages) as Array<keyof typeof settings.languages>).map(
              (lang) => (
                <div key={lang} className="flex items-center gap-3">
                  <Checkbox
                    id={`lang-${lang}`}
                    checked={settings.languages[lang]}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        languages: {
                          ...prev.languages,
                          [lang]: checked === true,
                        },
                      }))
                    }
                  />
                  <Label htmlFor={`lang-${lang}`} className="text-sm cursor-pointer">
                    {languageLabels[lang]} ({lang})
                  </Label>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lead Capture Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            تنظیمات جمع‌آوری لید
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            فیلدهایی که برای جمع‌آوری اطلاعات لید الزامی هستند را مشخص کنید.
          </p>
          <div className="space-y-4">
            {(Object.keys(settings.leadCapture) as Array<keyof typeof settings.leadCapture>).map(
              (field) => (
                <div key={field} className="flex items-center justify-between">
                  <Label htmlFor={`lead-${field}`} className="text-sm cursor-pointer">
                    {leadFieldLabels[field]}
                  </Label>
                  <Switch
                    id={`lead-${field}`}
                    checked={settings.leadCapture[field]}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        leadCapture: {
                          ...prev.leadCapture,
                          [field]: checked,
                        },
                      }))
                    }
                  />
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="gap-2 px-8"
          style={{ backgroundColor: "#001E6E" }}
        >
          <Save className="h-4 w-4" />
          {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
        </Button>
      </div>
    </div>
  );
}
