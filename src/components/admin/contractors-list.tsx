"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { DetailField } from "@/components/admin/detail-field";
import { FullscreenDetailDialog } from "@/components/admin/fullscreen-detail-dialog";
import { ProviderReviewActions } from "@/components/admin/provider-review-actions";
import {
  providerTradeLabels,
  providerVerificationLabels,
  type ProviderVerificationStatus,
  type providerTrades,
} from "@/lib/validations/provider";

export type ContractorListItem = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  trade: string;
  yearsExperience: number | null;
  about: string;
  verificationStatus: ProviderVerificationStatus;
  reviewNote: string | null;
};

export function ContractorsList({ items }: { items: ContractorListItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const selectedId = searchParams.get("id");
  const [localId, setLocalId] = useState<string | null>(null);

  const activeId = localId ?? selectedId;
  const selected = useMemo(
    () => items.find((item) => item.id === activeId) ?? null,
    [items, activeId],
  );

  function openItem(id: string) {
    setLocalId(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("id", id);
    startTransition(() => {
      router.replace(`/admin/providers?${params.toString()}`, { scroll: false });
    });
  }

  function close() {
    setLocalId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `/admin/providers?${query}` : "/admin/providers", {
        scroll: false,
      });
    });
  }

  const tradeLabel = selected
    ? (providerTradeLabels[
        selected.trade as (typeof providerTrades)[number]
      ] ?? selected.trade)
    : "";

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#032842]/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#032842]/8 bg-[#F4F7FA] text-[11px] tracking-wide text-[#032842]/45 uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                Trade
              </th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">
                City
              </th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const trade =
                providerTradeLabels[
                  item.trade as (typeof providerTrades)[number]
                ] ?? item.trade;
              return (
                <tr
                  key={item.id}
                  className="cursor-pointer border-b border-[#032842]/6 last:border-0 hover:bg-[#032842]/[0.03]"
                  onClick={() => openItem(item.id)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#032842]">
                      {item.companyName}
                    </p>
                    <p className="mt-0.5 text-xs text-[#032842]/45">
                      {item.contactName} · {item.email}
                    </p>
                  </td>
                  <td className="hidden px-4 py-3 text-[#032842]/65 sm:table-cell">
                    {trade}
                  </td>
                  <td className="hidden px-4 py-3 text-[#032842]/65 md:table-cell">
                    {item.city}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-[#032842]/6 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#032842] uppercase">
                      {providerVerificationLabels[item.verificationStatus] ??
                        item.verificationStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <FullscreenDetailDialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        title={selected?.companyName ?? ""}
        badge={
          selected ? (
            <span className="rounded-md bg-[#032842]/6 px-2.5 py-1 text-xs font-semibold tracking-wide text-[#032842] uppercase">
              {providerVerificationLabels[selected.verificationStatus] ??
                selected.verificationStatus}
            </span>
          ) : null
        }
        meta={selected ? `${tradeLabel} · ${selected.city}` : null}
      >
        {selected ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailField label="Contact" value={selected.contactName} />
              <DetailField label="Email" value={selected.email} />
              <DetailField label="Phone" value={selected.phone} />
              <DetailField
                label="Experience"
                value={
                  selected.yearsExperience != null
                    ? `${selected.yearsExperience} years`
                    : "—"
                }
              />
            </div>

            <div className="rounded-2xl border border-[#032842]/8 bg-white p-5">
              <h2 className="text-base font-semibold">About</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#032842]/70">
                {selected.about}
              </p>
            </div>

            {selected.reviewNote ? (
              <div className="rounded-2xl border border-[#032842]/8 bg-white p-5">
                <h2 className="text-base font-semibold">Reviewer note</h2>
                <p className="mt-2 text-sm text-[#032842]/70">
                  {selected.reviewNote}
                </p>
              </div>
            ) : null}

            <ProviderReviewActions providerId={selected.id} />
          </div>
        ) : null}
      </FullscreenDetailDialog>
    </>
  );
}
