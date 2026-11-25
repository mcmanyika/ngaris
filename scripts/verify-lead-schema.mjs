import assert from "node:assert/strict";
import { z } from "zod";

const leadProjectTypes = [
  "residential_build",
  "renovation",
  "commercial",
  "project_oversight",
  "other",
];

const leadBudgetRanges = [
  "under_50k",
  "50k_150k",
  "150k_500k",
  "500k_plus",
  "undecided",
];

const schema = z.object({
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

const valid = schema.safeParse({
  fullName: "Amai Chipo",
  email: "amai@example.com",
  message: "Looking to build in Borrowdale next year.",
  projectType: "residential_build",
});
assert.equal(valid.success, true);

const invalid = schema.safeParse({
  fullName: "A",
  email: "not-an-email",
  message: "short",
});
assert.equal(invalid.success, false);

console.log("lead schema verification passed");
