import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getSurveys = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const surveys = await ctx.db
      .query("surveys")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    return surveys;
  },
});

export const getSurveyStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const surveys = await ctx.db
      .query("surveys")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    const today = new Date().toISOString().split("T")[0];
    const todaysSurveys = surveys.filter((s) => s.date.startsWith(today)).length;

    return {
      total: surveys.length,
      today: todaysSurveys,
      recent: surveys.slice(0, 5),
    };
  },
});

export const createSurvey = mutation({
  args: {
    userId: v.string(),
    siteName: v.string(),
    client: v.string(),
    description: v.string(),
    priority: v.string(),
    date: v.string(),
    photo: v.optional(v.string()),
    location: v.optional(v.object({ latitude: v.number(), longitude: v.number() })),
    contact: v.optional(v.object({ name: v.string(), phoneNumber: v.string() })),
  },
  handler: async (ctx, args) => {
    const surveyId = await ctx.db.insert("surveys", {
      userId: args.userId,
      siteName: args.siteName,
      client: args.client,
      description: args.description,
      priority: args.priority,
      date: args.date,
      photo: args.photo,
      location: args.location,
      contact: args.contact,
    });
    return surveyId;
  },
});

export const deleteSurvey = mutation({
  args: { id: v.id("surveys") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
