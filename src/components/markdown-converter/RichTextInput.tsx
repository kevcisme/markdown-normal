import { useEffect, useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { isEmptyRichHtml, plainTextFromHtml } from "@/lib/htmlToMarkdown";

interface RichTextInputProps {
  value: string;
  onChange: (html: string) => void;
}

export function RichTextInput({ value, onChange }: RichTextInputProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = editorRef.current;
    if (!el || !value) return;
    el.innerHTML = value;
  }, []);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (value === "") el.innerHTML = "";
  }, [value]);

  useEffect(() => {
    editorRef.current?.focus();
  }, []);

  const wordCount = (() => {
    const text = plainTextFromHtml(value);
    return text ? text.split(/\s+/).length : 0;
  })();
  const charCount = plainTextFromHtml(value).length;
  const showPlaceholder = isEmptyRichHtml(value);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-col h-full border border-border/50 rounded-lg bg-card overflow-hidden focus-within:border-primary/50 focus-within:shadow-[0_0_0_1px_hsl(var(--primary)/0.2)] transition-all duration-300"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Rich Text
        </span>
        <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
          <span>{wordCount} words</span>
          <span className="w-px h-3 bg-border/50" />
          <span>{charCount} chars</span>
        </div>
      </div>
      <div className="relative flex-1 min-h-0">
        {showPlaceholder && (
          <p className="absolute left-6 right-6 top-5 pointer-events-none text-sm text-muted-foreground/45 z-0">
            Paste from Google Docs, Notion, email, or webpages — formatting is preserved. You can
            edit here too.
          </p>
        )}
        <div
          ref={editorRef}
          role="textbox"
          aria-multiline="true"
          contentEditable
          suppressContentEditableWarning
          className="preview-content prose prose-neutral max-w-none relative z-[1] h-full overflow-auto px-6 py-5 text-sm text-foreground outline-none min-h-[12rem]"
          onInput={() => onChange(editorRef.current?.innerHTML ?? "")}
        />
      </div>
    </motion.div>
  );
}
