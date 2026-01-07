export type QuestionType = "Single Choice" | "Multiple Choice";
export type Subject = "English" | "Math" | "Science" | "Raj Geography" | "Raj History" | "Biology" | "Chemistry" | "Physics" | " Raj Culture";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation?: string;

  // Metadata for filtering
  subject: Subject;      // e.g., "English"
  topic: string;        // e.g., "Noun"
  difficulty?: "Easy" | "Medium" | "Hard";
  tags?: string[];
}

export interface QuizFilter {
  subject?: string;
  topic?: string;
  difficulty?: string;
}
