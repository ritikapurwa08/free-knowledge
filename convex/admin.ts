import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAdminEmails = query({
  args: {},
  handler: async (ctx) => {
    // Default + configured admins
    // You can hardcode your initial admin email here as a fallback
    const defaults = ["ritikapurwa08@gmail.com"];

    const configured = await ctx.db.query("adminEmails").collect();
    const configuredEmails = configured.map(a => a.email);

    // Merge and dedupe
    return [...new Set([...defaults, ...configuredEmails])];
  },
});

export const addAdminEmail = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // Check if caller is admin first
    const user = await ctx.db.get(userId);
    if (!user?.isAdmin) throw new Error("Admin only");

    // Check if duplicate
    const existing = await ctx.db
      .query("adminEmails")
      .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
      .first();

    if (existing) return { success: true, message: "Already exists" };

    // Add to admin list
    await ctx.db.insert("adminEmails", {
      email: email.toLowerCase(),
      addedBy: userId,
      addedAt: Date.now(),
    });

    return { success: true };
  },
});

export const getAllAdmins = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("adminEmails").collect();
  },
});
