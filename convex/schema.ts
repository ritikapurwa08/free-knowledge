
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  // Your other tables...
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.optional(v.string()),
    totalXp: v.number(),
    imageUrl:v.string(),
    bio: v.optional(v.string()),
    streak: v.number(),
    lastLogin: v.number(),
    isAdmin: v.optional(v.boolean()),
  }).index("by_email", ["email"]),

  // We ONLY store the Result, not the questions
  quizResults: defineTable({
    userId: v.id("users"),
    quizId: v.string(), // Matches 'id' in your local JSON file
    score: v.number(),  // e.g., 8 (out of 10)
    maxScore: v.number(),
    completedAt: v.number(),
    answers: v.string(), // Stringified JSON of user answers { questionId: optionIndex }
  }).index("by_user", ["userId"]),

  // Words the user marked as "Should Learn"
  vocabProgress: defineTable({
    userId: v.id("users"),
    wordId: v.string(), // Matches 'id' in vocabulary.json
    status: v.union(v.literal("learning"), v.literal("mastered")),
  }).index("by_user_word", ["userId", "wordId"])
    .index("by_user", ["userId"]),

  adminEmails: defineTable({
    email: v.string(),
    addedBy: v.id("users"),
    addedAt: v.number(),
  }).index("by_email", ["email"]),

  quizzes: defineTable({
    title: v.string(),      // e.g. "Set 1"
    subject: v.string(),    // e.g. "English"
    topic: v.string(),      // e.g. "Nouns"
    questions: v.array(v.object({
        text: v.string(),
        options: v.array(v.string()),
        correctAnswer: v.number(),
        explanation: v.optional(v.string()),
        type: v.string(), // "Single Choice"
    })),
    createdBy: v.optional(v.id("users")),
    createdAt: v.number(),
  })
  .index("by_subject_topic", ["subject", "topic"])
  .index("by_subject", ["subject"]),

  words: defineTable({
    text: v.string(),
    definition: v.string(),
    hindiSynonyms: v.array(v.string()),
    englishSynonyms: v.array(v.string()),
    examples: v.array(v.object({ sentence: v.string() })),
    difficulty: v.string(),
    category: v.string(), // e.g., "word"
    step: v.number(),     // For ordering/pagination (1-50, etc.)
  }).index("by_step", ["step"]),
});
export default schema;


