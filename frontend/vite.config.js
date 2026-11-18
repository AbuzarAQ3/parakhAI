import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const proxyConfig = {
  "/_allauth": {
    target: process.env.VITE_BACKEND_URL || "http://127.0.0.1:8000",
    changeOrigin: true,
    secure: false,
  },
  "/api": {
    target: process.env.VITE_BACKEND_URL || "http://127.0.0.1:8000",
    changeOrigin: true,
    secure: false,
  },
  "/inspectors": {
    target: process.env.VITE_BACKEND_URL || "http://127.0.0.1:8000",
    changeOrigin: true,
    secure: false,
  },
  "/supervisor": {
    target: process.env.VITE_BACKEND_URL || "http://127.0.0.1:8000",
    changeOrigin: true,
    secure: false,
  },
  "/products": {
    target: process.env.VITE_BACKEND_URL || "http://127.0.0.1:8000",
    changeOrigin: true,
    secure: false,
  },
  "/reports": {
    target: process.env.VITE_BACKEND_URL || "http://127.0.0.1:8000",
    changeOrigin: true,
    secure: false,
  },
  "/media": {
    target: process.env.VITE_BACKEND_URL || "http://127.0.0.1:8000",
    changeOrigin: true,
    secure: false,
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: proxyConfig,
  },
  preview: {
    port: 5173,
    host: true,
    proxy: proxyConfig,
  },
});
