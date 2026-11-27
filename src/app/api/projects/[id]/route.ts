import { NextResponse } from "next/server";

import {
  getProjectById,
  updateProject,
} from "@/lib/firebase/projects";
import { getProviderById } from "@/lib/firebase/providers";
import { getSessionContext } from "@/lib/firebase/session-context";
import { projectUpdateSchema } from "@/lib/validations/project";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSessionContext();
  if (!session?.isStaff) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const project = await getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = projectUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  let contractorId = project.contractorId;
  let contractorName = project.contractorName;
  let contractorOwnerUid = project.contractorOwnerUid;

  if (parsed.data.contractorId) {
    const provider = await getProviderById(parsed.data.contractorId);
    if (!provider || provider.verificationStatus !== "verified") {
      return NextResponse.json(
        { error: "Select a verified contractor." },
        { status: 400 },
      );
    }
    contractorId = provider.id;
    contractorName = provider.companyName;
    contractorOwnerUid = provider.ownerUid;
  }

  try {
    await updateProject({
      projectId: id,
      status: parsed.data.status,
      notes:
        parsed.data.notes !== undefined
          ? parsed.data.notes.trim() || null
          : undefined,
      contractorId: parsed.data.contractorId ? contractorId : undefined,
      contractorName: parsed.data.contractorId ? contractorName : undefined,
      contractorOwnerUid: parsed.data.contractorId
        ? contractorOwnerUid
        : undefined,
    });

    return NextResponse.json({ ok: true, status: parsed.data.status });
  } catch (error) {
    console.error("[api/projects/id] update failed", error);
    return NextResponse.json(
      { error: "Unable to update project." },
      { status: 502 },
    );
  }
}
