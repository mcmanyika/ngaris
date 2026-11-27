import { NextResponse } from "next/server";

import { createProject } from "@/lib/firebase/projects";
import { getProviderById } from "@/lib/firebase/providers";
import { getSessionContext } from "@/lib/firebase/session-context";
import { projectCreateSchema } from "@/lib/validations/project";

export async function POST(request: Request) {
  const session = await getSessionContext();
  if (!session?.isStaff) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = projectCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const provider = await getProviderById(data.contractorId);
  if (!provider || provider.verificationStatus !== "verified") {
    return NextResponse.json(
      { error: "Select a verified contractor." },
      { status: 400 },
    );
  }

  try {
    const created = await createProject({
      title: data.title,
      location: data.location,
      clientName: data.clientName,
      clientEmail: data.clientEmail?.trim() ? data.clientEmail.trim() : null,
      clientPhone: data.clientPhone?.trim() ? data.clientPhone.trim() : null,
      contractorId: provider.id,
      contractorName: provider.companyName,
      contractorOwnerUid: provider.ownerUid,
      status: data.status,
      notes: data.notes?.trim() ? data.notes.trim() : null,
      createdByUid: session.user.uid,
    });

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (error) {
    console.error("[api/projects] create failed", error);
    return NextResponse.json(
      { error: "Unable to create project." },
      { status: 502 },
    );
  }
}
