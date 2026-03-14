// pages/api/initiate-paystack.js
import axios from "axios";
import https from "https";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, amount, customer, cartProducts, orderId, baseUrl } = req.body;

  if (!email || !amount || !customer || !Array.isArray(cartProducts) || !orderId) {
    return res.status(400).json({ error: "Missing required fields (email, amount, customer, cartProducts, orderId)" });
  }

  try {
    // Build callback url that includes orderId in path
    const callbackUrl = `${baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout/order-confirmation/${orderId}`;

    // Force TLS >= 1.2 to avoid Windows TLS issues
    const agent = new https.Agent({
      keepAlive: true,
      minVersion: "TLSv1.2",
    });

    // Optional: create a local reference so you can correlate later
    const clientReference = `order_${orderId}_${Date.now()}`;

    const payload = {
      email,
      amount, // amount in kobo
      callback_url: callbackUrl,
      reference: clientReference, // optional client-provided reference
      metadata: {
        orderId,
        customer,
        cartProducts,
      },
    };

    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      payload,
      {
        httpsAgent: agent,
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { authorization_url: authorizationUrl } = paystackRes.data.data;

    return res.status(200).json({ authorizationUrl, clientReference });
  } catch (error) {
    console.error("Paystack Init Error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Failed to initiate Paystack payment.", details: error.response?.data || error.message });
  }
}
