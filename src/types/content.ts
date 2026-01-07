// src/types/content.ts

// Structure for a Question inside a JSON file
export interface Question {
  id: string; // Unique string ID (e.g., "q-1678886400000")
  text: string;
  type: "Single Choice" | "Multiple Choice";
  options: string[];
  correctAnswer: number; // Index 0-3 for Single Choice
  explanation?: string;
  imageUrl?: string;
}

// Structure for a Quiz JSON file (e.g., src/data/quizzes/noun-basics.json)
export interface QuizData {
  id: string; // Unique string ID (e.g., "noun-basics")
  title: string;
  subject: string; // e.g., "English Grammar"
  topic: string;   // e.g., "Nouns"
  difficulty: string; // e.g., "Easy", "Medium", "Hard"
  timeLimit: number; // Seconds
  questions: Question[];
}

// Structure for Vocabulary JSON (src/data/vocabulary.json)
export interface VocabWord {
  id: string;
  word: string;
  meaningEn: string;
  meaningHi: string;
  pronunciation: string;
  example: string;
  category: string; // e.g., "Travel", "Business"
}

// Structure for PDFs (src/data/resources.json)
export interface PDFResource {
  topic: string;
  id: string;
  title: string;
  subject: string;
  fileName: string; // "grammar-guide.pdf" (points to public/pdfs/)
  size: string;
  dateAdded: string;
  url:string;
}
