import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({

  users: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
  }).index("by_user_id", ["userId"]),

  posts: defineTable({
    brand: v.id("brands"),  
    model: v.id("models"),
    year: v.id("years"),
    category: v.id("categories"),
    subcategory: v.id("subcategories"),
    phone: v.number(),
    wilaya: v.id("wilayas"),
    status: v.union(v.literal("valid"), v.literal("expired")),
    images: v.optional(v.array(v.string())),
  })
  .index("by_brand", ["brand"])
  .index("by_model", ["model"])
  .index("by_year", ["year"])
  .index("by_category", ["category"])
  .index("by_subcategory", ["subcategory"])
  .index("by_wilaya", ["wilaya"]),

  categories: defineTable({
    name: v.string(), 
  }),

  subcategories: defineTable({
    name: v.string(),         
    category: v.id("categories"), 
  }).index("by_category", ["category"]),

  brands: defineTable({
    name: v.string(), 
  }),

  models: defineTable({
    name: v.string(),
    brand: v.id("brands"),
  }).index("by_brand", ["brand"]),

  wilayas: defineTable({
    name: v.string(), // 
  }),

  years: defineTable({
    name: v.string(),
  }),
});