import { NextResponse } from "next/server";

import {
  getProviderById,
  updateProviderVerification,
} from "@/lib/firebase/providers";
import { setProfileStatus } from "@/lib/firebase/profiles";
import { getSessionContext } from "@/lib/firebase/session-context";
import {
  providerReviewActionSchema,
  type ProviderVerificationStatus,
} from "@/lib/validations/provider";

const actionToStatus: Record<
  "mark_in_review" | "request_info" | "verify" | "reject" | "suspend",
  ProviderVerificationStatus
> = {
  mark_in_review: "in_review",
  request_info: "needs_info",
  verify: "verified",
  reject: "rejected",
  suspend: "suspended",
};

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSessionContext();
  if (!session?.isStaff) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const provider = await getProviderById(id);
  if (!provider) {
    return NextResponse.json({ error: "Provider not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = providerReviewActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const status = actionToStatus[parsed.data.action];

  try {
    await updateProviderVerification({
      providerId: id,
      status,
      note: parsed.data.note ?? null,
      reviewedByUid: session.user.uid,
    });

    if (status === "verified") {
      await setProfileStatus(provider.ownerUid, "active");
    } else if (status === "rejected" || status === "suspended") {
      await setProfileStatus(provider.ownerUid, "disabled");
    } else if (status === "needs_info" || status === "in_review") {
      await setProfileStatus(provider.ownerUid, "pending");
    }

    return NextResponse.json({ ok: true, status });
  } catch (error) {
    console.error("[api/providers/review] failed", error);
    return NextResponse.json(
      { error: "Unable to update verification status." },
      { status: 502 },
    );
  }
}
