export class AppError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: any;

  constructor(code: string, status: number, message: string, details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static validation(message = 'Validation error', details?: any) {
    return new AppError('VALIDATION_ERROR', 400, message, details);
  }

  static otpInvalid(message = 'Invalid or expired code') {
    return new AppError('OTP_INVALID', 400, message);
  }

  static unauthenticated(message = 'Authentication required') {
    return new AppError('UNAUTHENTICATED', 401, message);
  }

  static forbidden(message = 'Forbidden') {
    return new AppError('FORBIDDEN', 403, message);
  }

  static notFound(message = 'Resource not found') {
    return new AppError('NOT_FOUND', 404, message);
  }

  static invalidState(message = 'Invalid state transition') {
    return new AppError('INVALID_STATE_TRANSITION', 409, message);
  }

  static conflict(message = 'Conflict or duplicate entry') {
    return new AppError('CONFLICT', 409, message);
  }

  static fileTooLarge(message = 'File exceeds maximum upload size') {
    return new AppError('FILE_TOO_LARGE', 413, message);
  }

  static unsupportedMedia(message = 'Only image/jpeg is supported') {
    return new AppError('UNSUPPORTED_MEDIA', 415, message);
  }

  static recyclerNotVerified(message = 'Recycler is not verified') {
    return new AppError('RECYCLER_NOT_VERIFIED', 422, message);
  }

  static rateLimited(message = 'Too many requests. Please try again later.') {
    return new AppError('RATE_LIMITED', 429, message);
  }

  static internal(message = 'Internal server error') {
    return new AppError('INTERNAL', 500, message);
  }

  static notImplemented(message = 'Feature not implemented in prototype') {
    return new AppError('NOT_IMPLEMENTED', 501, message);
  }
}
