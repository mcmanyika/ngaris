import "server-only";

import { FieldValue, type Timestamp } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { awaitRequestIo } from "@/lib/firebase/request-io";

export type ProfileStatus = "pending" | "active" | "disabled";
export type ProfileRole = "staff" | "admin" | "contractor";

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

  const roles = input.roles ?? ["staff"];
  const status = input.status ?? "active";

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

export async function setProfileStatus(
  uid: string,
  status: ProfileStatus,
) {
  const db = getAdminFirestore();
  await db.collection("profiles").doc(uid).set(
    {
      status,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

export function isStaffProfile(profile: UserProfile | null | undefined) {
  if (!profile) return false;
  if (profile.status === "disabled") return false;
  if (profile.roles.includes("staff") || profile.roles.includes("admin")) {
    return true;
  }
  // Back-compat: early open registrations had empty roles.
  if (profile.roles.includes("contractor")) return false;
  return profile.roles.length === 0 && profile.status === "active";
}

export function isContractorProfile(profile: UserProfile | null | undefined) {
  if (!profile) return false;
  if (profile.status === "disabled") return false;
  return profile.roles.includes("contractor");
}
