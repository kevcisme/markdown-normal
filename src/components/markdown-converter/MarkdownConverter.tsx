import { useState, useEffect, useCallback, useMemo } from "react";
import { marked } from "marked";
import { Header, type ConversionMode } from "./Header";
import { MarkdownInput } from "./MarkdownInput";
import { RichTextPreview } from "./RichTextPreview";
import { RichTextInput } from "./RichTextInput";
import { MarkdownOutput } from "./MarkdownOutput";
import { MobileTabSwitcher } from "./MobileTabSwitcher";
import { htmlToMarkdown, isEmptyRichHtml } from "@/lib/htmlToMarkdown";

const SAMPLE_MARKDOWN = `# Welcome to Markdown · Rich Text

A **minimal** conversion tool for developers and writers.

## How to use

1. Type or paste your **Markdown** in this panel
2. Watch the live preview update on the right
3. Click **Copy Rich Text** to copy formatted output
4. Paste into Google Docs, Notion, email — styling preserved!

## Supported Syntax

- **Bold** and *italic* text
- [Hyperlinks](https://example.com)
- Inline \`code\` and code blocks
- Blockquotes, lists, and headings

> "The right tool for the job makes all the difference."

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

---

Try it out — start typing below or use \`Cmd/Ctrl + Shift + C\` to copy.
`;

export function MarkdownConverter() {
  const [mode, setMode] = useState<ConversionMode>("md-to-rich");
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [richHtml, setRichHtml] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"input" | "preview">("input");

  const htmlFromMarkdown = useMemo(() => {
    if (!markdown.trim()) return "";
    return marked.parse(markdown, { breaks: true }) as string;
  }, [markdown]);

  const markdownFromRichHtml = useMemo(
    () => htmlToMarkdown(richHtml),
    [richHtml],
  );

  const hasContent =
    mode === "md-to-rich"
      ? markdown.trim().length > 0
      : !isEmptyRichHtml(richHtml);

  const handleCopy = useCallback(async () => {
    if (mode === "md-to-rich") {
      if (!htmlFromMarkdown) return;
      try {
        const blob = new Blob([htmlFromMarkdown], { type: "text/html" });
        const plainBlob = new Blob([markdown], { type: "text/plain" });
        const clipboardItem = new ClipboardItem({
          "text/html": blob,
          "text/plain": plainBlob,
        });
        await navigator.clipboard.write([clipboardItem]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        try {
          await navigator.clipboard.writeText(markdown);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } catch {
          console.error("Failed to copy:", err);
        }
      }
      return;
    }

    if (!markdownFromRichHtml) return;
    try {
      await navigator.clipboard.writeText(markdownFromRichHtml);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [mode, htmlFromMarkdown, markdown, markdownFromRichHtml]);

  const handleClear = useCallback(() => {
    if (mode === "md-to-rich") setMarkdown("");
    else setRichHtml("");
  }, [mode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "C") {
        e.preventDefault();
        handleCopy();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleCopy]);

  useEffect(() => {
    setActiveTab("input");
  }, [mode]);

  const mobileLeftLabel = mode === "md-to-rich" ? "Markdown" : "Rich text";
  const mobileRightLabel = mode === "md-to-rich" ? "Preview" : "Markdown";
  const shortcutHint =
    mode === "md-to-rich" ? "to copy rich text" : "to copy markdown";

  return (
    <div className="app-brand-bg flex flex-col h-screen w-screen overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

      <Header
        mode={mode}
        onModeChange={setMode}
        onCopy={handleCopy}
        onClear={handleClear}
        isCopied={isCopied}
        hasContent={hasContent}
      />

      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 md:p-6 overflow-hidden relative z-10">
        <MobileTabSwitcher
          leftLabel={mobileLeftLabel}
          rightLabel={mobileRightLabel}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="hidden md:flex flex-1 gap-4 min-h-0 w-full">
          {mode === "md-to-rich" ? (
            <>
              <div className="flex-1 min-h-0 min-w-0">
                <MarkdownInput value={markdown} onChange={setMarkdown} autoFocus />
              </div>
              <div className="flex-1 min-h-0 min-w-0">
                <RichTextPreview markdown={markdown} />
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 min-h-0 min-w-0">
                <RichTextInput value={richHtml} onChange={setRichHtml} />
              </div>
              <div className="flex-1 min-h-0 min-w-0">
                <MarkdownOutput value={markdownFromRichHtml} />
              </div>
            </>
          )}
        </div>

        <div className="flex-1 md:hidden min-h-0 w-full flex flex-col">
          {mode === "md-to-rich" ? (
            activeTab === "input" ? (
              <MarkdownInput value={markdown} onChange={setMarkdown} autoFocus />
            ) : (
              <RichTextPreview markdown={markdown} />
            )
          ) : activeTab === "input" ? (
            <RichTextInput value={richHtml} onChange={setRichHtml} />
          ) : (
            <MarkdownOutput value={markdownFromRichHtml} />
          )}
        </div>
      </main>

      <div className="hidden md:flex items-center justify-center py-2 text-xs text-muted-foreground/50">
        <kbd className="px-1.5 py-0.5 rounded bg-secondary/50 border border-border/30 font-mono text-[10px] mr-1">
          ⌘
        </kbd>
        <span className="mr-1">+</span>
        <kbd className="px-1.5 py-0.5 rounded bg-secondary/50 border border-border/30 font-mono text-[10px] mr-1">
          ⇧
        </kbd>
        <span className="mr-1">+</span>
        <kbd className="px-1.5 py-0.5 rounded bg-secondary/50 border border-border/30 font-mono text-[10px] mr-2">
          C
        </kbd>
        <span>{shortcutHint}</span>
      </div>
    </div>
  );
}
