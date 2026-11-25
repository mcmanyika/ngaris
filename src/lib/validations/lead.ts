import { z } from "zod";

export const leadProjectTypes = [
  "residential_build",
  "renovation",
  "commercial",
  "project_oversight",
  "other",
] as const;

export const leadBudgetRanges = [
  "under_50k",
  "50k_150k",
  "150k_500k",
  "500k_plus",
  "undecided",
] as const;

/** Browser form values (empty strings allowed for optional selects/fields). */
export const consultationLeadFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "Name is too long."),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  phone: z
    .string()
    .trim()
    .max(32)
    .refine((value) => value.length === 0 || value.length >= 7, {
      message: "Phone number looks incomplete.",
    }),
  country: z.string().trim().max(80),
  projectType: z.union([z.enum(leadProjectTypes), z.literal("")]),
  location: z.string().trim().max(120),
  budgetRange: z.union([z.enum(leadBudgetRanges), z.literal("")]),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more about your project.")
    .max(4000, "Message is too long."),
  companyWebsite: z.string(),
});

export type ConsultationLeadInput = z.infer<typeof consultationLeadFormSchema>;

/** API payload after optional empty fields are cleared. */
export const consultationLeadApiSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(32).optional(),
  country: z.string().trim().min(2).max(80).optional(),
  projectType: z.enum(leadProjectTypes).optional(),
  location: z.string().trim().min(2).max(120).optional(),
  budgetRange: z.enum(leadBudgetRanges).optional(),
  message: z.string().trim().min(10).max(4000),
  companyWebsite: z.string().optional(),
});

export type ConsultationLeadApiInput = z.infer<typeof consultationLeadApiSchema>;

export function normalizeLeadPayload(
  data: ConsultationLeadInput,
): ConsultationLeadApiInput {
  return consultationLeadApiSchema.parse({
    fullName: data.fullName,
    email: data.email,
    phone: data.phone.length > 0 ? data.phone : undefined,
    country: data.country.length > 0 ? data.country : undefined,
    projectType: data.projectType === "" ? undefined : data.projectType,
    location: data.location.length > 0 ? data.location : undefined,
    budgetRange: data.budgetRange === "" ? undefined : data.budgetRange,
    message: data.message,
    companyWebsite: data.companyWebsite,
  });
}

/** @deprecated Use consultationLeadFormSchema */
export const consultationLeadSchema = consultationLeadFormSchema;
