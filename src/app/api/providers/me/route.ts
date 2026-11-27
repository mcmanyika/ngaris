import { NextResponse } from "next/server";

import {
  getProviderByOwnerUid,
  updateProviderProfile,
} from "@/lib/firebase/providers";
import { ensureUserProfile } from "@/lib/firebase/profiles";
import { getSessionContext } from "@/lib/firebase/session-context";
import { providerProfileUpdateSchema } from "@/lib/validations/provider";

export async function PATCH(request: Request) {
  const session = await getSessionContext();
  if (!session?.isContractor) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const provider = await getProviderByOwnerUid(session.user.uid);
  if (!provider) {
    return NextResponse.json(
      { error: "No provider application found." },
      { status: 404 },
    );
  }

  if (
    provider.verificationStatus === "rejected" ||
    provider.verificationStatus === "suspended"
  ) {
    return NextResponse.json(
      { error: "This application can no longer be edited." },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = providerProfileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const years =
    parsed.data.yearsExperience.trim().length > 0
      ? Number.parseInt(parsed.data.yearsExperience, 10)
      : null;

  try {
    const resubmitForReview = provider.verificationStatus === "needs_info";

    await updateProviderProfile({
      providerId: provider.id,
      contactName: parsed.data.contactName,
      companyName: parsed.data.companyName,
      phone: parsed.data.phone,
      city: parsed.data.city,
      trade: parsed.data.trade,
      yearsExperience:
        years !== null && Number.isFinite(years) ? years : null,
      about: parsed.data.about,
      resubmitForReview,
    });

    await ensureUserProfile({
      uid: session.user.uid,
      email: session.user.email,
      fullName: parsed.data.contactName,
      status: resubmitForReview ? "pending" : undefined,
      providerId: provider.id,
    });

    return NextResponse.json({
      ok: true,
      resubmitted: resubmitForReview,
    });
  } catch (error) {
    console.error("[api/providers/me] failed", error);
    return NextResponse.json(
      { error: "Unable to update your profile." },
      { status: 502 },
    );
  }
}
