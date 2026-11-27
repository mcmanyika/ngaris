"use client";

import { useMemo, useState } from "react";

import { DetailField } from "@/components/admin/detail-field";
import { FullscreenDetailDialog } from "@/components/admin/fullscreen-detail-dialog";
import { ListToolbar } from "@/components/admin/list-toolbar";
import { UserAccessActions } from "@/components/admin/user-access-actions";
import {
  profileRoleLabels,
  profileStatusLabels,
  type ProfileRole,
  type ProfileStatus,
} from "@/lib/validations/user-access";

export type UserListItem = {
  id: string;
  fullName: string;
  email: string | null;
  status: ProfileStatus;
  roles: ProfileRole[];
  createdLabel: string;
};

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "status", label: "Status" },
];

export function UsersList({ items }: { items: UserListItem[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let next = items;
    if (q) {
      next = items.filter((item) =>
        [item.fullName, item.email ?? "", item.status, ...item.roles]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    const sorted = [...next];
    sorted.sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.fullName.localeCompare(b.fullName);
        case "status":
          return (
            a.status.localeCompare(b.status) ||
            a.fullName.localeCompare(b.fullName)
          );
        case "newest":
        default:
          return b.createdLabel.localeCompare(a.createdLabel);
      }
    });
    return sorted;
  }, [items, query, sort]);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  return (
    <div className="space-y-4">
      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
        sortOptions={sortOptions}
        placeholder="Search users…"
        resultCount={filtered.length}
      />

      <div className="overflow-hidden rounded-2xl border border-[#032842]/8 bg-white">
        {filtered.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-[#032842]/45">
            No matches
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#032842]/8 bg-[#F4F7FA] text-[11px] tracking-wide text-[#032842]/45 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                  Roles
                </th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="cursor-pointer border-b border-[#032842]/6 last:border-0 hover:bg-[#032842]/[0.03]"
                  onClick={() => setSelectedId(item.id)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#032842]">
                      {item.fullName || "—"}
                    </p>
                    <p className="mt-0.5 text-xs text-[#032842]/45">
                      {item.email ?? item.id}
                    </p>
                  </td>
                  <td className="hidden px-4 py-3 text-[#032842]/65 sm:table-cell">
                    {item.roles.length
                      ? item.roles.map((role) => profileRoleLabels[role]).join(", ")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-[#032842]/6 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#032842] uppercase">
                      {profileStatusLabels[item.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <FullscreenDetailDialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
        title={selected?.fullName || selected?.email || "User"}
        badge={
          selected ? (
            <span className="rounded-md bg-[#032842]/6 px-2.5 py-1 text-xs font-semibold tracking-wide text-[#032842] uppercase">
              {profileStatusLabels[selected.status]}
            </span>
          ) : null
        }
        meta={selected?.email}
      >
        {selected ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DetailField label="Email" value={selected.email ?? "—"} />
              <DetailField
                label="Roles"
                value={
                  selected.roles.length
                    ? selected.roles
                        .map((role) => profileRoleLabels[role])
                        .join(", ")
                    : "—"
                }
              />
              <DetailField label="Created" value={selected.createdLabel} />
            </div>
            <UserAccessActions
              userId={selected.id}
              currentStatus={selected.status}
              currentRoles={selected.roles}
            />
          </div>
        ) : null}
      </FullscreenDetailDialog>
    </div>
  );
}
