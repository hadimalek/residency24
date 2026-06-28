"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import MediaImage from "@/components/MediaImage";

const IMG_KEYS = ["skilledPathway", "freelancerPathway", "investorPathway"];

interface PathwayTabsProps {
  data: any;
  images: any;
}

export default function PathwayTabs({ data, images }: PathwayTabsProps) {
  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-[28px] md:text-[32px] font-bold text-navy text-center mb-10">{data.title}</h2>
        <Tabs defaultValue="tab0">
          <TabsList className="flex flex-wrap justify-center gap-2 mb-8 h-auto bg-transparent p-0">
            {data.tabs.map((tab: any, i: number) => (
              <TabsTrigger
                key={i}
                value={`tab${i}`}
                className="px-4 py-2 rounded-full border border-border bg-white text-sm font-semibold text-muted-foreground data-[state=active]:bg-navy data-[state=active]:text-white data-[state=active]:border-navy"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {data.tabs.map((tab: any, i: number) => (
            <TabsContent key={i} value={`tab${i}`}>
              <div className="grid md:grid-cols-2 gap-8 items-center bg-white border border-border rounded-3xl p-6 md:p-8">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-t-2 border-gold">
                  <MediaImage
                    src={images[IMG_KEYS[i]]?.src}
                    alt={images[IMG_KEYS[i]]?.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-navy mb-2">{tab.heading}</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">{tab.body}</p>
                  <ul className="space-y-2.5">
                    {tab.points.map((pt: string, j: number) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-ink">
                        <Check className="w-5 h-5 text-gold-dk shrink-0 mt-0.5" /> {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
