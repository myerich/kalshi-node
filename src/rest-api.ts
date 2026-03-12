import * as crypto from "crypto";
import { generateHeaders, loadPrivateKey, loadPrivateKeyFromContent } from "./auth.js";
import { makeKalshiError } from "./errors.js";
import { KalshiClientBase } from "./client-base.js";
import type { RequestOptions } from "./client-base.js";

export interface KalshiClientConfig {
  apiKey?: string;
  /** PEM key string (takes precedence over privateKeyPath). */
  privateKey?: string;
  /** Path to a PEM key file. Used if privateKey is not provided. */
  privateKeyPath?: string;
  baseUrl?: string;
}

export class KalshiClient extends KalshiClientBase {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly privateKey: string;

  constructor(config: KalshiClientConfig = {}) {
    super();

    this.baseUrl =
      config.baseUrl ?? "https://api.elections.kalshi.com/trade-api/v2";

    this.apiKey =
      config.apiKey ?? process.env.KALSHI_PROD_KEY_ID ?? "";
    if (!this.apiKey) {
      throw new Error(
        "API key is required. Pass apiKey in config or set KALSHI_PROD_KEY_ID env var."
      );
    }

    const keyString = config.privateKey ?? process.env.KALSHI_PROD_KEY ?? "";
    const keyPath = config.privateKeyPath ?? process.env.KALSHI_PROD_KEY_FILE ?? "";
    if (!keyString && !keyPath) {
      throw new Error(
        "Private key is required. Pass privateKey or privateKeyPath in config, or set KALSHI_PROD_KEY or KALSHI_PROD_KEY_FILE env var."
      );
    }
    this.privateKey = keyString
      ? loadPrivateKeyFromContent(keyString)
      : loadPrivateKey(keyPath);
  }

  private authHeaders(method: string, endpoint: string): Record<string, string> {
    const path = `/trade-api/v2${endpoint}`;
    return generateHeaders(this.apiKey, this.privateKey, method, path);
  }

  protected override async request<T>(
    method: string,
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, data, auth = false, retries = 100 } = options;

    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = {};
    if (auth) {
      Object.assign(headers, this.authHeaders(method, endpoint));
    }
    if (data) {
      headers["Content-Type"] = "application/json";
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(10_000),
    };

    const response = await fetch(url.toString(), fetchOptions);

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("Retry-After") ?? "10", 10);
      if (retries > 0) {
        await new Promise((r) => setTimeout(r, retryAfter * 1000));
        return this.request<T>(method, endpoint, {
          params,
          data,
          auth,
          retries: retries - 1,
        });
      }
      const body = await response.text();
      throw makeKalshiError(429, method, endpoint, body, retryAfter);
    }

    if (!response.ok) {
      const body = await response.text();
      throw makeKalshiError(response.status, method, endpoint, body);
    }

    return (await response.json()) as T;
  }
}
