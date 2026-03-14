import mongooseConnect from "../../lib/mongodb";
import Product from "../../models/Product";

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === "GET") {
    try {
      const { category, minPrice, maxPrice, sort, props } = req.query;
      const query = {};

      if (category && typeof category === "string") {
        query.category = category;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        const min = Number(minPrice);
        const max = Number(maxPrice);
        if (!isNaN(min) && min >= 0) query.price.$gte = min;
        if (!isNaN(max) && max >= 0) query.price.$lte = max;
        if (Object.keys(query.price).length === 0) delete query.price;
      }

      if (props && typeof props === "string") {
        try {
          const parsed = JSON.parse(props);
          // Sanitize: only allow plain string values to prevent NoSQL injection
          const sanitized = {};
          for (const [key, val] of Object.entries(parsed)) {
            if (typeof key === "string" && Array.isArray(val)) {
              sanitized[key] = val.filter((v) => typeof v === "string");
            }
          }

          query.properties = { $all: [] };
          for (const [propName, values] of Object.entries(sanitized)) {
            if (values.length > 0) {
              query.properties.$all.push({
                $elemMatch: { propName, propValue: { $in: values } },
              });
            }
          }
          if (query.properties.$all.length === 0) delete query.properties;
        } catch {
          // Invalid JSON props - ignore silently
        }
      }

      let productsQuery = Product.find(query).lean();

      if (sort === "asc") {
        productsQuery = productsQuery.sort({ price: 1 });
      } else if (sort === "desc") {
        productsQuery = productsQuery.sort({ price: -1 });
      } else {
        productsQuery = productsQuery.sort({ createdAt: -1 });
      }

      const products = await productsQuery.exec();

      const normalized = products.map((obj) => {
        const firstImg = obj.images?.[0];
        return {
          ...obj,
          image: firstImg?.thumb || firstImg?.full || "/images/placeholder.jpg",
        };
      });

      res.status(200).json(normalized);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
