/* Brand loader. No framer-motion, no deps: this ships in the main bundle and has
   to paint the instant it mounts. Animation reuses the `slide` keyframe in index.css.
   role="status" + the visible "Loading" text is the accessible name — no aria-label. */
export default function Loader({ className = "" }: { className?: string }) {
  return (
    <div
      role="status"
      className={`grid justify-items-center gap-5 ${className}`}
    >
      <span
        dir="ltr"
        className="text-2xl font-bold tracking-tighter sm:text-3xl"
      >
        AHMAD<span className="text-primary">.DEV</span>
      </span>
      <span className="relative block h-px w-56 max-w-[60vw] overflow-hidden bg-border">
        {/* static half-lit bar by default; only motion-safe users get the sweep,
            because the global reduced-motion rule would park it off-screen */}
        <span className="absolute inset-y-0 start-0 w-full bg-primary/50 motion-safe:w-1/3 motion-safe:bg-primary motion-safe:shadow-[0_0_12px_2px_hsl(var(--primary)/0.55)] motion-safe:animate-[slide_1.6s_ease-in-out_infinite]" />
      </span>
      <span
        dir="ltr"
        className="ps-[0.45em] text-[10px] uppercase tracking-[0.45em] text-muted-foreground"
      >
        Loading
      </span>
    </div>
  );
}
