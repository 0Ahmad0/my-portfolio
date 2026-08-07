import { logger } from "./logger";

const RESEND_API = "https://api.resend.com/emails";

function getResendKey(): string | undefined {
  return process.env["RESEND_API_KEY"];
}

function getNotificationEmail(): string | undefined {
  return process.env["NOTIFICATION_EMAIL"];
}

export function isEmailConfigured(): boolean {
  return !!(getResendKey() && getNotificationEmail());
}

export async function sendEmailNotification(
  name: string,
  email: string,
  message: string,
): Promise<boolean> {
  const apiKey = getResendKey();
  const to = getNotificationEmail();
  const from = process.env["EMAIL_FROM"] || "onboarding@resend.dev";

  if (!apiKey || !to) {
    logger.warn("Email not configured — skipping notification");
    return false;
  }

  try {
    const html = [
      `<h2>📬 New Contact Message</h2>`,
      `<table style="width:100%;border-collapse:collapse;font-family:sans-serif">`,
      `  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;width:100px">Name</td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(name)}</td></tr>`,
      `  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>`,
      `  <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Message</td><td style="padding:8px;border:1px solid #ddd;white-space:pre-wrap">${escapeHtml(message)}</td></tr>`,
      `</table>`,
      `<hr><p style="color:#888;font-size:12px">Sent from your portfolio contact form</p>`,
    ].join("\n");

    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `📬 New message from ${name}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      logger.error({ error: err }, "Failed to send email notification");
      return false;
    }

    logger.info({ to }, "Email notification sent");
    return true;
  } catch (err) {
    logger.error({ err }, "Email send error");
    return false;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
