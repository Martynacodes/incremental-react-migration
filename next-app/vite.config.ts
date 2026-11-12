import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Builds one self-contained ES module that registers <next-app>.
// React 19 is bundled in, so it never collides with the host's React 16.
export default defineConfig({
  plugins: [react()],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    lib: {
      entry: "src/registerElement.tsx",
      formats: ["es"],
      fileName: () => "next-app.js",
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
