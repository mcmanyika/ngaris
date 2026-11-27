import { NextResponse } from "next/server";

import { getLeadById, updateLeadStatus } from "@/lib/firebase/leads";
import { getSessionContext } from "@/lib/firebase/session-context";
import { leadStatusUpdateSchema } from "@/lib/validations/lead";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSessionContext();
  if (!session?.isStaff) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const lead = await getLeadById(id);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = leadStatusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    await updateLeadStatus({
      leadId: id,
      status: parsed.data.status,
      staffNote: parsed.data.staffNote,
      updatedByUid: session.user.uid,
    });

    return NextResponse.json({ ok: true, status: parsed.data.status });
  } catch (error) {
    console.error("[api/leads/id] update failed", error);
    return NextResponse.json(
      { error: "Unable to update lead." },
      { status: 502 },
    );
  }
}
