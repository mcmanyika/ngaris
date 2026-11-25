import "server-only";

/**
 * Notifies authorized administrators of a new enquiry.
 * Uses Resend when configured; otherwise logs a structured event.
 */
export async function notifyAdminsOfLead(input: {
  fullName: string;
  email: string;
  projectType?: string;
  country?: string;
  leadId: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.LEAD_NOTIFY_EMAIL;

  if (!apiKey || !from || !to) {
    console.info("[lead-notify] New lead received (email not configured)", {
      leadId: input.leadId,
      email: input.email,
      projectType: input.projectType,
    });
    return { delivered: false as const, reason: "email_not_configured" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `New Ngaris Managed enquiry — ${input.fullName}`,
      text: [
        "A new consultation enquiry was submitted.",
        "",
        `Lead ID: ${input.leadId}`,
        `Name: ${input.fullName}`,
        `Email: ${input.email}`,
        `Country: ${input.country ?? "—"}`,
        `Project type: ${input.projectType ?? "—"}`,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[lead-notify] Resend delivery failed", detail);
    return { delivered: false as const, reason: "delivery_failed" };
  }

  return { delivered: true as const };
}
