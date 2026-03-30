"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Building2, Home, Plane, Shield, Globe } from "lucide-react";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  star: Star,
  building2: Building2,
  home: Home,
  plane: Plane,
  shield: Shield,
  globe: Globe,
};

export default function UAEPageClient() {
  const { t, isRTL } = useLanguage();
  const page = t.uae_page;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block mb-4 text-sm bg-white/10 backdrop-blur px-4 py-1.5 rounded-full">
            🇦🇪 {page.title}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{page.title}</h1>
          <p className="text-lg md:text-xl text-blue-100 mb-2">{page.subtitle}</p>
          <p className="text-blue-200 max-w-2xl mx-auto">{page.description}</p>
        </div>
      </section>

      {/* Why UAE */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{page.why_title}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {page.why_items.map((item: any, i: number) => {
              const Icon = iconMap[item.icon] || Shield;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{page.services_title}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {page.services.map((svc: any, i: number) => {
              const Icon = iconMap[svc.icon] || Star;
              return (
                <a
                  key={i}
                  href={svc.href}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow block"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{svc.name}</h3>
                        {svc.tag && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{svc.tag}</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{svc.desc}</p>
                      <span className="text-blue-600 font-medium text-sm">{svc.price}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-blue-950 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{page.cta_title}</h2>
          <p className="text-blue-200 mb-8">{page.cta_desc}</p>
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

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{page.faq_title}</h2>
          <div className="space-y-4">
            {page.faqs.map((faq: any, i: number) => (
              <details key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  {faq.q}
                </summary>
                <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
