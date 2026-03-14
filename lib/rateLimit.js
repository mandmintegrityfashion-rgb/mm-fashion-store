/**
 * RATE LIMITING UTILITY
 * Prevents abuse and DoS attacks
 */

const rateLimitStore = new Map();

/**
 * Simple In-Memory Rate Limiter
 * For production, use Redis for distributed rate limiting
 */
export class RateLimiter {
  constructor(
    windowMs = 900000, // 15 minutes
    maxRequests = 100 // Max requests per window
  ) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  /**
   * Check if request should be allowed
   */
  isAllowed(identifier) {
    const now = Date.now();
    const key = `${identifier}:${Math.floor(now / this.windowMs)}`;

    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, { count: 0, createdAt: now });
    }

    const data = rateLimitStore.get(key);
    data.count++;

    // Cleanup old entries
    if (rateLimitStore.size > 10000) {
      this.cleanup();
    }

    return data.count <= this.maxRequests;
  }

  /**
   * Get remaining requests for identifier
   */
  getRemaining(identifier) {
    const now = Date.now();
    const key = `${identifier}:${Math.floor(now / this.windowMs)}`;
    const data = rateLimitStore.get(key);

    if (!data) return this.maxRequests;
    return Math.max(0, this.maxRequests - data.count);
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (now - value.createdAt > this.windowMs * 2) {
        rateLimitStore.delete(key);
      }
    }
  }

  /**
   * Reset limit for identifier
   */
  reset(identifier) {
    const now = Date.now();
    const key = `${identifier}:${Math.floor(now / this.windowMs)}`;
    rateLimitStore.delete(key);
  }
}

/**
 * Middleware: Apply Rate Limiting to API Routes
 */
export const rateLimitMiddleware = (
  limiter = new RateLimiter(
    parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
    parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100")
  )
) => {
  return (req, res, next) => {
    if (process.env.RATE_LIMIT_ENABLED === "false") {
      return next?.();
    }

    // Get identifier from request
    const identifier = req.ip || req.socket.remoteAddress || "unknown";

    // Check rate limit
    if (!limiter.isAllowed(identifier)) {
      return {
        allowed: false,
        statusCode: 429,
        message: "Too many requests, please try again later",
        retryAfter: Math.ceil(limiter.windowMs / 1000),
      };
    }

    // Add rate limit info to response headers
    const remaining = limiter.getRemaining(identifier);
    return {
      allowed: true,
      remaining,
      resetTime: Math.ceil(limiter.windowMs / 1000),
    };
  };
};

/**
 * Specialized Limiters for Different Endpoints
 */

// Auth endpoints: 5 attempts per 15 minutes
export const authLimiter = new RateLimiter(900000, 5);

// Login endpoint: 10 attempts per 15 minutes
export const loginLimiter = new RateLimiter(900000, 10);

// Register endpoint: 10 per 1 hour
export const registerLimiter = new RateLimiter(3600000, 10);

// API endpoint: 100 per 15 minutes
export const apiLimiter = new RateLimiter(900000, 100);

// Payment endpoint: 30 per 1 hour (increased from 10 for better checkout experience)
export const paymentLimiter = new RateLimiter(3600000, 30);

// Orders endpoint: 50 per 1 hour (very lenient for checkout process)
export const ordersLimiter = new RateLimiter(3600000, 50);

// Email endpoint: 5 per 1 hour
export const emailLimiter = new RateLimiter(3600000, 5);

/**
 * Apply rate limiting to API handler
 */
export const applyRateLimit = (limiter, req) => {
  const identifier = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress || "unknown";

  if (!limiter.isAllowed(identifier)) {
    return {
      rateLimited: true,
      statusCode: 429,
      message: "Too many requests. Please try again later.",
      retryAfter: Math.ceil(limiter.windowMs / 1000),
    };
  }

  return {
    rateLimited: false,
    remaining: limiter.getRemaining(identifier),
  };
};
