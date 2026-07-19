import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  surveys: defineTable({
    userId: v.string(),
    siteName: v.string(),
    client: v.string(),
    description: v.string(),
    priority: v.string(),
    date: v.string(),
    photo: v.optional(v.string()),
    location: v.optional(v.object({ latitude: v.number(), longitude: v.number() })),
    contact: v.optional(v.object({ name: v.string(), phoneNumber: v.string() })),
  }).index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"]),
});
