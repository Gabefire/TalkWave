/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigpath from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
	base: "/",
	plugins: [react(), tsconfigpath(), svgr()],
	preview: {
		host: "0.0.0.0",
		port: 8080,
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/tests/setup",
		testTimeout: 2000,
		css: {
			modules: {
				classNameStrategy: "non-scoped",
			},
		},
	},
});
