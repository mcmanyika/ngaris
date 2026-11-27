"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { DetailField } from "@/components/admin/detail-field";
import { FullscreenDetailDialog } from "@/components/admin/fullscreen-detail-dialog";
import type { ContractorOption } from "@/components/admin/project-create-form";
import { ProjectStatusActions } from "@/components/admin/project-status-actions";
import {
  projectStatusLabels,
  type ProjectStatus,
} from "@/lib/validations/project";

export type ProjectListItem = {
  id: string;
  title: string;
  location: string;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  contractorId: string | null;
  contractorName: string | null;
  status: ProjectStatus;
  notes: string | null;
  createdLabel: string;
};

export function ProjectsList({
  items,
  contractors,
}: {
  items: ProjectListItem[];
  contractors: ContractorOption[];
}) {
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
      router.replace(`/admin/projects?${params.toString()}`, { scroll: false });
    });
  }

  function close() {
    setLocalId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `/admin/projects?${query}` : "/admin/projects", {
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
              <th className="px-4 py-3 font-semibold">Project</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                Client
              </th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">
                Contractor
              </th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="cursor-pointer border-b border-[#032842]/6 last:border-0 hover:bg-[#032842]/[0.03]"
                onClick={() => openItem(item.id)}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-[#032842]">{item.title}</p>
                  <p className="mt-0.5 text-xs text-[#032842]/45">
                    {item.location} · {item.createdLabel}
                  </p>
                </td>
                <td className="hidden px-4 py-3 text-[#032842]/65 sm:table-cell">
                  {item.clientName}
                </td>
                <td className="hidden px-4 py-3 text-[#032842]/65 md:table-cell">
                  {item.contractorName ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-[#032842]/6 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#032842] uppercase">
                    {projectStatusLabels[item.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FullscreenDetailDialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        title={selected?.title ?? ""}
        badge={
          selected ? (
            <span className="rounded-md bg-[#032842]/6 px-2.5 py-1 text-xs font-semibold tracking-wide text-[#032842] uppercase">
              {projectStatusLabels[selected.status]}
            </span>
          ) : null
        }
        meta={selected ? `${selected.location} · ${selected.createdLabel}` : null}
      >
        {selected ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailField label="Client" value={selected.clientName} />
              <DetailField
                label="Email"
                value={selected.clientEmail ?? "—"}
              />
              <DetailField
                label="Phone"
                value={selected.clientPhone ?? "—"}
              />
              <DetailField
                label="Contractor"
                value={selected.contractorName ?? "—"}
              />
            </div>

            {selected.notes ? (
              <div className="rounded-2xl border border-[#032842]/8 bg-white p-5">
                <h2 className="text-base font-semibold">Notes</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#032842]/70">
                  {selected.notes}
                </p>
              </div>
            ) : null}

            <ProjectStatusActions
              projectId={selected.id}
              currentStatus={selected.status}
              currentNotes={selected.notes}
              currentContractorId={selected.contractorId}
              contractors={contractors}
            />
          </div>
        ) : null}
      </FullscreenDetailDialog>
    </>
  );
}
