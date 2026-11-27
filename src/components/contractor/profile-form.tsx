"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import {
  providerTradeLabels,
  providerTrades,
  type ProviderProfileUpdateInput,
} from "@/lib/validations/provider";

const fieldClass =
  "h-10 w-full rounded-lg border border-[#032842]/15 bg-white px-3 text-sm text-[#032842] outline-none focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/25";

export function ContractorProfileForm({
  initial,
  locked,
}: {
  initial: ProviderProfileUpdateInput & { email: string };
  locked?: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProviderProfileUpdateInput>({
    contactName: initial.contactName,
    companyName: initial.companyName,
    phone: initial.phone,
    city: initial.city,
    trade: initial.trade,
    yearsExperience: initial.yearsExperience,
    about: initial.about,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function update<K extends keyof ProviderProfileUpdateInput>(
    key: K,
    value: ProviderProfileUpdateInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked) return;

    setError(null);
    setSuccess(null);
    setPending(true);

    try {
      const response = await fetch("/api/providers/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        resubmitted?: boolean;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Update failed.");
      }

      setSuccess(payload?.resubmitted ? "Sent for review." : "Saved.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      {locked ? (
        <p className="rounded-lg border border-[#032842]/10 bg-[#F4F7FA] px-3 py-2 text-sm text-[#032842]/65">
          Editing locked.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Contact name" htmlFor="contactName">
          <input
            id="contactName"
            required
            disabled={locked}
            value={form.contactName}
            onChange={(event) => update("contactName", event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field label="Company / trading name" htmlFor="companyName">
          <input
            id="companyName"
            required
            disabled={locked}
            value={form.companyName}
            onChange={(event) => update("companyName", event.target.value)}
            className={fieldClass}
          />
        </Field>
      </div>

      <Field label="Email" htmlFor="email">
        <input
          id="email"
          value={initial.email}
          disabled
          className={`${fieldClass} bg-[#F4F7FA] text-[#032842]/55`}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" htmlFor="phone">
          <input
            id="phone"
            required
            disabled={locked}
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field label="Primary city" htmlFor="city">
          <input
            id="city"
            required
            disabled={locked}
            value={form.city}
            onChange={(event) => update("city", event.target.value)}
            className={fieldClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Primary trade" htmlFor="trade">
          <select
            id="trade"
            required
            disabled={locked}
            value={form.trade}
            onChange={(event) =>
              update(
                "trade",
                event.target.value as ProviderProfileUpdateInput["trade"],
              )
            }
            className={fieldClass}
          >
            {providerTrades.map((trade) => (
              <option key={trade} value={trade}>
                {providerTradeLabels[trade]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Years experience" htmlFor="yearsExperience">
          <input
            id="yearsExperience"
            inputMode="numeric"
            disabled={locked}
            value={form.yearsExperience}
            onChange={(event) => update("yearsExperience", event.target.value)}
            className={fieldClass}
            placeholder="e.g. 8"
          />
        </Field>
      </div>

      <Field label="About your work" htmlFor="about">
        <textarea
          id="about"
          required
          rows={5}
          disabled={locked}
          value={form.about}
          onChange={(event) => update("about", event.target.value)}
          className="w-full rounded-lg border border-[#032842]/15 bg-white px-3 py-2.5 text-sm text-[#032842] outline-none focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/25 disabled:bg-[#F4F7FA]"
        />
      </Field>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="text-sm text-emerald-700" role="status">
          {success}
        </p>
      ) : null}

      {!locked ? (
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center rounded-lg bg-[#EDB254] px-5 text-sm font-semibold text-[#032842] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
      ) : null}
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
      <label htmlFor={htmlFor} className="text-sm font-medium text-[#032842]">
        {label}
      </label>
      {children}
    </div>
  );
}
