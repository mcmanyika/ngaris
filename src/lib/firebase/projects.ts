import "server-only";

import { FieldValue, type Timestamp } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { awaitRequestIo } from "@/lib/firebase/request-io";
import type { ProjectStatus } from "@/lib/validations/project";

export type ProjectRecord = {
  id: string;
  title: string;
  location: string;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  contractorId: string | null;
  contractorName: string | null;
  contractorOwnerUid: string | null;
  status: ProjectStatus;
  notes: string | null;
  createdByUid: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

function mapProject(
  id: string,
  data: FirebaseFirestore.DocumentData,
): ProjectRecord {
  return {
    id,
    title: String(data.title ?? ""),
    location: String(data.location ?? ""),
    clientName: String(data.clientName ?? ""),
    clientEmail: typeof data.clientEmail === "string" ? data.clientEmail : null,
    clientPhone: typeof data.clientPhone === "string" ? data.clientPhone : null,
    contractorId:
      typeof data.contractorId === "string" ? data.contractorId : null,
    contractorName:
      typeof data.contractorName === "string" ? data.contractorName : null,
    contractorOwnerUid:
      typeof data.contractorOwnerUid === "string"
        ? data.contractorOwnerUid
        : null,
    status: (data.status ?? "draft") as ProjectStatus,
    notes: typeof data.notes === "string" ? data.notes : null,
    createdByUid: String(data.createdByUid ?? ""),
    createdAt: (data.createdAt as Timestamp | null | undefined) ?? null,
    updatedAt: (data.updatedAt as Timestamp | null | undefined) ?? null,
  };
}

export async function createProject(input: {
  title: string;
  location: string;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  contractorId: string | null;
  contractorName: string | null;
  contractorOwnerUid: string | null;
  status: ProjectStatus;
  notes: string | null;
  createdByUid: string;
}) {
  const db = getAdminFirestore();
  const ref = await db.collection("projects").add({
    title: input.title,
    location: input.location,
    clientName: input.clientName,
    clientEmail: input.clientEmail,
    clientPhone: input.clientPhone,
    contractorId: input.contractorId,
    contractorName: input.contractorName,
    contractorOwnerUid: input.contractorOwnerUid,
    status: input.status,
    notes: input.notes,
    createdByUid: input.createdByUid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { id: ref.id };
}

export async function getProjectById(id: string) {
  await awaitRequestIo();
  const db = getAdminFirestore();
  const doc = await db.collection("projects").doc(id).get();
  if (!doc.exists) return null;
  return mapProject(doc.id, doc.data()!);
}

export async function listProjects(options?: { limit?: number }) {
  await awaitRequestIo();
  const db = getAdminFirestore();
  const snap = await db
    .collection("projects")
    .orderBy("createdAt", "desc")
    .limit(options?.limit ?? 100)
    .get();

  return snap.docs.map((doc) => mapProject(doc.id, doc.data()));
}

export async function listProjectsByContractorOwnerUid(
  ownerUid: string,
  options?: { limit?: number },
) {
  await awaitRequestIo();
  const db = getAdminFirestore();
  const limit = options?.limit ?? 50;
  const snap = await db
    .collection("projects")
    .where("contractorOwnerUid", "==", ownerUid)
    .limit(limit)
    .get();

  return snap.docs
    .map((doc) => mapProject(doc.id, doc.data()))
    .sort((a, b) => {
      const aMs = a.createdAt?.toMillis?.() ?? 0;
      const bMs = b.createdAt?.toMillis?.() ?? 0;
      return bMs - aMs;
    });
}

export async function updateProject(input: {
  projectId: string;
  status: ProjectStatus;
  notes?: string | null;
  contractorId?: string | null;
  contractorName?: string | null;
  contractorOwnerUid?: string | null;
}) {
  const db = getAdminFirestore();
  await db.collection("projects").doc(input.projectId).set(
    {
      status: input.status,
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
      ...(input.contractorId !== undefined
        ? {
            contractorId: input.contractorId,
            contractorName: input.contractorName ?? null,
            contractorOwnerUid: input.contractorOwnerUid ?? null,
          }
        : {}),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}
