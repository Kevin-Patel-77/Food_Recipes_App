import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: path.resolve(__dirname, "test/setup.ts"),

     include: ["test/VitestTests/**/*.test.{ts,tsx}"],
    exclude: ["test/PlaywrightTests/**"],         

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/vite-env.d.ts",
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
      ],
    },
  },
});
