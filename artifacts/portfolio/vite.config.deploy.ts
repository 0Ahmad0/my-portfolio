import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Keep the big libraries in their own cacheable chunks so the landing page
// doesn't have to download dnd-kit, form and dialog libraries it never uses.
function splitVendors(id: string): string | undefined {
  if (!id.includes("node_modules")) return undefined;
  if (id.includes("@supabase")) return "supabase";
  if (id.includes("@tanstack")) return "query";
  // react-icons ships one icon per module; keep the two icon sets apart
  if (id.includes("react-icons")) return "react-icons";
  // a tiny router: cheaper inlined than fetched as its own chunk
  if (id.includes("/wouter/")) return undefined;
  if (id.includes("framer-motion") || id.includes("/motion/")) return "motion";
  if (id.includes("lucide-react") || id.includes("react-icons")) return "icons";
  if (id.includes("@dnd-kit")) return "dnd";
  if (id.includes("@radix-ui")) return "radix";
  if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("/zod/")) return "forms";
  return "vendor";
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