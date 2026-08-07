import { Router, type IRouter, type Request, type Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { logger } from "../lib/logger";
import { isTelegramConfigured, sendTelegramMessage } from "../lib/telegram";
import { isEmailConfigured, sendEmailNotification } from "../lib/email";

const router: IRouter = Router();

const supabaseUrl = process.env["SUPABASE_URL"];
const supabaseKey = process.env["SUPABASE_SERVICE_KEY"];

function getSupabase() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

router.post("/contact", async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      res.status(400).json({ error: "name, email, and message are required" });
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
        logger.error({ err }, "Telegram notification failed")
      );
    }

    if (isEmailConfigured()) {
      sendEmailNotification(name, email, message).catch((err) =>
        logger.error({ err }, "Email notification failed")
      );
    }

    res.status(200).json({ success: true });
  } catch (err) {
    logger.error({ err }, "Contact endpoint error");
    res.status(500).json({ error: "Internal server error" });
  }
});

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default router;
