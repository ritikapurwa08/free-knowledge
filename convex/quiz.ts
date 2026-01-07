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
