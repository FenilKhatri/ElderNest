import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": "/src",
    },
  },

  build: {
    target: "esnext",
    minify: "esbuild",
    cssCodeSplit: true,

    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",

        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name.split(".").pop();

          if (/png|jpe?g|svg|gif|webp|avif/i.test(ext)) {
            return "assets/images/[name]-[hash][extname]";
          }

          if (/css/i.test(ext)) {
            return "assets/css/[name]-[hash][extname]";
          }

          if (/woff2?|ttf|otf/i.test(ext)) {
            return "assets/fonts/[name]-[hash][extname]";
          }

          return "assets/[name]-[hash][extname]";
        },

        manualChunks(id) {
          // node_modules splitting
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            ) {
              return "vendor";
            }

            if (
              id.includes("react-toastify") ||
              id.includes("lucide-react")
            ) {
              return "ui";
            }

            if (id.includes("recharts")) {
              return "charts";
            }

            return "vendor_misc";
          }

          // role-based splitting
          if (id.includes("/pages/admin/")) return "admin";
          if (id.includes("/pages/caregiver/")) return "caregiver";
          if (id.includes("/pages/users/")) return "user";
          if (id.includes("/pages/public/")) return "public";
        },
      },
    },
  },

  server: {
    port: 5173,
    open: true,
  },

  preview: {
    port: 4173,
  },
});