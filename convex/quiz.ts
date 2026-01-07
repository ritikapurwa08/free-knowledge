import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const saveResult = mutation({
  args: {
    quizId: v.string(),
    score: v.number(),
    maxScore: v.number(),
    answers: v.string(), // JSON string
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const resultId = await ctx.db.insert("quizResults", {
      userId,
      quizId: args.quizId,
      score: args.score,
      maxScore: args.maxScore,
      answers: args.answers,
      completedAt: Date.now(),
    });

    // Update user XP (Simple logic: 10 XP per quiz + score)
    const user = await ctx.db.get(userId);
    if (user) {
        await ctx.db.patch(userId, {
            totalXp: (user.totalXp || 0) + 10 + args.score
        });
    }

    return resultId;
  },
});

export const getHistory = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return results;
  },
});

export const getResult = query({
    args: { resultId: v.id("quizResults") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const result = await ctx.db.get(args.resultId);
        if (!result) return null;

        if (result.userId !== userId) {
            throw new Error("Unauthorized");
        }

        return result;
    }
});

// --- QUIZ MANAGEMENT ---

export const createQuiz = mutation({
  args: {
    title: v.string(),
    subject: v.string(),
    topic: v.string(),
    questions: v.array(v.object({
        text: v.string(),
        options: v.array(v.string()),
        correctAnswer: v.number(),
        explanation: v.optional(v.string()),
        type: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    // Optional: Check if user is admin

    const quizId = await ctx.db.insert("quizzes", {
        title: args.title,
        subject: args.subject,
        topic: args.topic,
        questions: args.questions,
        createdBy: userId ?? undefined,
        createdAt: Date.now(),
    });
    return quizId;
  },
});

export const getQuizzes = query({
    args: {
        subject: v.optional(v.string()),
        topic: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const q = ctx.db.query("quizzes");

        if (args.subject && args.topic) {
             return await q.withIndex("by_subject_topic", q => q.eq("subject", args.subject!).eq("topic", args.topic!)).collect();
        }

        if (args.subject) {
            return await q.withIndex("by_subject", q => q.eq("subject", args.subject!)).collect();
        }

        return await q.collect();
    }
});

export const deleteQuiz = mutation({
    args: { quizId: v.id("quizzes") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");
        // Add admin check here ideally
        await ctx.db.delete(args.quizId);
    }
});
