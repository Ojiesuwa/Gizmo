import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.VITE_FIREBASE_API_KEY": JSON.stringify(
      process.env.VITE_FIREBASE_API_KEY
    ),
    "process.env.VITE_FIREBASE_AUTH_DOMAIN": JSON.stringify(
      process.env.VITE_FIREBASE_AUTH_DOMAIN
    ),
    "process.env.VITE_FIREBASE_PROJECT_ID": JSON.stringify(
      process.env.VITE_FIREBASE_PROJECT_ID
    ),
    "process.env.VITE_FIREBASE_STORAGE_BUCKET": JSON.stringify(
      process.env.VITE_FIREBASE_STORAGE_BUCKET
    ),
    "process.env.VITE_FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(
      process.env.VITE_FIREBASE_MESSAGING_SENDER_ID
    ),
    "process.env.VITE_FIREBASE_APP_ID": JSON.stringify(
      process.env.VITE_FIREBASE_APP_ID
    ),
    "process.env.VITE_FIREBASE_MEASUREMENT_ID": JSON.stringify(
      process.env.VITE_FIREBASE_MEASUREMENT_ID
    ),
    "process.env.VITE_OPENAI_KEY ": JSON.stringify(process.env.VITE_OPENAI_KEY),
  },
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
