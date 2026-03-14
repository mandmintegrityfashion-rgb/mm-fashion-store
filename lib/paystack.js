/**
 * PAYSTACK CONFIGURATION & UTILITIES
 * Handles all Paystack payment integration
 */

const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_API_URL = process.env.PAYSTACK_API_URL || "https://api.paystack.co";

if (!PAYSTACK_SECRET_KEY) {
  // PAYSTACK_SECRET_KEY not configured. Payment features will not work.
}

/**
 * Paystack Configuration Object
 */
export const paystackConfig = {
  publicKey: PAYSTACK_PUBLIC_KEY,
  secretKey: PAYSTACK_SECRET_KEY,
  apiUrl: PAYSTACK_API_URL,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  timeout: 30000, // 30 seconds
};

/**
 * Verify Paystack Webhook Signature
 * Ensures the webhook comes from Paystack
 */
export const verifyPaystackSignature = (req) => {
  const crypto = require("crypto");
  const signature = req.headers["x-paystack-signature"];
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return {
      valid: false,
      message: "Signature or secret missing",
    };
  }

  try {
    const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    const hash = crypto
      .createHmac("sha512", secret)
      .update(body)
      .digest("hex");

    const isValid = hash === signature;

    return {
      valid: isValid,
      message: isValid ? "Signature verified" : "Invalid signature",
    };
  } catch (error) {
    return {
      valid: false,
      message: error.message,
    };
  }
};

/**
 * Format Amount for Paystack (in kobo/cents)
 * Paystack expects amounts in the smallest currency unit
 * For NGN: 1 NGN = 100 kobo
 */
export const formatAmountForPaystack = (amountInNaira) => {
  return Math.round(parseFloat(amountInNaira) * 100);
};

/**
 * Format Amount from Paystack (from kobo to naira)
 */
export const formatAmountFromPaystack = (amountInKobo) => {
  return (parseInt(amountInKobo) / 100).toFixed(2);
};

/**
 * Build Paystack Authorization URL
 */
export const buildPaystackAuthUrl = (reference) => {
  if (!PAYSTACK_PUBLIC_KEY) {
    throw new Error("PAYSTACK_PUBLIC_KEY not configured");
  }
  return `https://checkout.paystack.com/${reference}`;
};

/**
 * Payment Status Enum
 */
export const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

/**
 * Order Status Enum
 */
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

/**
 * Payment Response Status
 */
export const PAYSTACK_RESPONSE_STATUS = {
  SUCCESS: "success",
  FAILED: "failed",
  PENDING: "pending",
};

/**
 * Paystack Transaction Reference Generator
 */
export const generatePaystackReference = (orderId, userId) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `ORDER_${orderId}_${userId}_${timestamp}_${random}`.substring(0, 64);
};

/**
 * Extract Paystack Reference from String
 */
export const extractPaystackReference = (str) => {
  const regex = /ORDER_\d+_\d+_\d+_[a-z0-9]+/i;
  const match = str.match(regex);
  return match ? match[0] : null;
};

/**
 * Currency Configuration
 */
export const currencyConfig = {
  code: "NGN",
  symbol: "₦",
  name: "Nigerian Naira",
  factor: 100, // 1 NGN = 100 kobo
};

/**
 * Payment Method Configuration
 */
export const paymentMethods = {
  card: {
    name: "Debit/Credit Card",
    supported: true,
  },
  bank: {
    name: "Bank Transfer",
    supported: true,
  },
  ussd: {
    name: "USSD",
    supported: true,
  },
  qr: {
    name: "QR Code",
    supported: true,
  },
  mobile_money: {
    name: "Mobile Money",
    supported: false,
  },
};

/**
 * Paystack Integration Status
 */
export const getPaystackStatus = () => {
  return {
    configured: !!PAYSTACK_SECRET_KEY && !!PAYSTACK_PUBLIC_KEY,
    secretKeySet: !!PAYSTACK_SECRET_KEY,
    publicKeySet: !!PAYSTACK_PUBLIC_KEY,
    webhookSecretSet: !!process.env.PAYSTACK_WEBHOOK_SECRET,
    environment: process.env.NODE_ENV || "development",
    apiUrl: PAYSTACK_API_URL,
    baseUrl: paystackConfig.baseUrl,
  };
};
