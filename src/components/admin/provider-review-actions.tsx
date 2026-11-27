"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const actions = [
  {
    action: "mark_in_review" as const,
    label: "Mark in review",
    className: "border-[#032842]/15 text-[#032842] hover:bg-[#032842]/5",
  },
  {
    action: "request_info" as const,
    label: "Request info",
    className: "border-amber-500/40 text-amber-800 hover:bg-amber-50",
  },
  {
    action: "verify" as const,
    label: "Verify",
    className: "border-emerald-600/40 bg-emerald-600 text-white hover:bg-emerald-700",
  },
  {
    action: "reject" as const,
    label: "Reject",
    className: "border-red-500/40 text-red-700 hover:bg-red-50",
  },
  {
    action: "suspend" as const,
    label: "Suspend",
    className: "border-[#032842]/15 text-[#032842]/70 hover:bg-[#032842]/5",
  },
];

export function ProviderReviewActions({ providerId }: { providerId: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  async function run(action: (typeof actions)[number]["action"]) {
    setError(null);
    setPendingAction(action);

    try {
      const response = await fetch(`/api/providers/${providerId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          note: note.trim() || undefined,
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
      setPendingAction(null);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-[#032842]/8 bg-white p-5">
      <h2 className="text-base font-semibold text-[#032842]">Review</h2>

      <div className="space-y-1.5">
        <label
          htmlFor="reviewNote"
          className="text-sm font-medium text-[#032842]"
        >
          Note
        </label>
        <textarea
          id="reviewNote"
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="w-full rounded-lg border border-[#032842]/15 bg-white px-3 py-2 text-sm text-[#032842] outline-none focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/25"
        />
      </div>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {actions.map((item) => (
          <button
            key={item.action}
            type="button"
            disabled={pendingAction !== null}
            onClick={() => void run(item.action)}
            className={`inline-flex h-9 items-center rounded-lg border px-3 text-sm font-medium transition-colors disabled:opacity-50 ${item.className}`}
          >
            {pendingAction === item.action ? "Saving…" : item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
