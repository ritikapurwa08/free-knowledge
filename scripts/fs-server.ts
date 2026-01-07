// scripts/fs-server.ts
import { readdir, mkdir, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const QUIZ_DIR = "./src/data/quizzes";
const PDF_DIRS = ["./public/pdfs", "./public/pdf"];

console.log("🚀 Bun Local Content Server running on http://localhost:4000");

// Helper: Recursively get all PDF files
async function getPdfFilesRecursively(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const res = join(dir, entry.name);
        if (entry.isDirectory()) {
          return getPdfFilesRecursively(res);
        } else {
          return entry.name.toLowerCase().endsWith(".pdf") ? res : [];
        }
      })
    );
    return files.flat();
  } catch (error) {
    if ((error as { code?: string }).code === 'ENOENT') return [];
    throw error;
  }
}

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
        const file = Bun.file(QUIZ_DIR);
        if (!(await file.exists()) && (await readdir(QUIZ_DIR).catch(() => null)) === null) {
           return new Response(JSON.stringify([]), { headers: CORS_HEADERS });
        }

        const files = await readdir(QUIZ_DIR);
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
        await Bun.write(path, JSON.stringify(data.content, null, 2));
        console.log(`✅ Saved Quiz: ${path}`);
        return new Response(JSON.stringify({ success: true }), { headers: CORS_HEADERS });
      } catch (err) {
        return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: CORS_HEADERS });
      }
    }

    // --- 3. LIST PDFS (GET) ---
    if (url.pathname === "/list-pdfs" && req.method === "GET") {
      try {
        // Ensure directories exist
        await Promise.all(PDF_DIRS.map(dir => mkdir(dir, { recursive: true })));

        const allPdfs = await Promise.all(
          PDF_DIRS.map(async (dir) => {
             const files = await getPdfFilesRecursively(dir);
             return files.map((filePath) => {
                // Get relative path from its root dir
                const relPath = relative(dir, filePath);
                const parts = relPath.split(sep);
                const fileName = parts.pop()!;

                let subject = "General";
                let topic = "Uncategorized";

                if (parts.length >= 1) subject = parts[0];
                if (parts.length >= 2) topic = parts[1];

                // Construct web-accessible URL
                // We need to know WHICH dir this came from to form the URL
                // But simplified: everything in public/ is served at root
                // e.g. public/pdfs/... -> /pdfs/...
                // e.g. public/pdf/...  -> /pdf/...

                // Hacky but works for valid public dirs:
                // filePath is like "public/pdfs/Eng/Grammar/test.pdf"
                // url should be "/pdfs/Eng/Grammar/test.pdf"
                // slice off "public"
                const webPath = filePath.replace(/\\/g, "/").replace(/^public\//, "/");

                return {
                    id: filePath,
                    title: fileName.replace(".pdf", "").replace(/-/g, " "),
                    subject,
                    topic,
                    fileName,
                    url: webPath
                };
             });
          })
        );

        return new Response(JSON.stringify(allPdfs.flat()), { headers: CORS_HEADERS });
      } catch (err) {
        console.error("Error listing PDFs:", err);
        return new Response(JSON.stringify([]), { headers: CORS_HEADERS });
      }
    }

    // --- 4. UPLOAD PDF (POST) ---
    if (url.pathname === "/upload-pdf" && req.method === "POST") {
      try {
        const { fileName, folderPath, content } = await req.json();

        if (!fileName || !content) {
             return new Response(JSON.stringify({ error: "Missing filename or content" }), { status: 400, headers: CORS_HEADERS });
        }

        // Clean folder path
        const safeFolderPath = (folderPath || "").replace(/^(\.\.(\/|\\|$))+/, "");
        // ALWAYS upload to the first configured directory (public/pdfs)
        const targetDir = join(PDF_DIRS[0], safeFolderPath);

        // Create directory if it doesn't exist
        await mkdir(targetDir, { recursive: true });

        const fullPath = join(targetDir, fileName);

        // Content is expected to be Base64
        // Base64 format usually: "data:application/pdf;base64,JVBERi0..."
        const base64Data = content.replace(/^data:.+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        await writeFile(fullPath, buffer);

        console.log(`✅ Uploaded PDF: ${fullPath}`);
        return new Response(JSON.stringify({ success: true, path: fullPath }), { headers: CORS_HEADERS });

      } catch (err) {
        console.error("Upload Error:", err);
        return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: CORS_HEADERS });
      }
    }

    return new Response("Not Found", { status: 404, headers: CORS_HEADERS });
  },
});
