import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Split out only the big dependencies the landing page already downloads, so
// they stay cached across deploys. Everything else is left to Rollup: naming a
// package here forces it into a chunk the entry preloads, which is how the
// dashboard-only dnd-kit and form libraries ended up on the landing page.
function splitVendors(id: string): string | undefined {
  if (!id.includes("node_modules")) return undefined;
  if (id.includes("@supabase")) return "supabase";
  if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return "react";
  return undefined;
}

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: splitVendors,
      },
    },
  },
});
