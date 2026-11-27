"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import { DetailField } from "@/components/admin/detail-field";
import { FullscreenDetailDialog } from "@/components/admin/fullscreen-detail-dialog";
import {
  ListPagination,
  paginateItems,
} from "@/components/admin/list-pagination";
import { ListToolbar } from "@/components/admin/list-toolbar";
import { ProviderReviewActions } from "@/components/admin/provider-review-actions";
import {
  providerTradeLabels,
  providerVerificationLabels,
  type ProviderVerificationStatus,
  type providerTrades,
} from "@/lib/validations/provider";

const sortOptions = [
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "status", label: "Status" },
  { value: "city", label: "City" },
];

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
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name-asc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [query, sort]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let next = items;
    if (q) {
      next = items.filter((item) => {
        const trade =
          providerTradeLabels[item.trade as (typeof providerTrades)[number]] ??
          item.trade;
        return [item.companyName, item.contactName, item.email, item.city, trade, item.verificationStatus]
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
    }
    const sorted = [...next];
    sorted.sort((a, b) => {
      switch (sort) {
        case "name-desc":
          return b.companyName.localeCompare(a.companyName);
        case "status":
          return (
            a.verificationStatus.localeCompare(b.verificationStatus) ||
            a.companyName.localeCompare(b.companyName)
          );
        case "city":
          return (
            a.city.localeCompare(b.city) ||
            a.companyName.localeCompare(b.companyName)
          );
        case "name-asc":
        default:
          return a.companyName.localeCompare(b.companyName);
      }
    });
    return sorted;
  }, [items, query, sort]);

  const { pageItems, currentPage, totalPages, total, start, end } =
    paginateItems(filtered, page);

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
    <div className="space-y-4">
      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
        sortOptions={sortOptions}
        placeholder="Search contractors…"
        resultCount={filtered.length}
      />
      <div className="overflow-hidden rounded-2xl border border-[#032842]/8 bg-white">
        {pageItems.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-[#032842]/45">
            No matches
          </p>
        ) : (
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
              {pageItems.map((item) => {
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
        )}
      </div>

      <ListPagination
        page={currentPage}
        totalPages={totalPages}
        total={total}
        start={start}
        end={end}
        onPageChange={setPage}
      />

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
    </div>
  );
}
