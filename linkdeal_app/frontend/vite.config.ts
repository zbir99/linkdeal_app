import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173,
      open: true,
      proxy: {
        // Proxy Auth0 token requests to bypass CORS (optional)
        "/auth0": {
          target: `https://${env.VITE_AUTH0_DOMAIN}`,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/auth0/, ""),
          secure: true,
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: false,
    },
  };
});
