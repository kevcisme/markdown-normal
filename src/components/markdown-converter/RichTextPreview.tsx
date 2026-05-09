import { useMemo } from "react";
import { marked } from "marked";
import { motion } from "framer-motion";

interface RichTextPreviewProps {
  markdown: string;
}

export function RichTextPreview({ markdown }: RichTextPreviewProps) {
  const html = useMemo(() => {
    if (!markdown.trim()) return "";
    return marked.parse(markdown, { breaks: true }) as string;
  }, [markdown]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-col h-full border border-border/50 rounded-lg bg-card overflow-hidden"
    >
      <div className="flex items-center px-4 py-3 border-b border-border/30">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Preview
        </span>
      </div>
      <div className="flex-1 overflow-auto px-6 py-5">
        {html ? (
          <div
            className="preview-content prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground/40 text-sm">
            Your rendered output will appear here...
          </div>
        )}
      </div>
    </motion.div>
  );
}
