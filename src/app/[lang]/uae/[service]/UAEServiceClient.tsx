"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Building2, Home, Plane } from "lucide-react";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  star: Star,
  building2: Building2,
  home: Home,
  plane: Plane,
};

export default function UAEServiceClient({ serviceId }: { serviceId: string }) {
  const { t, lang, isRTL } = useLanguage();
  const page = t.uae_page;
  const service = page?.services?.find((s: any) => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <Navbar />
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold">404</h1>
          <a href={`/${lang}/uae/`} className="text-blue-600 underline mt-4 inline-block">
            {page?.title || "UAE"}
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = iconMap[service.icon] || Star;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-6">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <h1 className="text-3xl md:text-5xl font-bold">{service.name}</h1>
            {service.tag && (
              <span className="text-xs bg-white/20 backdrop-blur px-3 py-1 rounded-full">{service.tag}</span>
            )}
          </div>
          <p className="text-lg md:text-xl text-blue-100 mb-4">{service.desc}</p>
          <span className="inline-block text-2xl font-bold text-blue-200">{service.price}</span>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{page.cta_title}</h2>
          <p className="text-gray-600 mb-8">{page.cta_desc}</p>
          <a
            href="https://wa.me/971562009131"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            {page.cta_button}
          </a>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">{page.services_title}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {page.services
              .filter((s: any) => s.id !== serviceId)
              .map((svc: any, i: number) => {
                const SvcIcon = iconMap[svc.icon] || Star;
                return (
                  <a
                    key={i}
                    href={svc.href}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow block text-center"
                  >
                    <SvcIcon className="w-6 h-6 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-sm mb-1">{svc.name}</h3>
                    <span className="text-blue-600 text-xs">{svc.price}</span>
                  </a>
                );
              })}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
