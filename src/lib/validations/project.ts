import { z } from "zod";

export const projectStatuses = [
  "draft",
  "active",
  "on_hold",
  "completed",
  "cancelled",
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export const projectStatusLabels: Record<ProjectStatus, string> = {
  draft: "Draft",
  active: "Active",
  on_hold: "On hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const projectCreateSchema = z.object({
  title: z.string().trim().min(3, "Enter a project title.").max(160),
  location: z.string().trim().min(2, "Enter a location.").max(120),
  clientName: z.string().trim().min(2, "Enter the client name.").max(120),
  clientEmail: z.union([
    z.literal(""),
    z.string().trim().email("Enter a valid email.").max(254),
  ]),
  clientPhone: z.string().trim().max(32),
  contractorId: z.string().trim().min(1, "Select a verified contractor."),
  notes: z.string().trim().max(4000),
  status: z.enum(projectStatuses),
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;

export const projectUpdateSchema = z.object({
  status: z.enum(projectStatuses),
  notes: z.string().trim().max(4000).optional(),
  contractorId: z.string().trim().min(1).optional(),
});

export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
