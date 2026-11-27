import { redirect } from "next/navigation";

import { ContractorProfileForm } from "@/components/contractor/profile-form";
import { getProviderByOwnerUid } from "@/lib/firebase/providers";
import { getSessionContext } from "@/lib/firebase/session-context";
import {
  providerTrades,
  type ProviderProfileUpdateInput,
} from "@/lib/validations/provider";

export const instant = false;

export const metadata = {
  title: "Contractor profile",
  description: "Update your Ngaris Construction contractor profile.",
};

export default async function ContractorProfilePage() {
  const session = await getSessionContext();
  if (!session?.isContractor) {
    redirect("/contractor/login");
  }

  const provider = await getProviderByOwnerUid(session.user.uid);
  if (!provider) {
    redirect("/contractor/apply");
  }

  const trade = providerTrades.includes(
    provider.trade as (typeof providerTrades)[number],
  )
    ? (provider.trade as ProviderProfileUpdateInput["trade"])
    : "other";

  const locked =
    provider.verificationStatus === "rejected" ||
    provider.verificationStatus === "suspended";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>

      <div className="rounded-2xl border border-[#032842]/8 bg-white p-5 sm:p-6">
        <ContractorProfileForm
          locked={locked}
          initial={{
            contactName: provider.contactName,
            companyName: provider.companyName,
            phone: provider.phone,
            city: provider.city,
            trade,
            yearsExperience:
              provider.yearsExperience != null
                ? String(provider.yearsExperience)
                : "",
            about: provider.about,
            email: provider.email,
          }}
        />
      </div>
    </div>
  );
}
