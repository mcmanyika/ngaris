"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  leadStatusLabels,
  leadStatuses,
  type LeadStatus,
} from "@/lib/validations/lead";

export function LeadStatusActions({
  leadId,
  currentStatus,
  currentNote,
}: {
  leadId: string;
  currentStatus: LeadStatus;
  currentNote: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(currentStatus);
  const [note, setNote] = useState(currentNote ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSave() {
    setError(null);
    setPending(true);

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          staffNote: note.trim() || undefined,
        }),
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
      <h2 className="text-base font-semibold text-[#032842]">Update</h2>

      <div className="space-y-1.5">
        <label htmlFor="leadStatus" className="text-sm font-medium">
          Status
        </label>
        <select
          id="leadStatus"
          value={status}
          onChange={(event) => setStatus(event.target.value as LeadStatus)}
          className="h-10 w-full rounded-lg border border-[#032842]/15 bg-white px-3 text-sm outline-none focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/25"
        >
          {leadStatuses.map((value) => (
            <option key={value} value={value}>
              {leadStatusLabels[value]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="staffNote" className="text-sm font-medium">
          Staff note
        </label>
        <textarea
          id="staffNote"
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="w-full rounded-lg border border-[#032842]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/25"
        />
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
        {pending ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
