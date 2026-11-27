import "server-only";

import { FieldValue, type Timestamp } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { awaitRequestIo } from "@/lib/firebase/request-io";
import type {
  ProviderApplyApiInput,
  ProviderVerificationStatus,
} from "@/lib/validations/provider";

export type ProviderRecord = {
  id: string;
  ownerUid: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  trade: string;
  yearsExperience: number | null;
  about: string;
  verificationStatus: ProviderVerificationStatus;
  reviewNote: string | null;
  reviewedAt: Timestamp | null;
  reviewedByUid: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

function mapProvider(
  id: string,
  data: FirebaseFirestore.DocumentData,
): ProviderRecord {
  return {
    id,
    ownerUid: String(data.ownerUid ?? ""),
    companyName: String(data.companyName ?? ""),
    contactName: String(data.contactName ?? ""),
    email: String(data.email ?? ""),
    phone: String(data.phone ?? ""),
    city: String(data.city ?? ""),
    trade: String(data.trade ?? ""),
    yearsExperience:
      typeof data.yearsExperience === "number" ? data.yearsExperience : null,
    about: String(data.about ?? ""),
    verificationStatus: (data.verificationStatus ??
      "submitted") as ProviderVerificationStatus,
    reviewNote:
      typeof data.reviewNote === "string" ? data.reviewNote : null,
    reviewedAt: (data.reviewedAt as Timestamp | null | undefined) ?? null,
    reviewedByUid:
      typeof data.reviewedByUid === "string" ? data.reviewedByUid : null,
    createdAt: (data.createdAt as Timestamp | null | undefined) ?? null,
    updatedAt: (data.updatedAt as Timestamp | null | undefined) ?? null,
  };
}

export async function createProviderApplication(input: {
  ownerUid: string;
  application: ProviderApplyApiInput;
}) {
  const db = getAdminFirestore();
  const ref = await db.collection("providers").add({
    ownerUid: input.ownerUid,
    companyName: input.application.companyName,
    contactName: input.application.fullName,
    email: input.application.email.toLowerCase(),
    phone: input.application.phone,
    city: input.application.city,
    trade: input.application.trade,
    yearsExperience: input.application.yearsExperience ?? null,
    about: input.application.about,
    verificationStatus: "submitted" satisfies ProviderVerificationStatus,
    reviewNote: null,
    reviewedAt: null,
    reviewedByUid: null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { id: ref.id };
}

export async function getProviderByOwnerUid(ownerUid: string) {
  await awaitRequestIo();
  const db = getAdminFirestore();
  const snap = await db
    .collection("providers")
    .where("ownerUid", "==", ownerUid)
    .limit(1)
    .get();

  if (snap.empty) return null;
  const doc = snap.docs[0];
  return mapProvider(doc.id, doc.data());
}

export async function getProviderById(id: string) {
  await awaitRequestIo();
  const db = getAdminFirestore();
  const doc = await db.collection("providers").doc(id).get();
  if (!doc.exists) return null;
  return mapProvider(doc.id, doc.data()!);
}

export async function listProviders(options?: {
  status?: ProviderVerificationStatus;
  limit?: number;
}) {
  await awaitRequestIo();
  const db = getAdminFirestore();
  let query: FirebaseFirestore.Query = db.collection("providers");

  if (options?.status) {
    query = query.where("verificationStatus", "==", options.status);
  }

  query = query.orderBy("createdAt", "desc").limit(options?.limit ?? 100);

  const snap = await query.get();
  return snap.docs.map((doc) => mapProvider(doc.id, doc.data()));
}

export async function updateProviderVerification(input: {
  providerId: string;
  status: ProviderVerificationStatus;
  note?: string | null;
  reviewedByUid: string;
}) {
  const db = getAdminFirestore();
  await db.collection("providers").doc(input.providerId).set(
    {
      verificationStatus: input.status,
      reviewNote: input.note ?? null,
      reviewedAt: FieldValue.serverTimestamp(),
      reviewedByUid: input.reviewedByUid,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

export async function updateProviderProfile(input: {
  providerId: string;
  contactName: string;
  companyName: string;
  phone: string;
  city: string;
  trade: string;
  yearsExperience: number | null;
  about: string;
  /** When contractor responds to needs_info, bump back into the queue. */
  resubmitForReview?: boolean;
}) {
  const db = getAdminFirestore();
  await db.collection("providers").doc(input.providerId).set(
    {
      contactName: input.contactName,
      companyName: input.companyName,
      phone: input.phone,
      city: input.city,
      trade: input.trade,
      yearsExperience: input.yearsExperience,
      about: input.about,
      ...(input.resubmitForReview
        ? {
            verificationStatus: "submitted" satisfies ProviderVerificationStatus,
            reviewNote: null,
          }
        : {}),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}
