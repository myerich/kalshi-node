import { defineConfig } from "vite";

export default defineConfig({
  root: "tests/test-panel/panel",
  server: {
    port: 5173,
    proxy: {
      "/api/kalshi": "http://localhost:3001",
      "/api/ws/kalshi": {
        target: "ws://localhost:3001",
        ws: true,
      },
    },
  },
});
