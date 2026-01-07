// scripts/fs-server.ts
import { readdir, mkdir, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const QUIZ_DIR = "./src/data/quizzes";
const PDF_DIR = "./public/pdfs";

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
    if (error.code === 'ENOENT') return [];
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
        // Ensure directory exists
        await mkdir(PDF_DIR, { recursive: true });

        const allFiles = await getPdfFilesRecursively(PDF_DIR);

        const pdfs = allFiles.map((filePath) => {
          // Get relative path from public/pdfs to parse Subject/Topic
          // e.g. "public/pdfs/English/Grammar/test.pdf" -> "English/Grammar/test.pdf"
          const relPath = relative(PDF_DIR, filePath);

          // Split by separator to get parts
          const parts = relPath.split(sep);
          const fileName = parts.pop()!; // test.pdf

          // Default subject/topic if in root
          let subject = "General";
          let topic = "Uncategorized";

          if (parts.length >= 1) subject = parts[0];
          if (parts.length >= 2) topic = parts[1];

          // Construct web-accessible URL (convert backslashes to slashes for URL)
          const urlPath = relPath.split(sep).join("/");

          return {
            id: relPath, // Use relative path as ID
            title: fileName.replace(".pdf", "").replace(/-/g, " "),
            subject,
            topic,
            fileName: fileName,
            url: `/pdfs/${urlPath}`
          };
        });

        return new Response(JSON.stringify(pdfs), { headers: CORS_HEADERS });
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

        // Clean folder path (remove leading/trailing slashes, prevent traversal)
        const safeFolderPath = (folderPath || "").replace(/^(\.\.(\/|\\|$))+/, "");
        const targetDir = join(PDF_DIR, safeFolderPath);

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
