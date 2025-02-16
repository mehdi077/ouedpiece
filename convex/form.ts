import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { POST_STATUS, DURATIONS } from "./constants";

// Get all available brands
export const getBrands = query({
  args: {},
  handler: async (ctx) => {
    const brands = await ctx.db.query("brands").collect();
    return brands;
  },
});

// Get models for a specific brand
export const getModelsByBrand = query({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    const models = await ctx.db
      .query("models")
      .withIndex("by_brand", (q) => q.eq("brand", args.brandId))
      .collect();
    return models;
  },
});

// Get all categories
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    return categories;
  },
});

// Get subcategories for a specific category
export const getSubcategoriesByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const subcategories = await ctx.db
      .query("subcategories")
      .withIndex("by_category", (q) => q.eq("category", args.categoryId))
      .collect();
    return subcategories;
  },
});

// Get all available years
export const getYears = query({
  args: {},
  handler: async (ctx) => {
    const years = await ctx.db.query("years").collect();
    return years;
  },
});

// Get all available wilayas
export const getWilayas = query({
  args: {},
  handler: async (ctx) => {
    const wilayas = await ctx.db.query("wilayas").collect();
    return wilayas;
  },
});

// // Get category by name
// export const getCategoryByName = query({
//     args: { name: v.string() },
//     handler: async (ctx, args) => {
//       const category = await ctx.db
//         .query("categories")
//         .filter((q) => q.eq(q.field("name"), args.name))
//         .first();
      
//       if (!category) {
//         return null;
//       }
//       return category._id;
//     },
//   });
  
//   // Get brand by name
//   export const getBrandByName = query({
//     args: { name: v.string() },
//     handler: async (ctx, args) => {
//       const brand = await ctx.db
//         .query("brands")
//         .filter((q) => q.eq(q.field("name"), args.name))
//         .first();
      
//       if (!brand) {
//         return null;
//       }
//       return brand._id;
//     },
//   });