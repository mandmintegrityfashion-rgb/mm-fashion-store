import mongooseConnect from "@/lib/mongodb";
import Customer from "@/models/Customer";

export default async function handler(req, res) {
  await mongooseConnect();
  const {
    query: { id },
    method,
    body,
  } = req;

  if (!id) {
    return res.status(400).json({ error: "Missing customer id" });
  }

  switch (method) {
    case "PUT": {
      // Update address
      const { address } = body;
      if (typeof address !== "string") {
        return res.status(400).json({ error: "Invalid address" });
      }
      try {
        const customer = await Customer.findByIdAndUpdate(
          id,
          { address },
          { new: true }
        );
        if (!customer) return res.status(404).json({ error: "Customer not found" });
        return res.status(200).json({ address: customer.address });
      } catch (error) {
        return res.status(500).json({ error: "Failed to update address", message: error.message });
      }
    }
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
