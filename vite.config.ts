import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_PROXY_TARGET;

  if (mode === "development" && !apiTarget) {
    throw new Error("VITE_API_PROXY_TARGET must be set in .env");
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true,
      port: 5183,
      proxy: apiTarget
        ? {
            "^/(boxer|tournament|terminal|overlay|health|stream|match|event|venue|manager)(/|$)":
              {
                target: apiTarget,
                changeOrigin: true,
              },
          }
        : undefined,
    },
  };
});
