import "server-only";

import { FieldValue, type Timestamp } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { awaitRequestIo } from "@/lib/firebase/request-io";
import type {
  ProfileRole,
  ProfileStatus,
} from "@/lib/validations/user-access";

export type { ProfileRole, ProfileStatus };
export {
  profileRoleLabels,
  profileStatusLabels,
} from "@/lib/validations/user-access";

export type UserProfile = {
  uid: string;
  email: string | null;
  fullName: string;
  status: ProfileStatus;
  roles: ProfileRole[];
  providerId: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

export function parseAllowlist() {
  return (process.env.ADMIN_EMAIL_ALLOWLIST ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowlistedEmail(email: string | null | undefined) {
  if (!email) return false;
  return parseAllowlist().includes(email.trim().toLowerCase());
}

function mapProfile(
  uid: string,
  data: FirebaseFirestore.DocumentData,
): UserProfile {
  const roles = Array.isArray(data.roles)
    ? (data.roles.filter(
        (role): role is ProfileRole =>
          role === "staff" || role === "admin" || role === "contractor",
      ) as ProfileRole[])
    : [];

  return {
    uid,
    email: typeof data.email === "string" ? data.email : null,
    fullName: String(data.fullName ?? ""),
    status: (data.status ?? "pending") as ProfileStatus,
    roles,
    providerId:
      typeof data.providerId === "string" ? data.providerId : null,
    createdAt: (data.createdAt as Timestamp | null | undefined) ?? null,
    updatedAt: (data.updatedAt as Timestamp | null | undefined) ?? null,
  };
}

export async function getUserProfile(uid: string) {
  await awaitRequestIo();
  const db = getAdminFirestore();
  const doc = await db.collection("profiles").doc(uid).get();
  if (!doc.exists) return null;
  return mapProfile(uid, doc.data()!);
}

export async function listProfiles(options?: { limit?: number }) {
  await awaitRequestIo();
  const db = getAdminFirestore();
  const limit = options?.limit ?? 200;
  const snap = await db.collection("profiles").limit(limit).get();

  return snap.docs
    .map((doc) => mapProfile(doc.id, doc.data()))
    .sort((a, b) => {
      const aMs = a.createdAt?.toMillis?.() ?? 0;
      const bMs = b.createdAt?.toMillis?.() ?? 0;
      return bMs - aMs;
    });
}

export async function ensureUserProfile(input: {
  uid: string;
  email: string | null;
  fullName: string;
  roles?: ProfileRole[];
  status?: ProfileStatus;
  providerId?: string | null;
}) {
  const db = getAdminFirestore();
  const ref = db.collection("profiles").doc(input.uid);
  const existing = await ref.get();

  if (existing.exists) {
    await ref.set(
      {
        email: input.email,
        fullName: input.fullName,
        ...(input.roles ? { roles: input.roles } : {}),
        ...(input.status ? { status: input.status } : {}),
        ...(input.providerId !== undefined
          ? { providerId: input.providerId }
          : {}),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return mapProfile(input.uid, {
      ...existing.data(),
      email: input.email,
      fullName: input.fullName,
      ...(input.roles ? { roles: input.roles } : {}),
      ...(input.status ? { status: input.status } : {}),
      ...(input.providerId !== undefined
        ? { providerId: input.providerId }
        : {}),
    });
  }

  const allowlisted = isAllowlistedEmail(input.email);
  const roles =
    input.roles ??
    (allowlisted ? (["admin", "staff"] as ProfileRole[]) : ["staff"]);
  const status = input.status ?? (allowlisted ? "active" : "pending");

  const profile = {
    email: input.email,
    fullName: input.fullName,
    status,
    roles,
    providerId: input.providerId ?? null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  await ref.set(profile);
  return mapProfile(input.uid, profile);
}

export async function setProfileStatus(uid: string, status: ProfileStatus) {
  const db = getAdminFirestore();
  await db.collection("profiles").doc(uid).set(
    {
      status,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

export async function updateUserAccess(input: {
  uid: string;
  status: ProfileStatus;
  roles: ProfileRole[];
}) {
  const db = getAdminFirestore();
  await db.collection("profiles").doc(input.uid).set(
    {
      status: input.status,
      roles: input.roles,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

/** Active staff or admin only — pending/disabled cannot access admin dashboard. */
export function isStaffProfile(profile: UserProfile | null | undefined) {
  if (!profile) return false;
  if (profile.status !== "active") return false;
  return profile.roles.includes("staff") || profile.roles.includes("admin");
}

export function isAdminProfile(profile: UserProfile | null | undefined) {
  if (!profile) return false;
  if (profile.status !== "active") return false;
  return profile.roles.includes("admin");
}

export function isContractorProfile(profile: UserProfile | null | undefined) {
  if (!profile) return false;
  if (profile.status === "disabled") return false;
  return profile.roles.includes("contractor");
}

export function isPendingAccess(profile: UserProfile | null | undefined) {
  if (!profile) return true;
  return profile.status === "pending";
}
