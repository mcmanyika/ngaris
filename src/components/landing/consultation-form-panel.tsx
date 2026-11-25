"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  consultationLeadFormSchema,
  leadBudgetRanges,
  leadProjectTypes,
  normalizeLeadPayload,
  type ConsultationLeadInput,
} from "@/lib/validations/lead";

const projectTypeLabels: Record<(typeof leadProjectTypes)[number], string> = {
  residential_build: "Residential build",
  renovation: "Renovation",
  commercial: "Commercial",
  project_oversight: "Find providers & manage",
  other: "Other",
};

const budgetLabels: Record<(typeof leadBudgetRanges)[number], string> = {
  under_50k: "Under USD 50k",
  "50k_150k": "USD 50k – 150k",
  "150k_500k": "USD 150k – 500k",
  "500k_plus": "USD 500k+",
  undecided: "Not sure yet",
};

const fieldControlClass =
  "border-white/25 bg-white/5 text-white placeholder:text-white/45 focus-visible:border-[#EDB254] focus-visible:ring-[#EDB254]/25";

const selectClass =
  "h-8 w-full rounded-lg border border-white/25 bg-white/5 px-2.5 text-sm text-white outline-none focus-visible:border-[#EDB254] focus-visible:ring-3 focus-visible:ring-[#EDB254]/25 [&>option]:bg-[#032842] [&>option]:text-white";

export function ConsultationFormPanel() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ConsultationLeadInput>({
    resolver: zodResolver(consultationLeadFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      country: "",
      location: "",
      message: "",
      companyWebsite: "",
      projectType: "",
      budgetRange: "",
    },
  });

  async function onSubmit(values: ConsultationLeadInput) {
    setServerError(null);

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizeLeadPayload(values)),
    });

    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    if (!response.ok) {
      setServerError(payload?.error ?? "Something went wrong. Please try again.");
      return;
    }

    reset();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex min-h-48 flex-col justify-center px-1 py-2">
        <p className="font-[family-name:var(--font-display)] text-2xl text-white">
          Enquiry received.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/75">
          We’ll follow up using the contact details you provided.
        </p>
        <button
          type="button"
          className="mt-6 self-start text-sm font-medium text-[#EDB254] underline underline-offset-4"
          onClick={() => setSubmitted(false)}
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      className="relative space-y-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.fullName?.message} htmlFor="fullName">
          <Input
            id="fullName"
            autoComplete="name"
            className={fieldControlClass}
            {...register("fullName")}
          />
        </Field>
        <Field label="Email" error={errors.email?.message} htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className={fieldControlClass}
            {...register("email")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" error={errors.phone?.message} htmlFor="phone">
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            className={fieldControlClass}
            {...register("phone")}
          />
        </Field>
        <Field label="Country" error={errors.country?.message} htmlFor="country">
          <Input
            id="country"
            autoComplete="country-name"
            className={fieldControlClass}
            {...register("country")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Project type"
          error={errors.projectType?.message}
          htmlFor="projectType"
        >
          <select id="projectType" className={selectClass} {...register("projectType")}>
            <option value="">Select…</option>
            {leadProjectTypes.map((type) => (
              <option key={type} value={type}>
                {projectTypeLabels[type]}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Budget"
          error={errors.budgetRange?.message}
          htmlFor="budgetRange"
        >
          <select id="budgetRange" className={selectClass} {...register("budgetRange")}>
            <option value="">Select…</option>
            {leadBudgetRanges.map((range) => (
              <option key={range} value={range}>
                {budgetLabels[range]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        label="Location in Zimbabwe"
        error={errors.location?.message}
        htmlFor="location"
      >
        <Input
          id="location"
          placeholder="e.g. Harare, Bulawayo"
          className={fieldControlClass}
          {...register("location")}
        />
      </Field>

      <Field label="Brief" error={errors.message?.message} htmlFor="message">
        <Textarea
          id="message"
          rows={4}
          placeholder="Scope, location, provider needs, timeline…"
          className={fieldControlClass}
          {...register("message")}
        />
      </Field>

      <div
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
      >
        <label htmlFor="companyWebsite">Company website</label>
        <input
          id="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          {...register("companyWebsite")}
        />
      </div>

      {serverError ? (
        <p className="text-sm text-red-300" role="alert">
          {serverError}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-10 w-full bg-[#EDB254] font-semibold text-[#032842] hover:bg-[#f2bc60] sm:w-auto sm:px-6"
      >
        {isSubmitting ? "Sending…" : "Request consultation"}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-white">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
