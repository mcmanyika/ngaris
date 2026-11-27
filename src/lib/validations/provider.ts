import { z } from "zod";

export const providerTrades = [
  "general_contractor",
  "structural",
  "electrical",
  "plumbing",
  "finishing",
  "landscaping",
  "other",
] as const;

export const providerTradeLabels: Record<(typeof providerTrades)[number], string> =
  {
    general_contractor: "General contractor",
    structural: "Structural / civil",
    electrical: "Electrical",
    plumbing: "Plumbing",
    finishing: "Finishing / fit-out",
    landscaping: "Landscaping",
    other: "Other trade",
  };

export const providerVerificationStatuses = [
  "submitted",
  "in_review",
  "needs_info",
  "verified",
  "rejected",
  "suspended",
] as const;

export type ProviderVerificationStatus =
  (typeof providerVerificationStatuses)[number];

export const providerVerificationLabels: Record<
  ProviderVerificationStatus,
  string
> = {
  submitted: "Submitted",
  in_review: "In review",
  needs_info: "Needs info",
  verified: "Verified",
  rejected: "Rejected",
  suspended: "Suspended",
};

/** Public apply form (browser). */
export const providerApplyFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120),
  companyName: z
    .string()
    .trim()
    .min(2, "Enter your company or trading name.")
    .max(160),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number looks incomplete.")
    .max(32),
  city: z.string().trim().min(2, "Enter your primary city.").max(80),
  trade: z.enum(providerTrades, {
    message: "Select a primary trade.",
  }),
  yearsExperience: z
    .string()
    .trim()
    .max(8)
    .refine((value) => value === "" || /^\d{1,2}$/.test(value), {
      message: "Use a whole number of years.",
    }),
  about: z
    .string()
    .trim()
    .min(20, "Tell us a bit more about your work (20+ characters).")
    .max(4000),
  companyWebsite: z.string(),
});

export type ProviderApplyFormInput = z.infer<typeof providerApplyFormSchema>;

/** API payload after honeypot cleared. */
export const providerApplyApiSchema = providerApplyFormSchema
  .omit({ companyWebsite: true })
  .extend({
    yearsExperience: z.number().int().min(0).max(80).optional(),
  });

export type ProviderApplyApiInput = z.infer<typeof providerApplyApiSchema>;

export function normalizeProviderApplyPayload(
  data: ProviderApplyFormInput,
): ProviderApplyApiInput {
  const years =
    data.yearsExperience.trim().length > 0
      ? Number.parseInt(data.yearsExperience, 10)
      : undefined;

  return providerApplyApiSchema.parse({
    fullName: data.fullName,
    companyName: data.companyName,
    email: data.email,
    phone: data.phone,
    city: data.city,
    trade: data.trade,
    yearsExperience:
      years !== undefined && Number.isFinite(years) ? years : undefined,
    about: data.about,
  });
}

export const providerReviewActionSchema = z.object({
  action: z.enum([
    "mark_in_review",
    "request_info",
    "verify",
    "reject",
    "suspend",
  ]),
  note: z.string().trim().max(2000).optional(),
});

export type ProviderReviewActionInput = z.infer<
  typeof providerReviewActionSchema
>;

/** Contractor self-serve profile edit. */
export const providerProfileUpdateSchema = z.object({
  contactName: z.string().trim().min(2).max(120),
  companyName: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(7).max(32),
  city: z.string().trim().min(2).max(80),
  trade: z.enum(providerTrades),
  yearsExperience: z
    .string()
    .trim()
    .max(8)
    .refine((value) => value === "" || /^\d{1,2}$/.test(value), {
      message: "Use a whole number of years.",
    }),
  about: z.string().trim().min(20).max(4000),
});

export type ProviderProfileUpdateInput = z.infer<
  typeof providerProfileUpdateSchema
>;
