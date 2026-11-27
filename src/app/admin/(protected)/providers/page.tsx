import { Suspense } from "react";

import {
  ContractorsList,
  type ContractorListItem,
} from "@/components/admin/contractors-list";
import { listProviders } from "@/lib/firebase/providers";

export const instant = false;

export const metadata = {
  title: "Contractors",
  description: "Review contractor applications and verification status.",
};

function ListFallback() {
  return (
    <div className="rounded-2xl border border-[#032842]/8 bg-white px-6 py-10 text-sm text-[#032842]/45">
      Loading…
    </div>
  );
}

async function ContractorsContent() {
  const providers = await listProviders({ limit: 100 });

  const items: ContractorListItem[] = providers.map((provider) => ({
    id: provider.id,
    companyName: provider.companyName,
    contactName: provider.contactName,
    email: provider.email,
    phone: provider.phone,
    city: provider.city,
    trade: provider.trade,
    yearsExperience: provider.yearsExperience,
    about: provider.about,
    verificationStatus: provider.verificationStatus,
    reviewNote: provider.reviewNote,
  }));

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#032842]/15 bg-white px-6 py-12 text-center">
        <p className="text-sm font-medium text-[#032842]">No applications yet</p>
      </div>
    );
  }

  return <ContractorsList items={items} />;
}

export default function AdminProvidersPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Contractors</h1>

      <Suspense fallback={<ListFallback />}>
        <ContractorsContent />
      </Suspense>
    </div>
  );
}
