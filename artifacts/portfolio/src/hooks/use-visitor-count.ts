import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

const VISITOR_ID_KEY = "portfolio_visitor_id";
const LOCAL_VISITORS_KEY = "portfolio_local_visitors";

function getDeviceType(): string {
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|BlackBerry/i.test(navigator.userAgent) ? "mobile" : "desktop";
}

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

type VisitorResult = {
  count: number;
  isNewVisit: boolean;
  error: string | null;
};

let visitorResult: Promise<VisitorResult> | null = null;

async function trackVisitor(): Promise<VisitorResult> {
  const visitorHash = getVisitorId();

  if (supabase) {
    try {
      const visit = {
        visitor_hash: visitorHash,
        last_visit: new Date().toISOString(),
        device_type: getDeviceType(),
        browser_info: navigator.userAgent.slice(0, 200),
      };

      const { error: insertError } = await supabase.from("site_visits").insert({
        ...visit,
        first_visit: new Date().toISOString(),
        visit_count: 1,
      });

      const isNewVisit = !insertError;

      if (insertError?.code === "23505") {
        const { data: current, error: readError } = await supabase
          .from("site_visits")
          .select("visit_count")
          .eq("visitor_hash", visitorHash)
          .single();

        if (readError) throw readError;

        const { error: updateError } = await supabase
          .from("site_visits")
          .update({ ...visit, visit_count: (current?.visit_count ?? 1) + 1 })
          .eq("visitor_hash", visitorHash);

        if (updateError) throw updateError;
      } else if (insertError) {
        throw insertError;
      }

      const { count: total, error } = await supabase
        .from("site_visits")
        .select("*", { head: true, count: "exact" });

      if (error) throw error;
      localStorage.setItem("portfolio_visitor_count_supabase", String(total ?? 0));
      return { count: total ?? 0, isNewVisit, error: null };
    } catch (err) {
      const local = getLocalVisitorResult(visitorHash);
      return { ...local, error: err instanceof Error ? err.message : "Visitor counter failed" };
    }
  }

  return { ...getLocalVisitorResult(visitorHash), error: null };
}

function getLocalVisitorResult(visitorHash: string): Omit<VisitorResult, "error"> {
  const localVisitors = getLocalVisitors();
  const isNewVisit = !localVisitors.has(visitorHash);
  if (isNewVisit) {
    localVisitors.add(visitorHash);
    saveLocalVisitors(localVisitors);
  }
  return { count: localVisitors.size, isNewVisit };
}

export function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null);
  const [isNewVisit, setIsNewVisit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    visitorResult ??= trackVisitor();
    visitorResult.then((result) => {
      if (cancelled) return;
      setCount(result.count);
      setIsNewVisit(result.isNewVisit);
      setError(result.error);
    });

    return () => { cancelled = true; };
  }, []);

  return { count, isNewVisit, error };
}
