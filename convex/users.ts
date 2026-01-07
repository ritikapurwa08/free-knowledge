import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    return user;
  },
});

export const updateUser = mutation({
  args: {
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isAdmin: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.imageUrl !== undefined) updates.imageUrl = args.imageUrl;

    // Securely handle admin upgrade
    if (args.isAdmin !== undefined) {
      if (args.isAdmin === true) {
         // Verify if user is allowed to be admin
         const user = await ctx.db.get(userId);
         const email = user?.email;
         if (email) {
             const defaults = ["ritikapurwa08@gmail.com"];
             const dbAdmins = await ctx.db.query("adminEmails").collect();
             const allowedEmails = [...defaults, ...dbAdmins.map(a => a.email)];

             if (allowedEmails.includes(email)) {
                 updates.isAdmin = true;
             }
         }
      } else {
         // Allow creating dropping admin? Sure.
         updates.isAdmin = false;
      }
    }

    await ctx.db.patch(userId, updates);
  },
});

export const leaderboard = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users
      .sort((a, b) => (b.totalXp ?? 0) - (a.totalXp ?? 0))
      .slice(0, 50)
      .map((u, index) => ({
        rank: index + 1,
        name: u.name,
        totalXp: u.totalXp ?? 0,
        imageUrl: u.imageUrl,
      }));
  },
});

export const userProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Get count of mastered words
    const knownWords = await ctx.db
      .query("vocabProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "mastered"))
      .collect();

    // Get count of completed quizzes
    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // In a real app, these totals could be dynamic or stored in a 'system' table
    const totalWords = 606;
    const totalTests = 3;

    return {
      knownWords: knownWords.length,
      totalWords,
      attemptedTests: results.length,
      totalTests,
    };
  },
});
