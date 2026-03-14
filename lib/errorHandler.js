/**
 * Professional Error Handler Utility
 * Provides consistent error handling, logging, and user-facing messages across the application
 */

class ErrorHandler {
  /**
   * Categorizes error types for appropriate handling
   */
  static getErrorType(error) {
    if (!error) return 'UNKNOWN';

    // Network errors
    if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
      return 'NETWORK_ERROR';
    }

    // API errors
    if (error.response?.status) {
      const status = error.response.status;
      if (status === 401 || status === 403) return 'AUTH_ERROR';
      if (status === 404) return 'NOT_FOUND';
      if (status >= 500) return 'SERVER_ERROR';
      return 'API_ERROR';
    }

    // Validation errors
    if (error.message?.includes('validation') || error.message?.includes('required')) {
      return 'VALIDATION_ERROR';
    }

    // Storage errors
    if (error.message?.includes('localStorage') || error.message?.includes('IndexedDB')) {
      return 'STORAGE_ERROR';
    }

    return 'UNKNOWN';
  }

  /**
   * Gets user-friendly error message
   */
  static getUserMessage(error, context = '') {
    const type = this.getErrorType(error);

    const messages = {
      NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
      AUTH_ERROR: 'Authentication failed. Please log in again.',
      NOT_FOUND: 'The requested item was not found.',
      SERVER_ERROR: 'Server error. Please try again later.',
      API_ERROR: 'Failed to load data. Please try again.',
      VALIDATION_ERROR: 'Please check your input and try again.',
      STORAGE_ERROR: 'Failed to save data locally. Please try again.',
      UNKNOWN: 'An unexpected error occurred. Please try again.',
    };

    return messages[type] || messages.UNKNOWN;
  }

  /**
   * Handles API errors with proper response extraction
   */
  static handleApiError(error, endpoint = '') {
    const errorInfo = {
      type: this.getErrorType(error),
      endpoint,
      timestamp: new Date().toISOString(),
      message: error.message || 'Unknown error',
      status: error.response?.status,
      data: error.response?.data,
    };

    // Only log non-network errors in development
    if (process.env.NODE_ENV === 'development' && error.response) {
      console.error(`[API Error - ${endpoint}]`, errorInfo);
    }

    return {
      error: errorInfo,
      userMessage: this.getUserMessage(error, endpoint),
      isRecoverable: !this.isFatalError(error),
    };
  }

  /**
   * Handles component/context errors
   */
  static handleContextError(error, contextName = 'Unknown') {
    const errorInfo = {
      context: contextName,
      message: error.message || 'Unknown error',
      timestamp: new Date().toISOString(),
      type: this.getErrorType(error),
    };

    // Silent failure for non-critical operations
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${contextName} Error]`, errorInfo);
    }

    return {
      error: errorInfo,
      userMessage: this.getUserMessage(error),
      isRecoverable: true,
    };
  }

  /**
   * Handles cache operation failures
   */
  static handleCacheError(error, operation = 'unknown') {
    // Cache failures are non-critical - silently fail and continue
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Cache Error - ${operation}]`, error.message);
    }

    return {
      success: false,
      error: error.message,
      // Cache failures should not affect user experience
      recoveryStrategy: 'fallback_to_fresh_data',
    };
  }

  /**
   * Determines if error is fatal (requires stopping operation)
   */
  static isFatalError(error) {
    const type = this.getErrorType(error);
    return ['AUTH_ERROR', 'SERVER_ERROR'].includes(type);
  }

  /**
   * Formats error for user display (toast/modal)
   */
  static formatForDisplay(error, context = '') {
    return this.getUserMessage(error, context);
  }

  /**
   * Log structured error data (for analytics/monitoring)
   */
  static logError(error, context = {}) {
    const errorLog = {
      type: this.getErrorType(error),
      message: error.message,
      timestamp: new Date().toISOString(),
      context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    };

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorLog]', errorLog);
    }

    // TODO: In production, send to error tracking service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error, { contexts: { errorLog } });

    return errorLog;
  }

  /**
   * Safe async operation wrapper
   */
  static async safeAsync(asyncFn, fallbackValue = null, context = 'AsyncOperation') {
    try {
      return await asyncFn();
    } catch (error) {
      this.logError(error, { context });
      return fallbackValue;
    }
  }

  /**
   * Safe sync operation wrapper
   */
  static safeSync(syncFn, fallbackValue = null, context = 'SyncOperation') {
    try {
      return syncFn();
    } catch (error) {
      this.logError(error, { context });
      return fallbackValue;
    }
  }
}

export default ErrorHandler;
