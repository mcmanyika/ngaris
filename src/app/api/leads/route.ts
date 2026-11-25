import { NextResponse } from "next/server";

import { notifyAdminsOfLead } from "@/lib/notifications/lead-notify";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { consultationLeadApiSchema } from "@/lib/validations/lead";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`leads:${ip}`, 5, 15 * 60 * 1000);

  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, Math.ceil((limited.resetAt - Date.now()) / 1000)),
          ),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = consultationLeadApiSchema.safeParse(body);
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

  if (data.companyWebsite && data.companyWebsite.length > 0) {
    return NextResponse.json({ ok: true });
  }

  try {
    const supabase = createAdminClient();
    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        full_name: data.fullName,
        email: data.email.toLowerCase(),
        phone: data.phone ?? null,
        country: data.country ?? null,
        project_type: data.projectType ?? null,
        location: data.location ?? null,
        budget_range: data.budgetRange ?? null,
        message: data.message,
        source: "landing_consultation",
        status: "new",
        metadata: {
          ip,
          userAgent: request.headers.get("user-agent"),
        },
      })
      .select("id")
      .single();

    if (error || !lead) {
      console.error("[api/leads] insert failed", error);
      return NextResponse.json(
        { error: "Unable to save your enquiry right now." },
        { status: 502 },
      );
    }

    await notifyAdminsOfLead({
      leadId: lead.id,
      fullName: data.fullName,
      email: data.email,
      projectType: data.projectType,
      country: data.country,
    });

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("[api/leads] unexpected error", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message.includes("SUPABASE_SECRET_KEY")
            ? "Lead capture is not configured yet."
            : "Unable to save your enquiry right now.",
      },
      { status: 503 },
    );
  }
}
