import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The new app is built separately and served as a static file.
// The host never imports its source: they only share the custom element contract.
export default defineConfig({
  plugins: [react()],
  publicDir: "../next-app/dist",
});
