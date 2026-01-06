
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
    streak: v.number(),
    lastLogin: v.number(),
  }).index("by_email", ["email"]),

  // We ONLY store the Result, not the questions
  quizResults: defineTable({
    userId: v.id("users"),
    quizId: v.string(), // Matches 'id' in your local JSON file
    score: v.number(),  // e.g., 8 (out of 10)
    maxScore: v.number(),
    completedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Words the user marked as "Should Learn"
  vocabProgress: defineTable({
    userId: v.id("users"),
    wordId: v.string(), // Matches 'id' in vocabulary.json
    status: v.union(v.literal("learning"), v.literal("mastered")),
  }).index("by_user_word", ["userId", "wordId"]),
});

export default schema;


