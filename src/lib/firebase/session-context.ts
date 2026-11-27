import "server-only";

import {
  getUserProfile,
  isContractorProfile,
  isStaffProfile,
  type UserProfile,
} from "@/lib/firebase/profiles";
import { getVerifiedSession, type SessionUser } from "@/lib/firebase/session";

export type SessionContext = {
  user: SessionUser;
  profile: UserProfile | null;
  isStaff: boolean;
  isContractor: boolean;
};

export async function getSessionContext(): Promise<SessionContext | null> {
  const user = await getVerifiedSession();
  if (!user) return null;

  const profile = await getUserProfile(user.uid);
  return {
    user,
    profile,
    isStaff: isStaffProfile(profile),
    isContractor: isContractorProfile(profile),
  };
}

export function destinationForSession(ctx: SessionContext) {
  if (ctx.isStaff) return "/admin";
  if (ctx.isContractor) return "/contractor";
  return "/";
}
