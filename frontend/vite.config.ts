import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://animelist-app-tm6q9.ondigitalocean.app",
        changeOrigin: true,
        secure: false,
      },
      "/api/public/users": {
        target:
          "https://animelist-app-tm6q9.ondigitalocean.app/api/public/users",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
