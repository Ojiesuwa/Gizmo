import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["pdfjs-dist"], // Exclude pdfjs-dist from optimization
  },
  server: {
    host: "0.0.0.0", // This will expose the server to the network
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Ensure pdfjs-dist is split out into a separate chunk for better bundling
          pdfjs: ["pdfjs-dist"],
        },
      },
    },
  },
});
