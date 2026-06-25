import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

function getVisitorId(): string {
  try {
    let id = localStorage.getItem("portfolio_visitor_id");
    if (!id) {
      id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("portfolio_visitor_id", id);
    }
    return id;
  } catch {
    return "fallback";
  }
}

const VISITED_KEY = "portfolio_visited";

export function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null);
  const [isNewVisit, setIsNewVisit] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function track() {
      const visitorHash = getVisitorId();

      if (supabase) {
        try {
          const alreadyVisited = sessionStorage.getItem(VISITED_KEY);
          if (!alreadyVisited) {
            await supabase.from("site_visits").insert({ visitor_hash: visitorHash });
            sessionStorage.setItem(VISITED_KEY, "1");
            setIsNewVisit(true);
          }

          const { count: total, error } = await supabase
            .from("site_visits")
            .select("visitor_hash", { head: false, count: "exact" });

          if (!cancelled && !error && total !== null) {
            setCount(total);
            localStorage.setItem("portfolio_visitor_count", String(total));
            return;
          }
        } catch {
        }
      }

      const cached = localStorage.getItem("portfolio_visitor_count");
      if (cancelled) return;
      if (cached) {
        setCount(Number(cached));
      } else {
        setCount(0);
      }
    }

    track();
    return () => { cancelled = true; };
  }, []);

  return { count, isNewVisit };
}
