import { Router, type IRouter, type Request, type Response } from "express";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { logger } from "../lib/logger";
import { escapeHtml } from "../lib/html";
import { isTelegramConfigured, sendTelegramMessage } from "../lib/telegram";
import { isEmailConfigured, sendEmailNotification } from "../lib/email";

const router: IRouter = Router();

const supabaseUrl = process.env["SUPABASE_URL"];
const supabaseKey = process.env["SUPABASE_SERVICE_KEY"];

// Built once; getSupabase() previously created a fresh client per request.
let supabaseClient: SupabaseClient | null | undefined;

function getSupabase() {
  if (supabaseClient === undefined) {
    supabaseClient =
      supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
  }
  return supabaseClient;
}

// Mirrors the contact_messages RLS policy in
// supabase/migrations/20260923120000_harden_contact_messages.sql, so the server
// and the DB reject the same payloads. Client-side validation is bypassable, so
// the bounds are enforced on both sides.
const MAX_NAME = 120;
const MAX_EMAIL = 255;
const MAX_MESSAGE = 5000;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function validateContact(body: unknown): string[] {
  const errors: string[] = [];
  const { name, email, message } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length < 1 || name.length > MAX_NAME)
    errors.push(`name must be 1-${MAX_NAME} characters`);
  if (typeof email !== "string" || !EMAIL_RE.test(email) || email.length > MAX_EMAIL)
    errors.push("email must be a valid address");
  if (typeof message !== "string" || message.trim().length < 1 || message.length > MAX_MESSAGE)
    errors.push(`message must be 1-${MAX_MESSAGE} characters`);

  return errors;
}

// ponytail: in-memory limiter, resets on restart, per-instance only.
// The authoritative rate limit is the RLS policy on contact_messages; this
// guards the notification side (Telegram/Resend) before any DB write.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const contactHits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (contactHits.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  if (hits.length >= RATE_LIMIT_MAX) {
    contactHits.set(key, hits);
    return true;
  }
  hits.push(now);
  contactHits.set(key, hits);
  return false;
}

router.post("/contact", async (req: Request, res: Response) => {
  try {
    const errors = validateContact(req.body);
    if (errors.length) {
      res.status(400).json({ error: errors.join("; ") });
      return;
    }

    const { name, email, message } = req.body as {
      name: string;
      email: string;
      message: string;
    };

    const ip = req.ip ?? "unknown";
    if (isRateLimited(ip)) {
      logger.warn({ ip }, "Contact rate limit exceeded");
      res.status(429).json({ error: "Too many messages, please try again later" });
      return;
    }

    const supabase = getSupabase();
    if (supabase) {
      const { error: dbError } = await supabase.from("contact_messages").insert({
        name,
        email,
        message,
      });
      if (dbError) {
        logger.error({ error: dbError }, "Failed to insert contact message");
        res.status(500).json({ error: "Failed to save message" });
        return;
      }
    } else {
      logger.warn("Supabase not configured — skipping DB insert");
    }

    if (isTelegramConfigured()) {
      const tgMessage = [
        "<b>📬 New Contact Message</b>",
        "",
        `<b>Name:</b> ${escapeHtml(name)}`,
        `<b>Email:</b> ${escapeHtml(email)}`,
        "",
        `<b>Message:</b>`,
        escapeHtml(message),
      ].join("\n");

      sendTelegramMessage(tgMessage).catch((err) =>
        logger.error({ err }, "Telegram notification failed"),
      );
    }

    if (isEmailConfigured()) {
      sendEmailNotification(name, email, message).catch((err) =>
        logger.error({ err }, "Email notification failed"),
      );
    }

    res.status(200).json({ success: true });
  } catch (err) {
    logger.error({ err }, "Contact endpoint error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
