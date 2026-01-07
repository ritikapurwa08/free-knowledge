import { type QuizData, type PDFResource } from "@/types/content";
import { MASTER_QUESTION_DATABASE } from "@/data/quizzes/database";
import { pdfsArray } from "@/data/pdfs/pdfs";

// --- SAVE ---
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function saveQuizToDisk(_data: QuizData) {
  console.warn("Saving to disk via UI is disabled. Please add questions to src/data/quizzes/database.ts");
  alert("Saving to disk via UI is disabled. Please add questions to src/data/quizzes/database.ts");
  return { success: false, error: "Feature disabled. Manage questions in code." };
}

// --- FETCH QUIZZES ---
export async function fetchAllQuizzes(): Promise<QuizData[]> {
  // Group questions by Subject + Topic
  const groups = new Map<string, typeof MASTER_QUESTION_DATABASE>();

  for (const q of MASTER_QUESTION_DATABASE) {
    const key = `${q.subject}|${q.topic}`;
    if (!groups.has(key)) {
        groups.set(key, []);
    }
    groups.get(key)!.push(q);
  }

  const quizzes: QuizData[] = [];
  groups.forEach((questions, key) => {
      const [subject, topic] = key.split("|");
      quizzes.push({
          id: key.toLowerCase().replace(/\|/g, "-").replace(/\s+/g, "-"),
          title: topic,
          subject: subject,
          topic: topic,
          difficulty: "Medium", // Default
          timeLimit: 60 * 10, // 10 mins default
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          questions: questions as any
      });
  });

  return quizzes;
}

// --- FETCH PDFS ---

export async function fetchAllPDFs(): Promise<PDFResource[]> {
  // Return static list, mapped to match PDFResource interface if needed
  // The interface in content.ts has some extra fields like size/dateAdded which we might mock or ignore
  return pdfsArray.map(p => ({
    id: p.id,
    title: p.title,
    subject: p.subject,
    topic: p.topic,
    fileName: p.title + ".pdf",
    url: p.url,
    size: "Unknown", // Mock
    dateAdded: new Date().toISOString(), // Mock
    // topic in content.ts is 'any', keeping it string for now
  }));
}

// --- 4. UPLOAD PDF (POST) ---
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function uploadPDF(_file: File, _folderPath: string) {
  console.warn("Uploading PDF via UI is disabled. Please add files to src/data/pdfs and update pdfs.ts");
  alert("Uploading PDF via UI is disabled. Please add files to src/data/pdfs and update pdfs.ts");
  return { success: false, error: "Feature disabled. Manage files in code." };
}
