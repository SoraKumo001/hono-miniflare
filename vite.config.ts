import { defineConfig } from "vite";
import { devServer } from "vite-plugin-miniflare";
export default defineConfig({
  // Only if the front module is required
  // build: {},

  plugins: [
    devServer({
      entry: "src/index.tsx",
      // Bundle all ENTRY modules.
      bundle: true,
      // Set to true for automatic reloading without HMR
      // autoNoExternal: true,
      reload: true,
    }),
  ],
});
