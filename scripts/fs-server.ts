// scripts/fs-server.ts
import { readdir } from "node:fs/promises"; // Bun implements this standard API efficiently
import { join } from "node:path";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const QUIZ_DIR = "./src/data/quizzes";
const PDF_DIR = "./public/pdfs";

console.log("🚀 Bun Local Content Server running on http://localhost:4000");

Bun.serve({
  port: 4000,
  async fetch(req) {
    // Handle CORS Preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(req.url);

    // --- 1. LIST QUIZZES (GET) ---
    if (url.pathname === "/list-quizzes" && req.method === "GET") {
      try {
        // Ensure directory exists; if not, return empty
        const file = Bun.file(QUIZ_DIR);
        if (!(await file.exists()) && (await readdir(QUIZ_DIR).catch(() => null)) === null) {
           return new Response(JSON.stringify([]), { headers: CORS_HEADERS });
        }

        const files = await readdir(QUIZ_DIR);

        // Read each JSON file to get metadata
        const quizzes = await Promise.all(
          files.filter(f => f.endsWith(".json")).map(async (filename) => {
            const content = await Bun.file(join(QUIZ_DIR, filename)).json();
            return content;
          })
        );

        return new Response(JSON.stringify(quizzes), { headers: CORS_HEADERS });
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify([]), { headers: CORS_HEADERS });
      }
    }

    // --- 2. SAVE QUIZ (POST) ---
    if (url.pathname === "/save-quiz" && req.method === "POST") {
      try {
        const data = await req.json();
        const path = join(QUIZ_DIR, `${data.fileName}.json`);

        // Bun.write handles directory creation automatically if it doesn't exist?
        // Actually Bun.write writes to file. We might need to ensure dir exists lightly.
        // But for simplicity, we assume the folder exists or use node:fs mkdir if needed.
        // Let's use Bun.write directly, it's very fast.

        await Bun.write(path, JSON.stringify(data.content, null, 2));

        console.log(`✅ Saved: ${path}`);
        return new Response(JSON.stringify({ success: true }), { headers: CORS_HEADERS });
      } catch (err) {
        return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: CORS_HEADERS });
      }
    }

    // --- 3. LIST PDFS (GET) ---
    if (url.pathname === "/list-pdfs" && req.method === "GET") {
      try {
        // Check if directory exists
        if ((await readdir(PDF_DIR).catch(() => null)) === null) {
             return new Response(JSON.stringify([]), { headers: CORS_HEADERS });
        }

        const files = await readdir(PDF_DIR);
        const pdfs = files
          .filter(f => f.endsWith(".pdf"))
          .map(f => ({
            id: f,
            title: f.replace(".pdf", "").replace(/-/g, " "), // "eng-grammar.pdf" -> "eng grammar"
            fileName: f,
            url: `/pdfs/${f}` // Since it's in public/, React serves it at root
          }));

        return new Response(JSON.stringify(pdfs), { headers: CORS_HEADERS });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return new Response(JSON.stringify([]), { headers: CORS_HEADERS });
      }
    }

    return new Response("Not Found", { status: 404, headers: CORS_HEADERS });
  },
});
