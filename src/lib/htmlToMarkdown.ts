import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});
turndown.use(gfm);

/** True when pasted HTML has no visible text (ignores whitespace and &nbsp;). */
export function isEmptyRichHtml(html: string): boolean {
  const trimmed = html.trim();
  if (!trimmed) return true;
  const doc = new DOMParser().parseFromString(trimmed, "text/html");
  const text = (doc.body.textContent ?? "").replace(/\u00a0/g, " ");
  return text.replace(/\s/g, "").length === 0;
}

export function plainTextFromHtml(html: string): string {
  if (!html.trim()) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent ?? "").replace(/\u00a0/g, " ").trim();
}

export function htmlToMarkdown(html: string): string {
  if (isEmptyRichHtml(html)) return "";
  return turndown.turndown(html).trim();
}
