import "server-only";

/**
 * Notifies admins of a new contractor application.
 * Uses Resend when configured; otherwise logs a structured event.
 */
export async function notifyAdminsOfProviderApplication(input: {
  providerId: string;
  companyName: string;
  contactName: string;
  email: string;
  trade: string;
  city: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.LEAD_NOTIFY_EMAIL;

  if (!apiKey || !from || !to) {
    console.info(
      "[provider-notify] New provider application (email not configured)",
      {
        providerId: input.providerId,
        email: input.email,
        trade: input.trade,
      },
    );
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
      subject: `New contractor application — ${input.companyName}`,
      text: [
        "A contractor applied for verification.",
        "",
        `Contractor ID: ${input.providerId}`,
        `Company: ${input.companyName}`,
        `Contact: ${input.contactName}`,
        `Email: ${input.email}`,
        `Trade: ${input.trade}`,
        `City: ${input.city}`,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[provider-notify] Resend delivery failed", detail);
    return { delivered: false as const, reason: "delivery_failed" };
  }

  return { delivered: true as const };
}
