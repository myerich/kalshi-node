export class KalshiAPIError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly method: string,
    public readonly endpoint: string,
    public readonly responseBody: string,
  ) {
    super(`${statusCode} ${method} ${endpoint}: ${responseBody}`);
    this.name = "KalshiAPIError";
  }
}

export class KalshiBadRequestError extends KalshiAPIError {}       // 400
export class KalshiUnauthorizedError extends KalshiAPIError {}     // 401
export class KalshiForbiddenError extends KalshiAPIError {}        // 403
export class KalshiNotFoundError extends KalshiAPIError {}         // 404
export class KalshiConflictError extends KalshiAPIError {}         // 409
export class KalshiRateLimitError extends KalshiAPIError {         // 429
  constructor(
    statusCode: number,
    method: string,
    endpoint: string,
    body: string,
    public readonly retryAfter?: number,
  ) {
    super(statusCode, method, endpoint, body);
    this.name = "KalshiRateLimitError";
  }
}
export class KalshiServerError extends KalshiAPIError {}           // 500
export class KalshiServiceUnavailableError extends KalshiAPIError {} // 503
export class KalshiGatewayTimeoutError extends KalshiAPIError {}   // 504

export function makeKalshiError(
  statusCode: number,
  method: string,
  endpoint: string,
  body: string,
  retryAfter?: number,
): KalshiAPIError {
  switch (statusCode) {
    case 400: return new KalshiBadRequestError(statusCode, method, endpoint, body);
    case 401: return new KalshiUnauthorizedError(statusCode, method, endpoint, body);
    case 403: return new KalshiForbiddenError(statusCode, method, endpoint, body);
    case 404: return new KalshiNotFoundError(statusCode, method, endpoint, body);
    case 409: return new KalshiConflictError(statusCode, method, endpoint, body);
    case 429: return new KalshiRateLimitError(statusCode, method, endpoint, body, retryAfter);
    case 500: return new KalshiServerError(statusCode, method, endpoint, body);
    case 503: return new KalshiServiceUnavailableError(statusCode, method, endpoint, body);
    case 504: return new KalshiGatewayTimeoutError(statusCode, method, endpoint, body);
    default:  return new KalshiAPIError(statusCode, method, endpoint, body);
  }
}
