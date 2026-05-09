import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface MarkdownInputProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

export function MarkdownInput({ value, onChange, autoFocus = true }: MarkdownInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const wordCount = value.trim()
    ? value.trim().split(/\s+/).length
    : 0;
  const charCount = value.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-col h-full border border-border/50 rounded-lg bg-card overflow-hidden focus-within:border-primary/50 focus-within:shadow-[0_0_0_1px_hsl(var(--primary)/0.2)] transition-all duration-300"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Markdown Input
        </span>
        <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
          <span>{wordCount} words</span>
          <span className="w-px h-3 bg-border/50" />
          <span>{charCount} chars</span>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste or type your Markdown here..."
        className="flex-1 w-full resize-none bg-transparent px-4 py-4 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none leading-relaxed"
        spellCheck={false}
      />
    </motion.div>
  );
}
