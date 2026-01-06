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
