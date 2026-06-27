"use client";

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import LandingLeadForm from "./LandingLeadForm";

interface LeadFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceSlug: string;
  strings: Record<string, string>;
}

/**
 * Lightweight popup wrapper around the existing LandingLeadForm (name + phone),
 * which persists to /api/landing-lead and shows in the admin panel. Navy content
 * so the form's dark-styled inputs render correctly.
 */
export default function LeadFormModal({ open, onOpenChange, sourceSlug, strings }: LeadFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-navy border border-gold/20 text-white sm:rounded-2xl max-w-md">
        <DialogTitle className="text-gold text-xl font-bold">{strings.cta_title}</DialogTitle>
        <DialogDescription className="text-white/70 text-sm">{strings.cta_sub}</DialogDescription>
        <div className="mt-2">
          <LandingLeadForm sourceSlug={sourceSlug} strings={strings} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
