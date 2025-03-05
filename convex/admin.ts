import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all subcategories
export const getAllSubcategories = query({
  args: {},
  handler: async (ctx) => {
    const subcategories = await ctx.db.query("subcategories").collect();
    return subcategories;
  },
});

// Add multiple categories at once
export const addCategories = mutation({
  args: {
    categories: v.array(v.object({ name: v.string() })),
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const category of args.categories) {
      // Check if category already exists to avoid duplicates
      const existing = await ctx.db
        .query("categories")
        .filter((q) => q.eq(q.field("name"), category.name))
        .first();
      
      if (!existing) {
        const id = await ctx.db.insert("categories", { name: category.name });
        results.push({ id, name: category.name, status: "created" });
      } else {
        results.push({ id: existing._id, name: category.name, status: "already_exists" });
      }
    }
    return results;
  },
});

// Add subcategories linked to a specific category
export const addSubcategories = mutation({
  args: {
    categoryId: v.id("categories"),
    subcategories: v.array(v.object({ name: v.string() })),
  },    
  handler: async (ctx, args) => {
    // First verify that the category exists
    const category = await ctx.db.get(args.categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    const results = [];
    for (const subcategory of args.subcategories) {
      // Check if subcategory already exists in this category
      const existing = await ctx.db
        .query("subcategories")
        .withIndex("by_category", (q) => q.eq("category", args.categoryId))
        .filter((q) => q.eq(q.field("name"), subcategory.name))
        .first();

      if (!existing) {
        const id = await ctx.db.insert("subcategories", {
          name: subcategory.name,
          category: args.categoryId,
        });
        results.push({ id, name: subcategory.name, status: "created" });
      } else {
        results.push({ id: existing._id, name: subcategory.name, status: "already_exists" });
      }
    }
    return results;
  },
});

// Add multiple brands at once
export const addBrands = mutation({
  args: {
    brands: v.array(v.object({ name: v.string() })),
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const brand of args.brands) {
      // Check if brand already exists
      const existing = await ctx.db
        .query("brands")
        .filter((q) => q.eq(q.field("name"), brand.name))
        .first();

      if (!existing) {
        const id = await ctx.db.insert("brands", { name: brand.name });
        results.push({ id, name: brand.name, status: "created" });
      } else {
        results.push({ id: existing._id, name: brand.name, status: "already_exists" });
      }
    }
    return results;
  },
});

// Add models linked to a specific brand
export const addModels = mutation({
  args: {
    brandId: v.id("brands"),
    models: v.array(v.object({ name: v.string() })),
  },
  handler: async (ctx, args) => {
    // First verify that the brand exists
    const brand = await ctx.db.get(args.brandId);
    if (!brand) {
      throw new Error("Brand not found");
    }

    const results = [];
    for (const model of args.models) {
      // Check if model already exists for this brand
      const existing = await ctx.db
        .query("models")
        .withIndex("by_brand", (q) => q.eq("brand", args.brandId))
        .filter((q) => q.eq(q.field("name"), model.name))
        .first();

      if (!existing) {
        const id = await ctx.db.insert("models", {
          name: model.name,
          brand: args.brandId,
        });
        results.push({ id, name: model.name, status: "created" });
      } else {
        results.push({ id: existing._id, name: model.name, status: "already_exists" });
      }
    }
    return results;
  },
});

// Delete mutations for each type
export const deleteBrand = mutation({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    // First delete all models associated with this brand
    const models = await ctx.db
      .query("models")
      .withIndex("by_brand", (q) => q.eq("brand", args.brandId))
      .collect();
    
    for (const model of models) {
      await ctx.db.delete(model._id);
    }
    
    // Then delete the brand
    await ctx.db.delete(args.brandId);
    return { success: true };
  },
});

export const deleteModel = mutation({
  args: { modelId: v.id("models") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.modelId);
    return { success: true };
  },
});

export const deleteCategory = mutation({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    // First delete all subcategories associated with this category
    const subcategories = await ctx.db
      .query("subcategories")
      .withIndex("by_category", (q) => q.eq("category", args.categoryId))
      .collect();
    
    for (const subcategory of subcategories) {
      await ctx.db.delete(subcategory._id);
    }
    
    // Then delete the category
    await ctx.db.delete(args.categoryId);
    return { success: true };
  },
});

export const deleteSubcategory = mutation({
  args: { subcategoryId: v.id("subcategories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.subcategoryId);
    return { success: true };
  },
});


