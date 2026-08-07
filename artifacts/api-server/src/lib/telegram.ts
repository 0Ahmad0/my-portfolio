import { logger } from "./logger";

const TELEGRAM_API = "https://api.telegram.org";

function getBotToken(): string | undefined {
  return process.env["TELEGRAM_BOT_TOKEN"];
}

function getChatId(): string | undefined {
  return process.env["TELEGRAM_CHAT_ID"];
}

export function isTelegramConfigured(): boolean {
  return !!(getBotToken() && getChatId());
}

export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = getBotToken();
  const chatId = getChatId();

  if (!token || !chatId) {
    logger.warn("Telegram not configured — skipping notification");
    return false;
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      logger.error({ error: err }, "Failed to send Telegram message");
      return false;
    }

    logger.info("Telegram notification sent");
    return true;
  } catch (err) {
    logger.error({ err }, "Telegram send error");
    return false;
  }
}
