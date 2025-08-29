import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // backend
        changeOrigin: true,
      },
    },
  },
});
