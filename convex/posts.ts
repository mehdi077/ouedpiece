import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { POST_STATUS, DURATIONS } from "./constants";

// Internal mutation to expire a post
export const expirePost = internalMutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    await ctx.db.patch(postId, { status: POST_STATUS.EXPIRED });
  },
});

// get all posts except expired
export const getAllPosts = query({
    args: {},
    handler: async (ctx) => {
        const posts = await ctx.db
            .query("posts")
            .filter(q => q.neq(q.field("status"), "expired"))
            .collect();
        return posts;
    },
});

export const createPost = mutation({
  args: {
    brand: v.id("brands"),
    model: v.id("models"),
    year: v.id("years"),
    category: v.id("categories"),
    subcategory: v.id("subcategories"),
    phone: v.number(),
    wilaya: v.id("wilayas"),
  },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert("posts", {
      brand: args.brand,
      model: args.model,
      year: args.year,
      category: args.category,
      subcategory: args.subcategory,
      phone: args.phone,
      wilaya: args.wilaya,
      status: POST_STATUS.VALID,
    });

    // Schedule the post to expire after 24 hours
    await ctx.scheduler.runAfter(
      DURATIONS.POST_EXPIRATION,
      internal.posts.expirePost,
      { postId }
    );
    return postId;
  },
});

// * this must run immidiatly after we run createPost in order
// to get the postId and pass it here. 
export const addPostImages = mutation({
    args: { postId: v.id("posts"), images: v.array(v.string()) },
    handler: async (ctx, { postId, images }) => {
      // Retrieve the current post to see if there are already images.
      const post = await ctx.db.get(postId);
      const currentImages = post?.images || [];
      // Append new images to the already stored images.
      await ctx.db.patch(postId, { images: [...currentImages, ...images] });
      return { success: true };
    },
  });

export const getPostImagesByPostId = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const post = await ctx.db.get(postId);
    if (!post) return null;
    return post.images || [];
  },
});

// New endpoint to convert a list of storage IDs to URLs
export const getImageUrls = query({
  args: { storageIds: v.array(v.string()) },
  handler: async (ctx, { storageIds }) => {
    const urls = await Promise.all(
      storageIds.map(async (storageId) => {
        return await ctx.storage.getUrl(storageId);
      })
    );
    return urls;
  },
});

// Get post details by postId
export const getPostDetails = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const post = await ctx.db.get(postId);
    if (!post) return null;

    // Fetch related data
    const brand = await ctx.db.get(post.brand);
    const model = await ctx.db.get(post.model);
    const year = await ctx.db.get(post.year);
    const category = await ctx.db.get(post.category);
    const subcategory = await ctx.db.get(post.subcategory);
    const wilaya = await ctx.db.get(post.wilaya);

    return {
      brand: brand?.name,
      model: model?.name,
      year: year?.name,
      category: category?.name,
      subcategory: subcategory?.name,
      phone: post.phone,
      wilaya: wilaya?.name,
      status: post.status, // Added status field
    };
  },
});

// Get post creation time by postId
export const getPostCreationTime = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const post = await ctx.db.get(postId);
    if (!post) return null;
    return post._creationTime;
  },
});

// Get filtered posts based on selected filter values
export const getFilteredPosts = query({
  args: {
    brandId: v.optional(v.id("brands")),
    modelId: v.optional(v.id("models")),
    categoryId: v.optional(v.id("categories")),
    subcategoryId: v.optional(v.id("subcategories")),
    yearId: v.optional(v.id("years")),
    wilayaId: v.optional(v.id("wilayas")),
  },
  handler: async (ctx, args) => {
    let postsQuery = ctx.db
      .query("posts")
      // Filter out expired posts first
      .filter(q => q.neq(q.field("status"), "expired"));

    // Apply each filter only if the corresponding ID is provided
    if (args.brandId) {
      postsQuery = postsQuery.filter(q => q.eq(q.field("brand"), args.brandId));
    }
    if (args.modelId) {
      postsQuery = postsQuery.filter(q => q.eq(q.field("model"), args.modelId));
    }
    if (args.categoryId) {
      postsQuery = postsQuery.filter(q => q.eq(q.field("category"), args.categoryId));
    }
    if (args.subcategoryId) {
      postsQuery = postsQuery.filter(q => q.eq(q.field("subcategory"), args.subcategoryId));
    }
    if (args.yearId) {
      postsQuery = postsQuery.filter(q => q.eq(q.field("year"), args.yearId));
    }
    if (args.wilayaId) {
      postsQuery = postsQuery.filter(q => q.eq(q.field("wilaya"), args.wilayaId));
    }

    return await postsQuery.collect();
  },
});

// Search posts based on query string
export const getSearchResults = query({
  args: { query: v.string() },
  handler: async (ctx, { query }) => {
    if (!query.trim()) {
      return [];
    }

    const searchQuery = query.toLowerCase().trim();
    const searchTerms = searchQuery.split(/\s+/); // Split into individual terms

    // Get all valid posts
    const posts = await ctx.db
      .query("posts")
      .filter(q => q.neq(q.field("status"), "expired"))
      .collect();

    // Get all the related data we need to search through
    const models = await ctx.db.query("models").collect();
    const categories = await ctx.db.query("categories").collect();
    const subcategories = await ctx.db.query("subcategories").collect();
    const brands = await ctx.db.query("brands").collect();
    const years = await ctx.db.query("years").collect();
    const wilayas = await ctx.db.query("wilayas").collect();

    // Create lookup maps for faster access
    const modelsMap = new Map(models.map(m => [m._id, m.name.toLowerCase()]));
    const categoriesMap = new Map(categories.map(c => [c._id, c.name.toLowerCase()]));
    const subcategoriesMap = new Map(subcategories.map(s => [s._id, s.name.toLowerCase()]));
    const brandsMap = new Map(brands.map(b => [b._id, b.name.toLowerCase()]));
    const yearsMap = new Map(years.map(y => [y._id, y.name.toLowerCase()]));
    const wilayasMap = new Map(wilayas.map(w => [w._id, w.name.toLowerCase()]));

    // Filter posts based on search query
    return posts.filter(post => {
      const modelName = modelsMap.get(post.model) || "";
      const categoryName = categoriesMap.get(post.category) || "";
      const subcategoryName = subcategoriesMap.get(post.subcategory) || "";
      const brandName = brandsMap.get(post.brand) || "";
      const yearName = yearsMap.get(post.year) || "";
      const wilayaName = wilayasMap.get(post.wilaya) || "";
      const phoneNumber = post.phone?.toString() || "";

      // Combine all searchable text
      const searchableText = `${modelName} ${categoryName} ${subcategoryName} ${brandName} ${yearName} ${wilayaName} ${phoneNumber}`.toLowerCase();

      // Check if ALL search terms are found in the searchable text
      return searchTerms.every(term => searchableText.includes(term));
    });
  },
});


