import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    include: ["tests/e2e/**/*.test.ts"],
    testTimeout: 30000,
    setupFiles: ["tests/e2e/setup.ts"],
    env: {
      DOTENV_CONFIG_PATH: resolve(__dirname, ".env"),
    },
  },
});
