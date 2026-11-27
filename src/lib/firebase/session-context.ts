import "server-only";

import {
  getUserProfile,
  isAdminProfile,
  isContractorProfile,
  isPendingAccess,
  isStaffProfile,
  type UserProfile,
} from "@/lib/firebase/profiles";
import { getVerifiedSession, type SessionUser } from "@/lib/firebase/session";

export type SessionContext = {
  user: SessionUser;
  profile: UserProfile | null;
  isStaff: boolean;
  isAdmin: boolean;
  isContractor: boolean;
  isPending: boolean;
};

export async function getSessionContext(): Promise<SessionContext | null> {
  const user = await getVerifiedSession();
  if (!user) return null;

  const profile = await getUserProfile(user.uid);
  return {
    user,
    profile,
    isStaff: isStaffProfile(profile),
    isAdmin: isAdminProfile(profile),
    isContractor: isContractorProfile(profile),
    isPending: isPendingAccess(profile),
  };
}

export function destinationForSession(ctx: SessionContext) {
  if (ctx.isPending) return "/admin/pending";
  if (ctx.isStaff) return "/admin";
  if (ctx.isContractor) return "/contractor";
  return "/";
}
