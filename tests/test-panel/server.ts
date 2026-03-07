/**
 * Local test panel server.
 *
 * Serves the test panel SPA and proxies REST/WebSocket requests to Kalshi
 * with server-side authentication using kalshi-node auth utilities.
 *
 * Usage: npx tsx tests/test-panel/server.ts
 * Then open http://localhost:5173 (Vite dev server proxies /api/* here)
 */

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { WebSocketServer, WebSocket as WsWebSocket } from "ws";
import { config } from "dotenv";
import { resolve } from "node:path";
import { generateHeaders, loadPrivateKey, loadPrivateKeyFromContent } from "../../src/auth";

// Load .env from project root
config({ path: resolve(import.meta.dirname, "../../.env") });

const PORT = parseInt(process.env.PROXY_PORT || "3001");

const KALSHI_PROD_BASE = "https://api.elections.kalshi.com/trade-api/v2";
const KALSHI_DEV_BASE = "https://demo-api.kalshi.co/trade-api/v2";
const KALSHI_PROD_WS = "wss://api.elections.kalshi.com/trade-api/ws/v2";
const KALSHI_DEV_WS = "wss://demo-api.kalshi.co/trade-api/ws/v2";

interface Credentials {
  apiKey: string;
  privateKey: string;
}

function getCredentials(authMode: string): Credentials | null {
  const keyId =
    authMode === "dev"
      ? process.env.KALSHI_DEV_KEY_ID
      : process.env.KALSHI_PROD_KEY_ID;
  const keyFile =
    authMode === "dev"
      ? process.env.KALSHI_DEV_KEY_FILE
      : process.env.KALSHI_PROD_KEY_FILE;
  const keyContent =
    authMode === "dev"
      ? process.env.KALSHI_DEV_KEY
      : process.env.KALSHI_PROD_KEY;

  if (!keyId || (!keyFile && !keyContent)) return null;

  try {
    const privateKey = keyFile
      ? loadPrivateKey(keyFile)
      : loadPrivateKeyFromContent(keyContent!);
    return { apiKey: keyId, privateKey };
  } catch (err) {
    console.error(`Failed to load key for ${authMode}:`, err);
    return null;
  }
}

// ---- REST proxy ----

async function handleRestProxy(req: IncomingMessage, res: ServerResponse): Promise<void> {
  // Read body
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const body = JSON.parse(Buffer.concat(chunks).toString());

  const { method, endpoint, params, data, authMode } = body as {
    method: string;
    endpoint: string;
    params?: Record<string, unknown>;
    data?: Record<string, unknown>;
    authMode?: string;
  };

  const baseUrl = authMode === "dev" ? KALSHI_DEV_BASE : KALSHI_PROD_BASE;
  const url = new URL(`${baseUrl}${endpoint}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Add auth headers if requested
  if (authMode && authMode !== "none") {
    const creds = getCredentials(authMode);
    if (!creds) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: `Missing ${authMode} credentials` }));
      return;
    }
    const authHeaders = generateHeaders(
      creds.apiKey,
      creds.privateKey,
      method,
      `/trade-api/v2${endpoint}`
    );
    Object.assign(headers, authHeaders);
  }

  try {
    const fetchRes = await fetch(url.toString(), {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    const text = await fetchRes.text();
    res.writeHead(fetchRes.status, {
      "Content-Type": fetchRes.headers.get("Content-Type") || "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(text);
  } catch (err) {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: `Proxy error: ${(err as Error).message}` }));
  }
}

// ---- HTTP server ----

const server = createServer(async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/api/kalshi") {
    await handleRestProxy(req, res);
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

// ---- WebSocket proxy ----

const wss = new WebSocketServer({ server, path: "/api/ws/kalshi" });

wss.on("connection", (browserWs, req) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const authMode = url.searchParams.get("authMode") || "dev";

  const wsUrl = authMode === "dev" ? KALSHI_DEV_WS : KALSHI_PROD_WS;

  let authHeaders: Record<string, string> | undefined;
  if (authMode !== "none") {
    const creds = getCredentials(authMode);
    if (!creds) {
      browserWs.close(1008, `Missing ${authMode} credentials`);
      return;
    }
    authHeaders = generateHeaders(creds.apiKey, creds.privateKey, "GET", "/trade-api/ws/v2");
  }

  console.log(`[WS Proxy] Connecting to ${wsUrl} (${authMode} mode)`);

  const upstream = authHeaders
    ? new WsWebSocket(wsUrl, { headers: authHeaders })
    : new WsWebSocket(wsUrl);

  upstream.on("open", () => {
    console.log("[WS Proxy] Upstream connected");
  });

  // Relay: browser -> Kalshi
  browserWs.on("message", (data) => {
    if (upstream.readyState === WsWebSocket.OPEN) {
      upstream.send(data.toString());
    }
  });

  // Relay: Kalshi -> browser
  upstream.on("message", (data) => {
    if (browserWs.readyState === WsWebSocket.OPEN) {
      browserWs.send(data.toString());
    }
  });

  // Close handling
  browserWs.on("close", (code, reason) => {
    console.log(`[WS Proxy] Browser disconnected: ${code}`);
    upstream.close(code, reason.toString());
  });

  upstream.on("close", (code, reason) => {
    console.log(`[WS Proxy] Upstream disconnected: ${code}`);
    browserWs.close(code, reason.toString());
  });

  upstream.on("error", (err) => {
    console.error("[WS Proxy] Upstream error:", err.message);
    browserWs.close(1011, "Upstream error");
  });

  browserWs.on("error", (err) => {
    console.error("[WS Proxy] Browser error:", err.message);
    upstream.close(1011, "Browser error");
  });
});

server.listen(PORT, () => {
  console.log(`[Test Panel Server] Proxy running on http://localhost:${PORT}`);
  console.log(`[Test Panel Server] Open http://localhost:5173 in your browser`);
  console.log(`[Test Panel Server] (Start Vite dev server with: npm run test:panel:ui)`);
});
