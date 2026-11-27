"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { DetailField } from "@/components/admin/detail-field";
import { FullscreenDetailDialog } from "@/components/admin/fullscreen-detail-dialog";
import { LeadStatusActions } from "@/components/admin/lead-status-actions";
import {
  leadBudgetRanges,
  leadProjectTypes,
  leadStatusLabels,
  type LeadStatus,
} from "@/lib/validations/lead";

const projectTypeLabels: Record<(typeof leadProjectTypes)[number], string> = {
  residential_build: "Residential build",
  renovation: "Renovation",
  commercial: "Commercial",
  project_oversight: "Find contractors & manage",
  other: "Other",
};

const budgetLabels: Record<(typeof leadBudgetRanges)[number], string> = {
  under_50k: "Under USD 50k",
  "50k_150k": "USD 50k – 150k",
  "150k_500k": "USD 150k – 500k",
  "500k_plus": "USD 500k+",
  undecided: "Not sure yet",
};

export type LeadListItem = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  country: string | null;
  projectType: string | null;
  location: string | null;
  budgetRange: string | null;
  message: string;
  source: string;
  status: LeadStatus;
  staffNote: string | null;
  createdLabel: string;
  createdFullLabel: string;
};

function labelProject(value: string | null) {
  if (
    value &&
    leadProjectTypes.includes(value as (typeof leadProjectTypes)[number])
  ) {
    return projectTypeLabels[value as (typeof leadProjectTypes)[number]];
  }
  return value ?? "—";
}

function labelBudget(value: string | null) {
  if (
    value &&
    leadBudgetRanges.includes(value as (typeof leadBudgetRanges)[number])
  ) {
    return budgetLabels[value as (typeof leadBudgetRanges)[number]];
  }
  return null;
}

export function LeadsList({ items }: { items: LeadListItem[] }) {
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
      router.replace(`/admin/leads?${params.toString()}`, { scroll: false });
    });
  }

  function close() {
    setLocalId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `/admin/leads?${query}` : "/admin/leads", {
        scroll: false,
      });
    });
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#032842]/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#032842]/8 bg-[#F4F7FA] text-[11px] tracking-wide text-[#032842]/45 uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                Project
              </th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">
                Date
              </th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const project = labelProject(item.projectType);
              const budget = labelBudget(item.budgetRange);
              return (
                <tr
                  key={item.id}
                  className="cursor-pointer border-b border-[#032842]/6 last:border-0 hover:bg-[#032842]/[0.03]"
                  onClick={() => openItem(item.id)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#032842]">{item.fullName}</p>
                    <p className="mt-0.5 text-xs text-[#032842]/45">
                      {item.email}
                    </p>
                  </td>
                  <td className="hidden px-4 py-3 text-[#032842]/65 sm:table-cell">
                    <div>{project}</div>
                    {budget ? (
                      <div className="mt-0.5 text-xs text-[#032842]/45">
                        {budget}
                      </div>
                    ) : null}
                  </td>
                  <td className="hidden px-4 py-3 text-[#032842]/65 md:table-cell">
                    {item.createdLabel}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-[#032842]/6 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#032842] uppercase">
                      {leadStatusLabels[item.status] ?? item.status}
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
        title={selected?.fullName ?? ""}
        badge={
          selected ? (
            <span className="rounded-md bg-[#032842]/6 px-2.5 py-1 text-xs font-semibold tracking-wide text-[#032842] uppercase">
              {leadStatusLabels[selected.status] ?? selected.status}
            </span>
          ) : null
        }
      >
        {selected ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailField label="Email" value={selected.email} />
                <DetailField label="Phone" value={selected.phone ?? "—"} />
                <DetailField label="Country" value={selected.country ?? "—"} />
                <DetailField label="Location" value={selected.location ?? "—"} />
                <DetailField
                  label="Project type"
                  value={labelProject(selected.projectType)}
                />
                <DetailField
                  label="Budget"
                  value={labelBudget(selected.budgetRange) ?? "—"}
                />
                <DetailField label="Source" value={selected.source || "—"} />
                <DetailField label="Received" value={selected.createdFullLabel} />
              </div>

              <div className="rounded-2xl border border-[#032842]/8 bg-white p-5">
                <h2 className="text-base font-semibold">Brief</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#032842]/70">
                  {selected.message}
                </p>
              </div>
            </div>

            <LeadStatusActions
              leadId={selected.id}
              currentStatus={selected.status}
              currentNote={selected.staffNote}
            />
          </div>
        ) : null}
      </FullscreenDetailDialog>
    </>
  );
}
