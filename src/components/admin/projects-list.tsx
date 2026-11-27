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
import type { ContractorOption } from "@/components/admin/project-create-form";
import { ProjectStatusActions } from "@/components/admin/project-status-actions";
import {
  projectStatusLabels,
  type ProjectStatus,
} from "@/lib/validations/project";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title-asc", label: "Name A–Z" },
  { value: "title-desc", label: "Name Z–A" },
  { value: "status", label: "Status" },
];

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
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [query, sort]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let next = items;
    if (q) {
      next = items.filter((item) =>
        [
          item.title,
          item.location,
          item.clientName,
          item.contractorName ?? "",
          item.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    const sorted = [...next];
    sorted.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return a.createdLabel.localeCompare(b.createdLabel);
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "status":
          return a.status.localeCompare(b.status) || a.title.localeCompare(b.title);
        case "newest":
        default:
          return b.createdLabel.localeCompare(a.createdLabel);
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
    <div className="space-y-4">
      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
        sortOptions={sortOptions}
        placeholder="Search projects…"
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
              {pageItems.map((item) => (
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
    </div>
  );
}
