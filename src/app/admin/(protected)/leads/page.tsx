import { Suspense } from "react";

import { LeadsList, type LeadListItem } from "@/components/admin/leads-list";
import { listLeads } from "@/lib/firebase/leads";

export const instant = false;

export const metadata = {
  title: "Leads",
  description: "Consultation enquiries from the landing form.",
};

function formatDate(millis: number | undefined, withTime = false) {
  if (!millis) return "—";
  return new Intl.DateTimeFormat(
    "en-GB",
    withTime
      ? {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      : {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
  ).format(new Date(millis));
}

function ListFallback() {
  return (
    <div className="rounded-2xl border border-[#032842]/8 bg-white px-6 py-10 text-sm text-[#032842]/45">
      Loading…
    </div>
  );
}

async function LeadsContent() {
  const leads = await listLeads({ limit: 100 });

  const items: LeadListItem[] = leads.map((lead) => {
    const millis = lead.createdAt?.toMillis?.();
    return {
      id: lead.id,
      fullName: lead.fullName,
      email: lead.email,
      phone: lead.phone,
      country: lead.country,
      projectType: lead.projectType,
      location: lead.location,
      budgetRange: lead.budgetRange,
      message: lead.message,
      source: lead.source,
      status: lead.status,
      staffNote: lead.staffNote,
      createdLabel: formatDate(millis),
      createdFullLabel: formatDate(millis, true),
    };
  });

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#032842]/15 bg-white px-6 py-12 text-center">
        <p className="text-sm font-medium text-[#032842]">No leads yet</p>
      </div>
    );
  }

  return <LeadsList items={items} />;
}

export default function AdminLeadsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Leads</h1>

      <Suspense fallback={<ListFallback />}>
        <LeadsContent />
      </Suspense>
    </div>
  );
}
