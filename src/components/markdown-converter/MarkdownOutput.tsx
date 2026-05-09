import { motion } from "framer-motion";

interface MarkdownOutputProps {
  value: string;
}

export function MarkdownOutput({ value }: MarkdownOutputProps) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-col h-full border border-border/50 rounded-lg bg-card overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Markdown Output
        </span>
        <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
          <span>{wordCount} words</span>
          <span className="w-px h-3 bg-border/50" />
          <span>{charCount} chars</span>
        </div>
      </div>
      <div className="flex flex-1 min-h-0 flex-col">
        <textarea
          readOnly
          value={value}
          placeholder="Markdown appears here from your rich text..."
          className="flex-1 min-h-0 w-full resize-none bg-transparent px-4 py-4 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none leading-relaxed"
          spellCheck={false}
          aria-readonly="true"
        />
      </div>
    </motion.div>
  );
}
