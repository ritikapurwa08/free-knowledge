
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const markWordAsKnown = mutation({
  args: {
    wordId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("vocabProgress")
      .withIndex("by_user_word", (q) =>
        q.eq("userId", userId).eq("wordId", args.wordId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { status: "mastered" });
    } else {
      await ctx.db.insert("vocabProgress", {
        userId,
        wordId: args.wordId,
        status: "mastered",
      });
    }
  },
});

export const getKnownWords = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const progress = await ctx.db
      .query("vocabProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId)) // Note: Needs index update in schema.ts
      .filter((q) => q.eq(q.field("status"), "mastered"))
      .collect();

    return progress.map((p) => p.wordId);
  },
});
