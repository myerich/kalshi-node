import { KalshiClient } from "../../src/index";

let _client: KalshiClient | null = null;

/**
 * Returns a shared KalshiClient instance configured with dev credentials
 * from .env (KALSHI_DEV_KEY_ID, KALSHI_DEV_KEY_FILE).
 */
export function getClient(): KalshiClient {
  if (!_client) {
    const apiKey = process.env.KALSHI_DEV_KEY_ID;
    const privateKeyPath = process.env.KALSHI_DEV_KEY_FILE;

    if (!apiKey || !privateKeyPath) {
      throw new Error(
        "E2E tests require KALSHI_DEV_KEY_ID and KALSHI_DEV_KEY_FILE in .env"
      );
    }

    _client = new KalshiClient({
      apiKey,
      privateKeyPath,
      baseUrl:
        process.env.KALSHI_API_BASE_URL ??
        "https://demo-api.kalshi.co/trade-api/v2",
    });
  }

  return _client;
}
