import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handler(req, res) {
  try {
    await mongooseConnect();

    if (req.method === "GET") {
      const categories = await Category.find().lean();

      const normalized = categories.map((cat) => ({
        ...cat,
        image: cat.image?.[0]?.full || cat.image?.[0]?.thumb || "",
      }));

      res.status(200).json(normalized);
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
