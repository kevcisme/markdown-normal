interface MobileTabSwitcherProps {
  leftLabel: string;
  rightLabel: string;
  activeTab: "input" | "preview";
  onTabChange: (tab: "input" | "preview") => void;
}

export function MobileTabSwitcher({
  leftLabel,
  rightLabel,
  activeTab,
  onTabChange,
}: MobileTabSwitcherProps) {
  return (
    <div className="flex bg-secondary/50 rounded-lg p-1 md:hidden">
      <button
        onClick={() => onTabChange("input")}
        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
          activeTab === "input"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {leftLabel}
      </button>
      <button
        onClick={() => onTabChange("preview")}
        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
          activeTab === "preview"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {rightLabel}
      </button>
    </div>
  );
}
