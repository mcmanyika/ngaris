"use client";

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { getAuthErrorMessage } from "@/lib/firebase/auth-errors";
import { getClientAuth } from "@/lib/firebase/client";
import {
  providerTradeLabels,
  providerTrades,
  type ProviderApplyFormInput,
} from "@/lib/validations/provider";

const fieldClass =
  "h-11 w-full rounded-lg border border-white/20 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/25";

const selectClass = `${fieldClass} appearance-none`;

const emptyForm: ProviderApplyFormInput = {
  fullName: "",
  companyName: "",
  email: "",
  phone: "",
  city: "",
  trade: "general_contractor",
  yearsExperience: "",
  about: "",
  companyWebsite: "",
};

export function ContractorApplyForm() {
  const router = useRouter();
  const [form, setForm] = useState<ProviderApplyFormInput>(emptyForm);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function update<K extends keyof ProviderApplyFormInput>(
    key: K,
    value: ProviderApplyFormInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    setPending(true);

    try {
      const auth = getClientAuth();
      const credential = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        password,
      );

      await updateProfile(credential.user, {
        displayName: form.fullName.trim(),
      });

      const idToken = await credential.user.getIdToken(true);
      const response = await fetch("/api/providers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          ...form,
          fullName: form.fullName.trim(),
          companyName: form.companyName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          about: form.about.trim(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        destination?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Application failed.");
      }

      router.replace(payload?.destination ?? "/contractor");
      router.refresh();
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="relative space-y-4" onSubmit={onSubmit} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Contact name" htmlFor="fullName">
          <input
            id="fullName"
            required
            minLength={2}
            value={form.fullName}
            onChange={(event) => update("fullName", event.target.value)}
            className={fieldClass}
            autoComplete="name"
          />
        </Field>
        <Field label="Company / trading name" htmlFor="companyName">
          <input
            id="companyName"
            required
            minLength={2}
            value={form.companyName}
            onChange={(event) => update("companyName", event.target.value)}
            className={fieldClass}
            autoComplete="organization"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            className={fieldClass}
            autoComplete="email"
          />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <input
            id="phone"
            type="tel"
            required
            minLength={7}
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={fieldClass}
            autoComplete="tel"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Primary city" htmlFor="city">
          <input
            id="city"
            required
            minLength={2}
            value={form.city}
            onChange={(event) => update("city", event.target.value)}
            className={fieldClass}
            placeholder="e.g. Harare"
          />
        </Field>
        <Field label="Primary trade" htmlFor="trade">
          <select
            id="trade"
            required
            value={form.trade}
            onChange={(event) =>
              update(
                "trade",
                event.target.value as ProviderApplyFormInput["trade"],
              )
            }
            className={selectClass}
          >
            {providerTrades.map((trade) => (
              <option key={trade} value={trade} className="bg-[#032842]">
                {providerTradeLabels[trade]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Years experience (optional)" htmlFor="yearsExperience">
        <input
          id="yearsExperience"
          inputMode="numeric"
          value={form.yearsExperience}
          onChange={(event) => update("yearsExperience", event.target.value)}
          className={fieldClass}
          placeholder="e.g. 8"
        />
      </Field>

      <Field label="About your work" htmlFor="about">
        <textarea
          id="about"
          required
          minLength={20}
          rows={4}
          value={form.about}
          onChange={(event) => update("about", event.target.value)}
          className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#EDB254] focus:ring-2 focus:ring-[#EDB254]/25"
          placeholder="Trades, recent projects, coverage areas, team size…"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Password" htmlFor="password">
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={fieldClass}
            autoComplete="new-password"
          />
        </Field>
        <Field label="Confirm password" htmlFor="confirmPassword">
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={fieldClass}
            autoComplete="new-password"
          />
        </Field>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
      >
        <label htmlFor="companyWebsite">Company website</label>
        <input
          id="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          value={form.companyWebsite}
          onChange={(event) => update("companyWebsite", event.target.value)}
        />
      </div>

      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#EDB254] text-sm font-semibold text-[#032842] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Submitting…" : "Submit application"}
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
      <label htmlFor={htmlFor} className="text-sm font-medium text-white">
        {label}
      </label>
      {children}
    </div>
  );
}
