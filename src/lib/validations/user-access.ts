import { z } from "zod";

export const profileStatuses = ["pending", "active", "disabled"] as const;
export const profileRoles = ["staff", "admin", "contractor"] as const;

export type ProfileStatus = (typeof profileStatuses)[number];
export type ProfileRole = (typeof profileRoles)[number];

export const profileStatusLabels: Record<ProfileStatus, string> = {
  pending: "Pending",
  active: "Active",
  disabled: "Disabled",
};

export const profileRoleLabels: Record<ProfileRole, string> = {
  staff: "Staff",
  admin: "Admin",
  contractor: "Contractor",
};

export const userAccessUpdateSchema = z.object({
  status: z.enum(profileStatuses),
  roles: z.array(z.enum(profileRoles)),
});

export type UserAccessUpdateInput = z.infer<typeof userAccessUpdateSchema>;
