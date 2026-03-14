/**
 * Batch API Endpoint
 * Consolidates multiple data requests into a single endpoint
 * Reduces network round trips significantly on 3G connections
 */

import mongooseConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { Category } from "@/models/Category";
import Hero from "@/models/Hero";

export default async function handler(req, res) {
  const { sections = "" } = req.query;

  // Parse requested sections
  const requested = sections
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (requested.length === 0) {
    return res
      .status(400)
      .json({
        error: "No sections requested. Use ?sections=products,categories,featured",
      });
  }

  try {
    await mongooseConnect();
    const results = {};

    // Fetch products
    if (requested.includes("products")) {
      try {
        results.products = await Product.find()
          .lean() // Faster MongoDB query
          .limit(20)
          .select("_id name price salePriceIncTax image isPromotion category rating");
      } catch (err) {
        results.products = [];
      }
    }

    // Fetch categories
    if (requested.includes("categories")) {
      try {
        results.categories = await Category.find()
          .lean()
          .select("_id name image");
      } catch (err) {
        results.categories = [];
      }
    }

    // Fetch featured products (for homepage)
    if (requested.includes("featured")) {
      try {
        results.featured = await Product.find({ isFeatured: true })
          .lean()
          .limit(12)
          .select("_id name price salePriceIncTax image isPromotion rating");
      } catch (err) {
        results.featured = [];
      }
    }

    // Fetch hero slides
    if (requested.includes("heroes")) {
      try {
        results.heroes = await Hero.find()
          .lean()
          .sort({ position: 1 })
          .select("_id title subtitle bgImage image ctaText ctaLink");
      } catch (err) {
        results.heroes = [];
      }
    }

    // Fetch flash sale products (on promotion)
    if (requested.includes("flashsale")) {
      try {
        const now = new Date();
        results.flashsale = await Product.find({
          isPromotion: true,
          promoStart: { $lte: now },
          promoEnd: { $gte: now },
        })
          .lean()
          .limit(15)
          .select(
            "_id name price salePriceIncTax promoPrice isPromotion promoEnd image rating"
          );
      } catch (err) {
        results.flashsale = [];
      }
    }

    // Aggressive caching for batch endpoints
    // Cache in CDN for 1 hour, with 24 hour stale-while-revalidate
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    // Enable gzip compression
    res.setHeader("Content-Encoding", "gzip");

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results,
    });
  } catch (error) {
    console.error("Batch API Error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
