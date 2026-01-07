import type { Question } from "./quiz.question.type";

export const MASTER_QUESTION_DATABASE: Question[] = [
  // --- ENGLISH: NOUNS ---
  {
    id: "eng-noun-001",
    text: "Identify the proper noun in the sentence: 'George is going to London.'",
    type: "Single Choice",
    options: ["George", "London", "Both George and London", "Neither"],
    correctAnswer: 2,
    explanation: "Both 'George' (a person) and 'London' (a place) are specific names, making them proper nouns.",
    subject: "English",
    topic: "Noun",
    difficulty: "Easy"
  },
  {
    id: "eng-noun-002",
    text: "Which of the following is a collective noun?",
    type: "Single Choice",
    options: ["Soldier", "Army", "Battle", "Uniform"],
    correctAnswer: 1,
    explanation: "'Army' refers to a group of soldiers, making it a collective noun.",
    subject: "English",
    topic: "Noun",
    difficulty: "Easy"
  },

  // --- ENGLISH: VERBS ---
  {
    id: "eng-verb-001",
    text: "Choose the correct verb form: 'She ___ to the market yesterday.'",
    type: "Single Choice",
    options: ["go", "goes", "went", "gone"],
    correctAnswer: 2,
    explanation: "The sentence is in the past tense (yesterday), so 'went' is the correct form.",
    subject: "English",
    topic: "Verbs",
    difficulty: "Medium"
  }
];

// Helper to filter questions
export function getQuestionsByTopic(subject: string, topic: string) {
  return MASTER_QUESTION_DATABASE.filter(
    (q) => q.subject.toLowerCase() === subject.toLowerCase() &&
           q.topic.toLowerCase() === topic.toLowerCase()
  );
}

export function getAllTopics(subject: string) {
    const questions = MASTER_QUESTION_DATABASE.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
    // Get unique topics
    return Array.from(new Set(questions.map(q => q.topic)));
}
