import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

const VISITOR_ID_KEY = "portfolio_visitor_id";
const LOCAL_VISITORS_KEY = "portfolio_local_visitors";
const SESSION_VISITED_KEY = "portfolio_visited";

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return "fallback-" + Date.now();
  }
}

function getLocalVisitors(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCAL_VISITORS_KEY);
    return new Set<string>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveLocalVisitors(set: Set<string>) {
  try {
    localStorage.setItem(LOCAL_VISITORS_KEY, JSON.stringify([...set]));
  } catch {}
}

export function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null);
  const [isNewVisit, setIsNewVisit] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function track() {
      const visitorHash = getVisitorId();

      if (supabase) {
        try {
          const alreadyVisited = sessionStorage.getItem(SESSION_VISITED_KEY);
          if (!alreadyVisited) {
            await supabase.from("site_visits").insert({ visitor_hash: visitorHash });
            sessionStorage.setItem(SESSION_VISITED_KEY, "1");
            setIsNewVisit(true);
          }

          const { count: total, error } = await supabase
            .from("site_visits")
            .select("visitor_hash", { head: false, count: "exact" });

          if (!cancelled && !error && total !== null) {
            setCount(total);
            localStorage.setItem("portfolio_visitor_count_supabase", String(total));
            return;
          }
        } catch {}
      }

      const localVisitors = getLocalVisitors();
      const alreadyTracked = sessionStorage.getItem(SESSION_VISITED_KEY);
      if (!alreadyTracked) {
        localVisitors.add(visitorHash);
        saveLocalVisitors(localVisitors);
        sessionStorage.setItem(SESSION_VISITED_KEY, "1");
        setIsNewVisit(true);
      }

      if (!cancelled) {
        setCount(localVisitors.size);
      }
    }

    track();
    return () => { cancelled = true; };
  }, []);

  return { count, isNewVisit };
}
