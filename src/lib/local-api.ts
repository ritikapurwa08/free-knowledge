import {type  QuizData,type  PDFResource } from "@/types/content";

const API_BASE_URL = "http://localhost:4000";

// --- SAVE ---
export async function saveQuizToDisk(data: QuizData) {
  try {
    const response = await fetch(`${API_BASE_URL}/save-quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: data.id, content: data }),
    });
    if (!response.ok) throw new Error("Server Error");
    return await response.json();
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
}

// --- FETCH QUIZZES ---
export async function fetchAllQuizzes(): Promise<QuizData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/list-quizzes`);
    if (!response.ok) return [];
    return await response.json();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error("Make sure 'bun run scripts/fs-server.ts' is running!");
    return [];
  }
}

// --- FETCH PDFS ---
export async function fetchAllPDFs(): Promise<PDFResource[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/list-pdfs`);
    if (!response.ok) return [];
    return await response.json();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return [];
  }
}

// --- 4. UPLOAD PDF (POST) ---
export async function uploadPDF(file: File, folderPath: string) {
  try {
    const reader = new FileReader();
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      reader.onload = async () => {
        try {
          const content = reader.result as string;
          const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: file.name,
              folderPath,
              content
            }),
          });

          if (!response.ok) throw new Error("Server Upload Failed");
          resolve(await response.json());
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          resolve({ success: false, error: (err as any).message });
        }
      };
      reader.onerror = () => resolve({ success: false, error: "File Read Error" });
      reader.readAsDataURL(file);
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: false, error: (error as any).message };
  }
}
