/**
 * INPUT VALIDATION UTILITIES
 * Comprehensive validation functions for user inputs and API requests
 */

/**
 * Validate Email Address
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validate Password Strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate Phone Number (Nigerian format)
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^(\+?234|0)[789]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

/**
 * Sanitize String Input (Prevent XSS)
 */
export const sanitizeString = (str) => {
  if (typeof str !== "string") return "";
  return str
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .slice(0, 1000); // Limit length
};

/**
 * Validate Product Price
 */
export const validatePrice = (price) => {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice > 0 && numPrice <= 999999999;
};

/**
 * Validate MongoDB ObjectId
 */
export const validateMongoId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validate Cart Item
 */
export const validateCartItem = (item) => {
  return (
    item &&
    validateMongoId(item.productId) &&
    typeof item.quantity === "number" &&
    item.quantity > 0 &&
    item.quantity <= 1000
  );
};

/**
 * Validate Email Format and Length
 */
export const validateEmailFormat = (email) => {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim().toLowerCase();
  return validateEmail(trimmed) && trimmed.length <= 254;
};

/**
 * Validate Name (Letters, spaces, hyphens only)
 */
export const validateName = (name) => {
  if (!name || typeof name !== "string") return false;
  const nameRegex = /^[a-zA-Z\s\-']{2,100}$/;
  return nameRegex.test(name.trim());
};

/**
 * Validate Address
 */
export const validateAddress = (address) => {
  return (
    address &&
    typeof address === "string" &&
    address.trim().length >= 5 &&
    address.trim().length <= 500
  );
};

/**
 * Validate URL
 */
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate JSON Data
 */
export const validateJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * Batch Validation - Validate multiple fields at once
 */
export const validateFields = (data, schema) => {
  const errors = {};

  for (const [field, validator] of Object.entries(schema)) {
    if (!validator(data[field])) {
      errors[field] = `Invalid ${field}`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate Purchase Request
 */
export const validatePurchaseRequest = (req) => {
  const schema = {
    email: validateEmailFormat,
    amount: (val) => typeof val === "number" && val > 0,
    cartProducts: (val) => Array.isArray(val) && val.length > 0,
  };

  return validateFields(req, schema);
};
