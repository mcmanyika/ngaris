import "server-only";

import { FieldValue, type Timestamp } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { awaitRequestIo } from "@/lib/firebase/request-io";
import type { LeadStatus } from "@/lib/validations/lead";

export type { LeadStatus };

export type LeadInsert = {
  fullName: string;
  email: string;
  phone: string | null;
  country: string | null;
  projectType: string | null;
  location: string | null;
  budgetRange: string | null;
  message: string;
  source: string;
  status: LeadStatus;
  metadata: {
    ip: string;
    userAgent: string | null;
  };
};

export type LeadRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  country: string | null;
  projectType: string | null;
  location: string | null;
  budgetRange: string | null;
  message: string;
  source: string;
  status: LeadStatus;
  staffNote: string | null;
  metadata: {
    ip: string;
    userAgent: string | null;
  } | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

function mapLead(id: string, data: FirebaseFirestore.DocumentData): LeadRecord {
  const metadata =
    data.metadata && typeof data.metadata === "object"
      ? {
          ip: String((data.metadata as { ip?: unknown }).ip ?? ""),
          userAgent:
            typeof (data.metadata as { userAgent?: unknown }).userAgent ===
            "string"
              ? ((data.metadata as { userAgent: string }).userAgent as string)
              : null,
        }
      : null;

  return {
    id,
    fullName: String(data.fullName ?? ""),
    email: String(data.email ?? ""),
    phone: typeof data.phone === "string" ? data.phone : null,
    country: typeof data.country === "string" ? data.country : null,
    projectType: typeof data.projectType === "string" ? data.projectType : null,
    location: typeof data.location === "string" ? data.location : null,
    budgetRange: typeof data.budgetRange === "string" ? data.budgetRange : null,
    message: String(data.message ?? ""),
    source: String(data.source ?? ""),
    status: (data.status ?? "new") as LeadStatus,
    staffNote: typeof data.staffNote === "string" ? data.staffNote : null,
    metadata,
    createdAt: (data.createdAt as Timestamp | null | undefined) ?? null,
    updatedAt: (data.updatedAt as Timestamp | null | undefined) ?? null,
  };
}

export async function createLead(input: LeadInsert) {
  const db = getAdminFirestore();
  const ref = await db.collection("leads").add({
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    country: input.country,
    projectType: input.projectType,
    location: input.location,
    budgetRange: input.budgetRange,
    message: input.message,
    source: input.source,
    status: input.status,
    staffNote: null,
    metadata: input.metadata,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { id: ref.id };
}

export async function getLeadById(id: string) {
  await awaitRequestIo();
  const db = getAdminFirestore();
  const doc = await db.collection("leads").doc(id).get();
  if (!doc.exists) return null;
  return mapLead(doc.id, doc.data()!);
}

export async function listLeads(options?: {
  status?: LeadStatus;
  limit?: number;
}) {
  await awaitRequestIo();
  const db = getAdminFirestore();
  let query: FirebaseFirestore.Query = db.collection("leads");

  if (options?.status) {
    query = query.where("status", "==", options.status);
  }

  query = query.orderBy("createdAt", "desc").limit(options?.limit ?? 100);

  const snap = await query.get();
  return snap.docs.map((doc) => mapLead(doc.id, doc.data()));
}

export async function updateLeadStatus(input: {
  leadId: string;
  status: LeadStatus;
  staffNote?: string | null;
  updatedByUid: string;
}) {
  const db = getAdminFirestore();
  await db.collection("leads").doc(input.leadId).set(
    {
      status: input.status,
      ...(input.staffNote !== undefined ? { staffNote: input.staffNote } : {}),
      updatedByUid: input.updatedByUid,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}
