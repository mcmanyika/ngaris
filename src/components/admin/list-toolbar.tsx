"use client";

import { Search } from "lucide-react";

export type SortOption = {
  value: string;
  label: string;
};

export function ListToolbar({
  query,
  onQueryChange,
  sort,
  onSortChange,
  sortOptions,
  placeholder = "Search…",
  resultCount,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];
  placeholder?: string;
  resultCount?: number;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Search</span>
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#032842]/35" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          className="h-10 w-full rounded-xl border border-[#032842]/12 bg-white pr-3 pl-9 text-sm text-[#032842] outline-none placeholder:text-[#032842]/35 focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/25"
        />
      </label>
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor="list-sort">
          Sort
        </label>
        <select
          id="list-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="h-10 rounded-xl border border-[#032842]/12 bg-white px-3 text-sm text-[#032842] outline-none focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/25"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {typeof resultCount === "number" ? (
          <span className="shrink-0 text-xs text-[#032842]/40">
            {resultCount}
          </span>
        ) : null}
      </div>
    </div>
  );
}
