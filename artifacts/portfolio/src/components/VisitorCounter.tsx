import { Eye } from "lucide-react";
import { useVisitorCount } from "@/hooks/use-visitor-count";
import { usePortfolio } from "@/contexts/PortfolioContext";

export default function VisitorCounter() {
  const { count, error } = useVisitorCount();
  const { language } = usePortfolio();
  const label = language === "ar" ? "الزوار" : "Unique visitors";
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-primary/5 border border-primary/15 text-xs text-muted-foreground min-w-16"
      title={label}
    >
      <Eye aria-hidden="true" className="w-3 h-3" />
      <span className="sr-only">{label}: </span>
      <span className="tabular-nums font-semibold">
        {error || count === null ? "—" : count.toLocaleString(language)}
      </span>
    </div>
  );
}
