import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/routing";

export async function listRequirementsForVisaType(
  visaTypeSlug: string,
  locale: Locale,
  applicantType?: string
) {
  return prisma.requirement.findMany({
    where: {
      isActive: true,
      visaType: { slug: visaTypeSlug },
      ...(applicantType && { applicantType }),
    },
    include: { translations: { where: { locale } } },
    orderBy: { sortOrder: "asc" },
  });
}
