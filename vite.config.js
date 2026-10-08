import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

// TEMPORARY: block all access to the app. Delete this file, vercel.json and
// public/404.html to bring the calculator back.
const notFoundHtml = readFileSync(new URL("./public/404.html", import.meta.url), "utf-8");

function serve404(req, res) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(notFoundHtml);
}

function blockAll() {
  return {
    name: "block-all",
    // npm run dev
    configureServer(server) {
      server.middlewares.use(serve404);
    },
    // npm run preview
    configurePreviewServer(server) {
      server.middlewares.use(serve404);
    },
    // npm run build: ship only the 404 page, no app JS/CSS
    generateBundle(_, bundle) {
      for (const name of Object.keys(bundle)) delete bundle[name];
      this.emitFile({ type: "asset", fileName: "index.html", source: notFoundHtml });
    },
  };
}

export default defineConfig({
  plugins: [blockAll()],
});
