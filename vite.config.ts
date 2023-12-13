/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigpath from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tsconfigpath(),
    svgr()
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup",
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
  },
});
