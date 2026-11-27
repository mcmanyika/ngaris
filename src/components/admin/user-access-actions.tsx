"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  profileRoleLabels,
  profileRoles,
  profileStatusLabels,
  profileStatuses,
  type ProfileRole,
  type ProfileStatus,
} from "@/lib/validations/user-access";

export function UserAccessActions({
  userId,
  currentStatus,
  currentRoles,
}: {
  userId: string;
  currentStatus: ProfileStatus;
  currentRoles: ProfileRole[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ProfileStatus>(currentStatus);
  const [selectedRoles, setSelectedRoles] = useState<ProfileRole[]>(currentRoles);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function toggleRole(role: ProfileRole) {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  }

  async function onSave() {
    setError(null);
    setPending(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, roles: selectedRoles }),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!response.ok) {
        throw new Error(payload?.error ?? "Update failed.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-[#032842]/8 bg-white p-5">
      <h2 className="text-base font-semibold text-[#032842]">Access</h2>

      <div className="space-y-1.5">
        <label htmlFor="userStatus" className="text-sm font-medium">
          Status
        </label>
        <select
          id="userStatus"
          value={status}
          onChange={(event) => setStatus(event.target.value as ProfileStatus)}
          className="h-10 w-full rounded-lg border border-[#032842]/15 bg-white px-3 text-sm outline-none focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/25"
        >
          {profileStatuses.map((value) => (
            <option key={value} value={value}>
              {profileStatusLabels[value]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Roles</p>
        <div className="flex flex-wrap gap-2">
          {profileRoles.map((role) => {
            const active = selectedRoles.includes(role);
            return (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                className={
                  active
                    ? "rounded-lg bg-[#032842] px-3 py-1.5 text-xs font-semibold tracking-wide text-white uppercase"
                    : "rounded-lg border border-[#032842]/15 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-[#032842]/55 uppercase"
                }
              >
                {profileRoleLabels[role]}
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={pending}
        onClick={() => void onSave()}
        className="inline-flex h-10 items-center rounded-lg bg-[#EDB254] px-4 text-sm font-semibold text-[#032842] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save access"}
      </button>
    </div>
  );
}
