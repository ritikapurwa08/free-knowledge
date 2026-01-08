import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getWords = query({
  args: {
    start: v.number(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    // We want to fetch words where step >= start and step < start + limit
    // efficient way: filter? or just scan relying on index?
    // step is indexed.

    // convex doesn't have standard "range" query easily on custom fields without extensive indexing
    // but we can use .withIndex("by_step", q => q.gte("step", args.start))
    // and then .take(args.limit) assuming steps are contiguous or close enough.
    // Actually, step is just an integer ID 1..N.

    const words = await ctx.db
      .query("words")
      .withIndex("by_step", (q) => q.gte("step", args.start))
      .take(args.limit);

    return words;
  },
});

export const getKnownWords = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
        return [];
    }

    const progress = await ctx.db
      .query("vocabProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return progress
        .filter(p => p.status === "mastered")
        .map(p => p.wordId);
  },
});

export const seedWords = mutation({
  args: {
    words: v.array(
      v.object({
        text: v.string(),
        definition: v.string(),
        hindiSynonyms: v.array(v.string()),
        englishSynonyms: v.array(v.string()),
        examples: v.array(v.object({ sentence: v.string() })),
        difficulty: v.string(),
        category: v.string(),
        step: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Check if admin? For now, open or just trust the caller for this one-off
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // In a real app, verify admin email here.

    for (const word of args.words) {
      // Check if exists to avoid dupes?
      const existing = await ctx.db
        .query("words")
        .withIndex("by_step", (q) => q.eq("step", word.step))
        .first();

      if (!existing) {
        await ctx.db.insert("words", word);
      }
    }
  },
});

export const markWordAsLearned = mutation({
  args: {
    wordId: v.string(), // This is effectively the 'text' or 'id' from JSON, but we might want to store our doc ID?
                        // Let's use the DB ID if possible, but the frontend might have the 'step' or 'text'.
                        // Actually, the existing schema used 'wordId' string. Let's stick to that for now,
                        // or better, use the Convex ID.
                        // Wait, schema.ts said: wordId: v.string() // Matches 'id' in vocabulary.json
                        // The JSON has "id": "immaculate".

    status: v.union(v.literal("learning"), v.literal("mastered")),
    wordStringId: v.string(), // The string ID from the word object, e.g. "immaculate"
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // 1. Update/Insert vocabProgress
    const existingProgress = await ctx.db
        .query("vocabProgress")
        .withIndex("by_user_word", (q) => q.eq("userId", userId).eq("wordId", args.wordStringId))
        .unique();

    let wasAlreadyMastered = false;

    if (existingProgress) {
        if (existingProgress.status === "mastered") {
            wasAlreadyMastered = true;
        }
        await ctx.db.patch(existingProgress._id, { status: args.status });
    } else {
        await ctx.db.insert("vocabProgress", {
            userId,
            wordId: args.wordStringId,
            status: args.status,
        });
    }

    // 2. Update User XP if newly mastered
    if (args.status === "mastered" && !wasAlreadyMastered) {
        const user = await ctx.db.get(userId);
        if (user) {
            await ctx.db.patch(userId, {
                totalXp: (user.totalXp || 0) + 10, // 10 XP per word
                // could update streak here too if we want word-based streaks
            });
        }
    }
  },
});
