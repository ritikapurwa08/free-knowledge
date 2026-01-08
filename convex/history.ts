import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getHistory = query({
  args: {
  },
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const results = await ctx.db
      .query("quizResults")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Fetch quiz details for each result
    const enriched = await Promise.all(
      results.map(async (r) => {
        const validQuizId = ctx.db.normalizeId("quizzes", r.quizId);
        const quiz = validQuizId ? await ctx.db.get(validQuizId) : null;

        let quizTitle = "Unknown Quiz";
        let quizSubject = "Other";
        let quizTopic = "Other";

        if (quiz) {
            quizTitle = quiz.title;
            quizSubject = quiz.subject;
            quizTopic = quiz.topic;
        }

        return {
          ...r,
          quizTitle,
          quizSubject,
          quizTopic,
        };
      })
    );

    return enriched.sort((a, b) => b.completedAt - a.completedAt);
  },
});
