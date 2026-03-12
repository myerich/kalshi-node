import { defineConfig } from "vite";

export default defineConfig({
  root: "tests/test-panel/panel",
  server: {
    port: 4000,
    proxy: {
      "/api/kalshi": "http://localhost:4001",
      "/api/ws/kalshi": {
        target: "ws://localhost:4001",
        ws: true,
      },
    },
  },
});
