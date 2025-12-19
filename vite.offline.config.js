import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function offlineIndexPlugin() {
  /** @type {import('vite').ResolvedConfig | null} */
  let resolvedConfig = null;

  return {
    name: "lightbot-offline-index",
    configResolved(c) {
      resolvedConfig = c;
    },
    writeBundle(outputOptions, bundle) {
      if (!resolvedConfig) throw new Error("Offline build: missing resolved Vite config.");

      const distDir = outputOptions.dir
        ? (path.isAbsolute(outputOptions.dir) ? outputOptions.dir : path.resolve(resolvedConfig.root, outputOptions.dir))
        : (outputOptions.file ? path.dirname(outputOptions.file) : path.resolve(resolvedConfig.root, resolvedConfig.build.outDir));

      const entries = Object.values(bundle);
      const jsChunk =
        entries.find((e) => e.type === "chunk" && e.fileName.endsWith(".iife.js")) ||
        entries.find((e) => e.type === "chunk" && e.fileName.endsWith(".js")) ||
        null;

      const cssAsset = entries.find((e) => e.type === "asset" && e.fileName.endsWith(".css")) || null;

      if (!jsChunk) {
        throw new Error(`Offline build: missing JS bundle in Rollup output (${Object.keys(bundle).join(", ")}).`);
      }
      if (!cssAsset) {
        throw new Error(`Offline build: missing CSS bundle in Rollup output (${Object.keys(bundle).join(", ")}).`);
      }

      const jsFile = jsChunk.fileName;
      const cssFile = cssAsset.fileName;

      const sourceIndexPath = path.resolve(resolvedConfig.root, "index.html");
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

      fs.mkdirSync(distDir, { recursive: true });
      fs.writeFileSync(path.join(distDir, "index.html"), html);
    },
  };
}

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: repoRoot,
  base: "./",
  plugins: [tailwindcss(), offlineIndexPlugin()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(repoRoot, "src/main.js"),
      name: "Lightbot",
      formats: ["iife"],
      fileName: function () {
        return "lightbot.min.js";
      },
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
