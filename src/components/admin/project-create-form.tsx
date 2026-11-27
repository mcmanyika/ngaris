"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  projectStatuses,
  projectStatusLabels,
  type ProjectStatus,
} from "@/lib/validations/project";

export type ContractorOption = {
  id: string;
  companyName: string;
  city: string;
};

const fieldClass =
  "h-10 w-full rounded-lg border border-[#032842]/15 bg-white px-3 text-sm outline-none focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/25";

export function ProjectCreateForm({
  contractors,
}: {
  contractors: ContractorOption[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [contractorId, setContractorId] = useState(contractors[0]?.id ?? "");
  const [status, setStatus] = useState<ProjectStatus>("active");
  const [notes, setNotes] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          location,
          clientName,
          clientEmail,
          clientPhone,
          contractorId,
          status,
          notes,
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        id?: string;
      } | null;

      if (!response.ok || !payload?.id) {
        throw new Error(payload?.error ?? "Create failed.");
      }

      setOpen(false);
      setTitle("");
      setLocation("");
      setClientName("");
      setClientEmail("");
      setClientPhone("");
      setNotes("");
      setStatus("active");
      router.replace(`/admin/projects?id=${encodeURIComponent(payload.id)}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed.");
    } finally {
      setPending(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={contractors.length === 0}
        className="inline-flex h-10 shrink-0 items-center rounded-lg bg-[#EDB254] px-4 text-sm font-semibold text-[#032842] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        New project
      </button>
    );
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      className="w-full basis-full space-y-4 rounded-2xl border border-[#032842]/8 bg-white p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">New project</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-[#032842]/50 hover:text-[#032842]"
        >
          Cancel
        </button>
      </div>

      {contractors.length === 0 ? (
        <p className="text-sm text-[#032842]/55">
          Verify a contractor before creating a project.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" htmlFor="projectTitle">
            <input
              id="projectTitle"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Location" htmlFor="projectLocation">
            <input
              id="projectLocation"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Client name" htmlFor="clientName">
            <input
              id="clientName"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Contractor" htmlFor="contractorId">
            <select
              id="contractorId"
              required
              value={contractorId}
              onChange={(e) => setContractorId(e.target.value)}
              className={fieldClass}
            >
              {contractors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName} · {c.city}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Client email" htmlFor="clientEmail">
            <input
              id="clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Client phone" htmlFor="clientPhone">
            <input
              id="clientPhone"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Status" htmlFor="projectStatus">
            <select
              id="projectStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className={fieldClass}
            >
              {projectStatuses.map((value) => (
                <option key={value} value={value}>
                  {projectStatusLabels[value]}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes" htmlFor="projectNotes">
              <textarea
                id="projectNotes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-[#032842]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/25"
              />
            </Field>
          </div>
        </div>
      )}

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || contractors.length === 0}
        className="inline-flex h-10 items-center rounded-lg bg-[#EDB254] px-4 text-sm font-semibold text-[#032842] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create project"}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
