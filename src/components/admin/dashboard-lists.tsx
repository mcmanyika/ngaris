"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ListToolbar } from "@/components/admin/list-toolbar";
import {
  ListPagination,
  paginateItems,
} from "@/components/admin/list-pagination";
import {
  providerTradeLabels,
  providerVerificationLabels,
  type ProviderVerificationStatus,
  type providerTrades,
} from "@/lib/validations/provider";
import {
  projectStatusLabels,
  type ProjectStatus,
} from "@/lib/validations/project";

export type DashboardProjectItem = {
  id: string;
  title: string;
  clientName: string;
  location: string;
  status: ProjectStatus;
  contractorName: string | null;
};

export type DashboardContractorItem = {
  id: string;
  companyName: string;
  city: string;
  trade: string;
  verificationStatus: ProviderVerificationStatus;
};

const projectSortOptions = [
  { value: "title-asc", label: "Name A–Z" },
  { value: "title-desc", label: "Name Z–A" },
  { value: "status", label: "Status" },
  { value: "location", label: "Location" },
];

const contractorSortOptions = [
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "status", label: "Status" },
  { value: "city", label: "City" },
];

function matchesQuery(haystack: string, query: string) {
  return haystack.toLowerCase().includes(query.trim().toLowerCase());
}

export function DashboardProjectsSection({
  items,
}: {
  items: DashboardProjectItem[];
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("title-asc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [query, sort]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let next = items;
    if (q) {
      next = items.filter((item) =>
        matchesQuery(
          [
            item.title,
            item.clientName,
            item.location,
            item.contractorName ?? "",
            item.status,
          ].join(" "),
          q,
        ),
      );
    }
    const sorted = [...next];
    sorted.sort((a, b) => {
      switch (sort) {
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "status":
          return a.status.localeCompare(b.status) || a.title.localeCompare(b.title);
        case "location":
          return (
            a.location.localeCompare(b.location) || a.title.localeCompare(b.title)
          );
        case "title-asc":
        default:
          return a.title.localeCompare(b.title);
      }
    });
    return sorted;
  }, [items, query, sort]);

  const { pageItems, currentPage, totalPages, total, start, end } =
    paginateItems(filtered, page);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Projects</h2>
        <Link
          href="/admin/projects"
          className="text-sm font-medium text-[#032842]/55 hover:text-[#032842]"
        >
          View all
        </Link>
      </div>
      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
        sortOptions={projectSortOptions}
        placeholder="Search projects…"
        resultCount={filtered.length}
      />
      <div className="overflow-hidden rounded-2xl border border-[#032842]/8 bg-white">
        {pageItems.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-[#032842]/45">
            No matches
          </p>
        ) : (
          <ul className="divide-y divide-[#032842]/6">
            {pageItems.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/admin/projects?id=${encodeURIComponent(project.id)}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-[#032842]/[0.03]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#032842]">
                      {project.title}
                    </p>
                    <p className="truncate text-xs text-[#032842]/45">
                      {project.clientName} · {project.location}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-[#032842]/6 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#032842] uppercase">
                    {projectStatusLabels[project.status] ?? project.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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
    </section>
  );
}

export function DashboardContractorsSection({
  items,
}: {
  items: DashboardContractorItem[];
}) {
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
        return matchesQuery(
          [item.companyName, item.city, trade, item.verificationStatus].join(
            " ",
          ),
          q,
        );
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

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Contractors</h2>
        <Link
          href="/admin/providers"
          className="text-sm font-medium text-[#032842]/55 hover:text-[#032842]"
        >
          View all
        </Link>
      </div>
      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
        sortOptions={contractorSortOptions}
        placeholder="Search contractors…"
        resultCount={filtered.length}
      />
      <div className="overflow-hidden rounded-2xl border border-[#032842]/8 bg-white">
        {pageItems.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-[#032842]/45">
            No matches
          </p>
        ) : (
          <ul className="divide-y divide-[#032842]/6">
            {pageItems.map((provider) => {
              const trade =
                providerTradeLabels[
                  provider.trade as (typeof providerTrades)[number]
                ] ?? provider.trade;
              return (
                <li key={provider.id}>
                  <Link
                    href={`/admin/providers?id=${encodeURIComponent(provider.id)}`}
                    className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-[#032842]/[0.03]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#032842]">
                        {provider.companyName}
                      </p>
                      <p className="truncate text-xs text-[#032842]/45">
                        {trade} · {provider.city}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-md bg-[#032842]/6 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#032842] uppercase">
                      {providerVerificationLabels[provider.verificationStatus] ??
                        provider.verificationStatus}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
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
    </section>
  );
}
