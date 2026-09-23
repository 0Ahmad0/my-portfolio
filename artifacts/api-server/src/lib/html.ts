/**
 * Escape user-controlled text before it is embedded in HTML.
 *
 * Quotes are escaped as well as tag delimiters: an unescaped quote lets an
 * attacker break out of an attribute (e.g. href="mailto:..." onmouseover="...").
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
