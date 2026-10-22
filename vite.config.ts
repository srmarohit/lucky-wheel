import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the site from https://<user>.github.io/<repo>/.
  base: "/lucky-wheel/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Lucky Winner Spinner Wheel",
        short_name: "Lucky Wheel",
        description: "Add prizes, spin the wheel, and pick a random winner.",
        theme_color: "#667eea",
        background_color: "#667eea",
        display: "standalone",
        orientation: "portrait",
        scope: "/lucky-wheel/",
        start_url: "/lucky-wheel/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Cache all build assets so the app works fully offline.
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        navigateFallback: "/lucky-wheel/index.html",
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        // Lets the service worker run during `vite dev` for testing.
        enabled: true,
      },
    }),
  ],
});
