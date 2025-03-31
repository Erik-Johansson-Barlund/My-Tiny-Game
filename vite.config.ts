// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  base: "./", // or '/your-repo-name/' if deploying to GitHub Pages project site
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
