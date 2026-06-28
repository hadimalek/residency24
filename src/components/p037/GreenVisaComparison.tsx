"use client";

interface GreenVisaComparisonProps {
  data: any;
}

export default function GreenVisaComparison({ data }: GreenVisaComparisonProps) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-[28px] md:text-[32px] font-bold text-navy text-center mb-10">{data.title}</h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="bg-navy text-white">
                {data.columns.map((c: string, i: number) => (
                  <th key={i} className={`px-4 py-3.5 font-bold ${i === 0 ? "text-start" : "text-center"}`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r: any, i: number) => (
                <tr key={i} className={`border-t border-border ${i % 2 ? "bg-surface" : "bg-white"}`}>
                  <td className="px-4 py-3.5 font-semibold text-navy/80">{r.label}</td>
                  <td className="px-4 py-3.5 text-center text-ink font-medium">{r.green}</td>
                  <td className="px-4 py-3.5 text-center text-muted-foreground">{r.golden}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
