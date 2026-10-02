import { Eye } from "lucide-react";
import { useVisitorCount } from "@/hooks/use-visitor-count";
import { usePortfolio } from "@/contexts/PortfolioContext";

/* 1,000,000 is nine characters and pushed the theme toggle off a 320px screen.
   Compact caps it at four: 1K, 2.6K, 500K, 1M. */
const compact = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function VisitorCounter() {
  const { count, error } = useVisitorCount();
  const { language } = usePortfolio();
  const label = language === "ar" ? "الزوار" : "Unique visitors";
  return (
    <div
      className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 chamfer rounded-full bg-primary/5 border border-primary/15 text-xs text-muted-foreground min-w-0 sm:min-w-16"
      /* compact hides the precise figure; keep it on hover */
      title={
        count === null || error
          ? label
          : `${label}: ${count.toLocaleString(language)}`
      }
    >
      <Eye aria-hidden="true" className="w-3 h-3" />
      <span className="sr-only">{label}: </span>
      <span className="tabular-nums font-semibold">
        {error || count === null ? "—" : compact(count, language)}
      </span>
    </div>
  );
}
