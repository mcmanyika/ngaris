"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export const LIST_PAGE_SIZE = 10;

export function paginateItems<T>(items: T[], page: number, pageSize = LIST_PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  return {
    pageItems: items.slice(start, start + pageSize),
    currentPage,
    totalPages,
    total: items.length,
    start: items.length === 0 ? 0 : start + 1,
    end: Math.min(start + pageSize, items.length),
  };
}

export function ListPagination({
  page,
  totalPages,
  total,
  start,
  end,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  start: number;
  end: number;
  onPageChange: (page: number) => void;
}) {
  if (total <= LIST_PAGE_SIZE) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-[#032842]/45">
        {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#032842]/12 bg-white px-3 text-sm text-[#032842] transition-colors hover:bg-[#032842]/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>
        <span className="min-w-[4.5rem] text-center text-xs text-[#032842]/55">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#032842]/12 bg-white px-3 text-sm text-[#032842] transition-colors hover:bg-[#032842]/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
