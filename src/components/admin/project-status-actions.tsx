"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { ContractorOption } from "@/components/admin/project-create-form";
import {
  projectStatusLabels,
  projectStatuses,
  type ProjectStatus,
} from "@/lib/validations/project";

export function ProjectStatusActions({
  projectId,
  currentStatus,
  currentNotes,
  currentContractorId,
  contractors,
}: {
  projectId: string;
  currentStatus: ProjectStatus;
  currentNotes: string | null;
  currentContractorId: string | null;
  contractors: ContractorOption[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ProjectStatus>(currentStatus);
  const [notes, setNotes] = useState(currentNotes ?? "");
  const [contractorId, setContractorId] = useState(
    currentContractorId ?? contractors[0]?.id ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSave() {
    setError(null);
    setPending(true);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          notes: notes.trim() || undefined,
          contractorId: contractorId || undefined,
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
        <label htmlFor="projectStatus" className="text-sm font-medium">
          Status
        </label>
        <select
          id="projectStatus"
          value={status}
          onChange={(event) => setStatus(event.target.value as ProjectStatus)}
          className="h-10 w-full rounded-lg border border-[#032842]/15 bg-white px-3 text-sm outline-none focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/25"
        >
          {projectStatuses.map((value) => (
            <option key={value} value={value}>
              {projectStatusLabels[value]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="projectContractor" className="text-sm font-medium">
          Contractor
        </label>
        <select
          id="projectContractor"
          value={contractorId}
          onChange={(event) => setContractorId(event.target.value)}
          className="h-10 w-full rounded-lg border border-[#032842]/15 bg-white px-3 text-sm outline-none focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/25"
        >
          {contractors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.companyName} · {c.city}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="projectNotes" className="text-sm font-medium">
          Notes
        </label>
        <textarea
          id="projectNotes"
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
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
