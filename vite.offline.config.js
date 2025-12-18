import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";

function offlineIndexPlugin() {
  return {
    name: "lightbot-offline-index",
    closeBundle() {
      const distDir = path.resolve(process.cwd(), "dist");
      const jsFile = "lightbot.iife.js";
      const cssFile = "lightbot.css";

      if (!fs.existsSync(path.join(distDir, jsFile))) {
        throw new Error(`Offline build: missing ${jsFile} in dist/.`);
      }
      if (!fs.existsSync(path.join(distDir, cssFile))) {
        throw new Error(`Offline build: missing ${cssFile} in dist/.`);
      }

      const sourceIndexPath = path.resolve(process.cwd(), "index.html");
      let html = fs.readFileSync(sourceIndexPath, "utf8");

      const offlineEntry =
        `  <link rel="stylesheet" href="${cssFile}">\n` +
        `  <script src="${jsFile}"></script>\n`;

      const startMarker = "<!-- lightbot:entry:start -->";
      const endMarker = "<!-- lightbot:entry:end -->";

      if (html.includes(startMarker) && html.includes(endMarker)) {
        const start = html.indexOf(startMarker);
        const end = html.indexOf(endMarker) + endMarker.length;
        html = html.slice(0, start) + offlineEntry + html.slice(end);
      } else {
        // Fallback for older index.html versions without markers.
        html = html.replace(
          /<script\b[^>]*\btype=["']module["'][^>]*>\s*<\/script>\s*/i,
          offlineEntry
        );
      }

      fs.writeFileSync(path.join(distDir, "index.html"), html);
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [tailwindcss(), offlineIndexPlugin()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(process.cwd(), "src/main.js"),
      name: "Lightbot",
      formats: ["iife"],
      fileName: "lightbot",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
