/**
 * Manual WebSocket integration test script.
 *
 * 1. Sends a subscribe with a bad channel name → expects error code 8
 * 2. Subscribes to `trade`, collects N messages, unsubscribes, disconnects
 *
 * Usage (credentials auto-loaded from .env):
 *   npx tsx --env-file=.env tmp/test-ws.ts
 *   KALSHI_ENV=demo npx tsx --env-file=.env tmp/test-ws.ts
 *   COLLECT_N=5 npx tsx --env-file=.env tmp/test-ws.ts
 */

import WebSocketNode from "ws";
import { KalshiWebSocketClient } from "../src/ws-api.js";
import { generateHeaders, loadPrivateKeyFromContent } from "../src/auth.js";
import type {
  WebSocketAuthHeaders,
  SubscribedMessage,
  ErrorMessage,
  TradeWsMessage,
  Channel,
} from "../src/types/websocket.js";

// ==================== Node WebSocket subclass ====================

class NodeKalshiWebSocketClient extends KalshiWebSocketClient {
  protected createWebSocket(
    url: string,
    authHeaders: WebSocketAuthHeaders | null
  ): WebSocket {
    const options: WebSocketNode.ClientOptions = {};
    if (authHeaders) options.headers = authHeaders;
    return new WebSocketNode(url, options) as unknown as WebSocket;
  }
}

// ==================== Helpers ====================

function waitFor<T>(
  client: KalshiWebSocketClient,
  event: string,
  predicate: (msg: T) => boolean,
  timeoutMs = 5000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      client.off(event as never, handler as never);
      reject(new Error(`Timed out waiting for "${event}"`));
    }, timeoutMs);

    const handler = (msg: T) => {
      if (predicate(msg)) {
        clearTimeout(timer);
        client.off(event as never, handler as never);
        resolve(msg);
      }
    };
    client.on(event as never, handler as never);
  });
}

// ==================== Main ====================

async function main() {
  const env = process.env.KALSHI_ENV ?? "prod";
  const collectN = parseInt(process.env.COLLECT_N ?? "20", 10);
  const isDemo = env === "demo";

  const apiKey = isDemo ? process.env.KALSHI_DEV_KEY_ID : process.env.KALSHI_PROD_KEY_ID;
  const privateKeyPem = isDemo ? process.env.KALSHI_DEV_KEY : process.env.KALSHI_PROD_KEY;
  const wsUrl = isDemo
    ? "wss://demo-api.kalshi.co/trade-api/ws/v2"
    : "wss://api.elections.kalshi.com/trade-api/ws/v2";

  if (!apiKey || !privateKeyPem) {
    console.error("Missing credentials. Run with: npx tsx --env-file=.env tmp/test-ws.ts");
    process.exit(1);
  }

  const privateKey = loadPrivateKeyFromContent(privateKeyPem);
  const getAuthHeaders = (): WebSocketAuthHeaders =>
    generateHeaders(apiKey, privateKey, "GET", "/trade-api/ws/v2");

  const client = new NodeKalshiWebSocketClient({ baseWsUrl: wsUrl, getAuthHeaders, autoReconnect: false });

  console.log(`Connecting to ${wsUrl}...`);
  await client.connect();
  console.log("Connected.\n");

  // ── Step 1: bad channel name ──────────────────────────────────────────────
  console.log("── Step 1: subscribe with bad channel name ──────────────────");
  const badCmdId = client.subscribe({ channels: ["not_a_real_channel" as Channel] });
  console.log(`Sent subscribe (id=${badCmdId}, channel="not_a_real_channel")`);

  const errorMsg = await waitFor<ErrorMessage>(
    client, "error", (m) => m.id === badCmdId
  );
  console.log(`✓ Got error  code=${errorMsg.msg.code}  msg="${errorMsg.msg.msg}"\n`);
  // Per spec: code 8 = "Unknown channel name"

  // ── Step 2: good subscribe → collect N trade messages ────────────────────
  console.log(`── Step 2: subscribe to "trade", collect ${collectN} messages ──`);
  const tradeCmdId = client.subscribe({ channels: ["trade"] });
  console.log(`Sent subscribe (id=${tradeCmdId}, channel="trade")`);

  const subMsg = await waitFor<SubscribedMessage>(
    client, "subscribed", (m) => m.id === tradeCmdId
  );
  const sid = subMsg.msg.sid;
  console.log(`✓ Subscribed (sid=${sid})\n`);

  const collected: TradeWsMessage[] = [];
  await new Promise<void>((resolve) => {
    client.on("trade", (msg) => {
      collected.push(msg);
      process.stdout.write(`\r  Collected ${collected.length}/${collectN}`);
      if (collected.length >= collectN) resolve();
    });
  });
  console.log("\n");

  // ── Step 3: unsubscribe ───────────────────────────────────────────────────
  console.log("── Step 3: unsubscribe ──────────────────────────────────────");
  const unsubCmdId = client.unsubscribe([sid]);
  console.log(`Sent unsubscribe (id=${unsubCmdId}, sid=${sid})`);
  await new Promise((r) => setTimeout(r, 300));

  client.disconnect();
  console.log("Disconnected.\n");

  // ── Results ───────────────────────────────────────────────────────────────
  console.log(`${"─".repeat(64)}`);
  console.log(`${collected.length} trade messages:`);
  console.log(`${"─".repeat(64)}`);
  for (let i = 0; i < collected.length; i++) {
    const { msg } = collected[i];
    console.log(
      `[${String(i + 1).padStart(2)}] ${msg.market_ticker.padEnd(40)} yes=${msg.yes_price_dollars}  no=${msg.no_price_dollars}  count=${msg.count_fp}  taker=${msg.taker_side}`
    );
  }
  console.log(`${"─".repeat(64)}`);
}

main().catch((err) => {
  console.error("\nFatal:", err.message);
  process.exit(1);
});
