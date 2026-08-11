import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // three.js (lazy-loaded with the Lanyard) is its own chunk — this just
  // silences the size warning; it does not block the initial page load.
  build: {
    chunkSizeWarningLimit: 900,
  },
  server: {
    watch: {
      // Docs/images get dropped into the repo while still being written/locked,
      // which crashes the file watcher on Windows (EBUSY). They're static
      // assets — no HMR needed — so don't watch them at all.
      ignored: [/\.(pdf|jpg|jpeg|png|webp|gif)$/i],
    },
  },
});
