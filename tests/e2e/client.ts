import { KalshiClient } from "../../src/index";

let _client: KalshiClient | null = null;

/**
 * Returns a shared KalshiClient instance configured with dev credentials
 * from .env. Supports either:
 *   KALSHI_DEV_KEY_ID + KALSHI_DEV_KEY  (PEM string)
 *   KALSHI_DEV_KEY_ID + KALSHI_DEV_KEY_FILE  (path to PEM file)
 */
export function getClient(): KalshiClient {
  if (!_client) {
    const apiKey = process.env.KALSHI_DEV_KEY_ID;
    const privateKey = process.env.KALSHI_DEV_KEY;
    const privateKeyPath = process.env.KALSHI_DEV_KEY_FILE;

    if (!apiKey || (!privateKey && !privateKeyPath)) {
      throw new Error(
        "E2E tests require KALSHI_DEV_KEY_ID and either KALSHI_DEV_KEY or KALSHI_DEV_KEY_FILE in .env"
      );
    }

    _client = new KalshiClient({
      apiKey,
      ...(privateKey ? { privateKey } : { privateKeyPath }),
      baseUrl:
        process.env.KALSHI_API_BASE_URL ??
        "https://demo-api.kalshi.co/trade-api/v2",
    });
  }

  return _client;
}
