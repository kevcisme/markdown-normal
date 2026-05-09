import { Check, Copy, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type ConversionMode = "md-to-rich" | "rich-to-md";

interface HeaderProps {
  mode: ConversionMode;
  onModeChange: (mode: ConversionMode) => void;
  onCopy: () => void;
  onClear: () => void;
  isCopied: boolean;
  hasContent: boolean;
}

export function Header({
  mode,
  onModeChange,
  onCopy,
  onClear,
  isCopied,
  hasContent,
}: HeaderProps) {
  const copyLabel = mode === "md-to-rich" ? "Copy Rich Text" : "Copy Markdown";

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-border/50">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 shrink-0 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
            <span className="text-primary font-mono text-sm font-bold">M</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground truncate">
            Markdown · Rich Text
          </h1>
        </div>
        <div className="flex rounded-lg border border-border/50 bg-secondary/40 p-0.5 w-fit max-w-full">
          <button
            type="button"
            onClick={() => onModeChange("md-to-rich")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === "md-to-rich"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            MD → Rich
          </button>
          <button
            type="button"
            onClick={() => onModeChange("rich-to-md")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === "rich-to-md"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Rich → MD
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {hasContent && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={onClear}
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </motion.button>
        )}

        <motion.button
          onClick={onCopy}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            isCopied
              ? "bg-secondary/80 text-secondary-foreground border border-secondary"
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
          }`}
          disabled={!hasContent}
        >
          <AnimatePresence mode="wait">
            {isCopied ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>{copyLabel}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </header>
  );
}
