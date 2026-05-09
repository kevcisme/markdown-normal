import { useState, useEffect, useCallback, useMemo } from "react";
import { marked } from "marked";
import { Header } from "./Header";
import { MarkdownInput } from "./MarkdownInput";
import { RichTextPreview } from "./RichTextPreview";
import { MobileTabSwitcher } from "./MobileTabSwitcher";

const SAMPLE_MARKDOWN = `# Welcome to MD → Rich Text

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
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"input" | "preview">("input");

  const html = useMemo(() => {
    if (!markdown.trim()) return "";
    return marked.parse(markdown, { breaks: true }) as string;
  }, [markdown]);

  const handleCopy = useCallback(async () => {
    if (!html) return;

    try {
      const blob = new Blob([html], { type: "text/html" });
      const plainBlob = new Blob([markdown], { type: "text/plain" });
      const clipboardItem = new ClipboardItem({
        "text/html": blob,
        "text/plain": plainBlob,
      });
      await navigator.clipboard.write([clipboardItem]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      // Fallback: try copying as plain text
      try {
        await navigator.clipboard.writeText(markdown);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch {
        console.error("Failed to copy:", err);
      }
    }
  }, [html, markdown]);

  const handleClear = useCallback(() => {
    setMarkdown("");
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + Shift + C
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

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden relative">
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />
      
      <Header
        onCopy={handleCopy}
        onClear={handleClear}
        isCopied={isCopied}
        hasContent={markdown.trim().length > 0}
      />

      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 md:p-6 overflow-hidden relative z-10">
        {/* Mobile tab switcher */}
        <MobileTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Desktop: side-by-side layout */}
        <div className="hidden md:flex flex-1 gap-4 min-h-0">
          <div className="flex-1 min-h-0">
            <MarkdownInput value={markdown} onChange={setMarkdown} />
          </div>
          <div className="flex-1 min-h-0">
            <RichTextPreview markdown={markdown} />
          </div>
        </div>

        {/* Mobile: stacked with tab switcher */}
        <div className="flex-1 md:hidden min-h-0">
          {activeTab === "input" ? (
            <MarkdownInput value={markdown} onChange={setMarkdown} />
          ) : (
            <RichTextPreview markdown={markdown} />
          )}
        </div>
      </main>

      {/* Keyboard shortcut hint */}
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
        <span>to copy rich text</span>
      </div>
    </div>
  );
}
