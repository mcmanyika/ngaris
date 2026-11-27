import { NextResponse } from "next/server";

import {
  getUserProfile,
  updateUserAccess,
} from "@/lib/firebase/profiles";
import { getSessionContext } from "@/lib/firebase/session-context";
import { userAccessUpdateSchema } from "@/lib/validations/user-access";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSessionContext();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  if (id === session.user.uid) {
    return NextResponse.json(
      { error: "You cannot change your own access from here." },
      { status: 400 },
    );
  }

  const existing = await getUserProfile(id);
  if (!existing) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = userAccessUpdateSchema.safeParse(body);
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
    await updateUserAccess({
      uid: id,
      status: parsed.data.status,
      roles: parsed.data.roles,
    });
    return NextResponse.json({
      ok: true,
      status: parsed.data.status,
      roles: parsed.data.roles,
    });
  } catch (error) {
    console.error("[api/users/id] update failed", error);
    return NextResponse.json(
      { error: "Unable to update user access." },
      { status: 502 },
    );
  }
}
