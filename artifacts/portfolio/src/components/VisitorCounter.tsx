import { useEffect, useRef, useState } from "react";
import { motion, animate, useMotionValue, useSpring } from "framer-motion";
import { Eye } from "lucide-react";
import { useVisitorCount } from "@/hooks/use-visitor-count";

export default function VisitorCounter() {
  const { count, error } = useVisitorCount();
  const [display, setDisplay] = useState("0");
  const prevCount = useRef(0);
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { stiffness: 120, damping: 18 });

  useEffect(() => {
    const unsubscribe = springVal.on("change", (v) => {
      setDisplay(Math.round(v).toLocaleString());
    });
    return unsubscribe;
  }, [springVal]);

  useEffect(() => {
    if (count === null) return;
    animate(motionVal, count, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    });
    prevCount.current = count;
  }, [count, motionVal]);

  if (count === null && !error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative"
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary"
      />

      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-primary/5 border border-primary/15 text-xs font-medium text-muted-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300 cursor-default"
        title={error ?? "Unique visitors"}
      >
        <Eye className="w-3 h-3" />
        <span className="tabular-nums font-semibold min-w-[2ch]">{error ? "--" : display}</span>
      </div>
    </motion.div>
  );
}
