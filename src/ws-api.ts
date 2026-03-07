/**
 * Kalshi WebSocket Client
 *
 * Real-time data streaming via WebSocket connections to Kalshi.
 * Uses the native WebSocket API (works in browsers and Node.js 22+).
 *
 * Public channels (no auth required): ticker, trade,
 * market_lifecycle_v2, multivariate
 *
 * Private channels (auth required): orderbook_delta, orderbook_snapshot,
 * fill, market_positions, communications, order_group_updates, user_orders
 *
 * Note: Browser WebSocket API does not support custom HTTP headers on the
 * upgrade request. Authenticated connections work in Node.js environments
 * that support header injection (e.g. the `ws` library). For browser
 * clients, connect without auth for public channels.
 */

import type {
  KalshiWebSocketConfig,
  ConnectionState,
  SubscribeParams,
  UpdateSubscriptionParams,
  WebSocketCommand,
  WebSocketMessage,
  WebSocketEventMap,
  ActiveSubscription,
  WebSocketAuthHeaders,
} from "./types/websocket";

const PROD_WS_URL = "wss://api.elections.kalshi.com/trade-api/ws/v2";

const DEFAULT_MAX_RECONNECT_ATTEMPTS = 10;
const DEFAULT_RECONNECT_BASE_DELAY = 1000;
const DEFAULT_RECONNECT_MAX_DELAY = 60000;

type EventKey = keyof WebSocketEventMap;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HandlerFn = (...args: any[]) => void;

export class KalshiWebSocketClient {
  private readonly config: Required<
    Pick<
      KalshiWebSocketConfig,
      | "autoReconnect"
      | "maxReconnectAttempts"
      | "reconnectBaseDelay"
      | "reconnectMaxDelay"
    >
  > &
    KalshiWebSocketConfig;

  private readonly baseWsUrl: string;

  private ws: WebSocket | null = null;
  private connectionState: ConnectionState = "disconnected";
  private commandId = 1;
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionalClose = false;

  /** Active subscriptions keyed by server-assigned sid. */
  private subscriptions = new Map<number, ActiveSubscription>();

  /** Pending subscribe commands awaiting server confirmation (keyed by command id). */
  private pendingSubscribes = new Map<number, SubscribeParams>();

  /** Event handlers. */
  private handlers = new Map<string, Set<HandlerFn>>();

  /** One-shot handlers removed after first invocation. */
  private onceHandlers = new WeakSet<HandlerFn>();

  constructor(config: KalshiWebSocketConfig = {}) {
    this.baseWsUrl = config.baseWsUrl ?? PROD_WS_URL;
    this.config = {
      ...config,
      autoReconnect: config.autoReconnect ?? true,
      maxReconnectAttempts:
        config.maxReconnectAttempts ?? DEFAULT_MAX_RECONNECT_ATTEMPTS,
      reconnectBaseDelay:
        config.reconnectBaseDelay ?? DEFAULT_RECONNECT_BASE_DELAY,
      reconnectMaxDelay:
        config.reconnectMaxDelay ?? DEFAULT_RECONNECT_MAX_DELAY,
    };
  }

  // ==================== Connection Lifecycle ====================

  /** Open a WebSocket connection to Kalshi. Resolves when connected. */
  async connect(): Promise<void> {
    if (
      this.connectionState === "connected" ||
      this.connectionState === "connecting"
    ) {
      console.warn("[KalshiWS] Already connected or connecting");
      return;
    }

    this.intentionalClose = false;
    this.connectionState = "connecting";

    // Fetch auth headers if provider is configured
    let authHeaders: WebSocketAuthHeaders | null = null;
    if (this.config.getAuthHeaders) {
      try {
        authHeaders = await this.config.getAuthHeaders();
      } catch (err) {
        console.error("[KalshiWS] Failed to get auth headers:", err);
      }
    }

    return new Promise<void>((resolve, reject) => {
      try {
        this.ws = this.createWebSocket(this.baseWsUrl, authHeaders);
      } catch (err) {
        this.connectionState = "disconnected";
        reject(err);
        return;
      }

      const onOpen = () => {
        cleanup();
        this.connectionState = "connected";
        this.reconnectAttempt = 0;
        console.log("[KalshiWS] Connected to", this.baseWsUrl);
        this.emit("connected");
        resolve();
      };

      const onError = (event: globalThis.Event) => {
        cleanup();
        this.connectionState = "disconnected";
        console.error("[KalshiWS] Connection failed:", event);
        reject(new Error("WebSocket connection failed"));
      };

      const cleanup = () => {
        this.ws?.removeEventListener("open", onOpen);
        this.ws?.removeEventListener("error", onError);
        // Attach permanent handlers
        if (this.ws) {
          this.ws.onmessage = (event) => this.handleMessage(event.data);
          this.ws.onerror = (event) => this.handleError(event);
          this.ws.onclose = (event) =>
            this.handleClose(event as CloseEvent);
        }
      };

      this.ws.addEventListener("open", onOpen);
      this.ws.addEventListener("error", onError);
    });
  }

  /** Gracefully close the WebSocket connection. */
  disconnect(): void {
    this.intentionalClose = true;
    this.clearReconnectTimer();

    if (this.ws) {
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;
      if (
        this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING
      ) {
        this.ws.close(1000, "Client disconnect");
      }
      this.ws = null;
    }

    this.connectionState = "disconnected";
    this.pendingSubscribes.clear();
    console.log("[KalshiWS] Disconnected");
    this.emit("disconnected", { code: 1000, reason: "Client disconnect" });
  }

  /** Current connection state. */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /** Whether the connection is open and ready to send/receive. */
  isConnected(): boolean {
    return this.connectionState === "connected";
  }

  // ==================== Subscriptions ====================

  /**
   * Subscribe to one or more channels. Returns the command ID.
   * Listen for 'subscribed' events to get the server-assigned subscription ID.
   */
  subscribe(params: SubscribeParams): number {
    const id = this.nextCommandId();
    const cmd: WebSocketCommand = {
      id,
      cmd: "subscribe",
      params: { ...params },
    };

    this.pendingSubscribes.set(id, params);
    this.send(cmd);
    return id;
  }

  /** Unsubscribe from subscriptions by their server-assigned IDs. */
  unsubscribe(sids: number[]): number {
    const id = this.nextCommandId();
    const cmd: WebSocketCommand = {
      id,
      cmd: "unsubscribe",
      params: { sids },
    };

    // Remove from tracked subscriptions
    for (const sid of sids) {
      this.subscriptions.delete(sid);
    }

    this.send(cmd);
    return id;
  }

  /**
   * Update an existing subscription (add/remove tickers).
   * Pass the sids to update and the new ticker lists.
   */
  updateSubscription(params: UpdateSubscriptionParams): number {
    const id = this.nextCommandId();
    const cmd: WebSocketCommand = {
      id,
      cmd: "update_subscription",
      params: { ...params },
    };

    this.send(cmd);
    return id;
  }

  /** Get all currently active subscriptions. */
  getActiveSubscriptions(): ActiveSubscription[] {
    return Array.from(this.subscriptions.values());
  }

  /**
   * Request a list of active server-side subscriptions.
   * Listen for 'ok' events to receive the response.
   * Returns the command ID.
   */
  listSubscriptions(): number {
    const id = this.nextCommandId();
    const cmd: WebSocketCommand = {
      id,
      cmd: "list_subscriptions",
      params: {},
    };
    this.send(cmd);
    return id;
  }

  // ==================== Event Emitter ====================

  /** Register a handler for a specific event type. */
  on<K extends EventKey>(
    event: K,
    handler: WebSocketEventMap[K]
  ): this {
    const set = this.handlers.get(event) ?? new Set();
    set.add(handler as HandlerFn);
    this.handlers.set(event, set);
    return this;
  }

  /** Remove a handler for a specific event type. */
  off<K extends EventKey>(
    event: K,
    handler: WebSocketEventMap[K]
  ): this {
    const set = this.handlers.get(event);
    if (set) {
      set.delete(handler as HandlerFn);
      if (set.size === 0) this.handlers.delete(event);
    }
    return this;
  }

  /** Register a one-shot handler that fires once then removes itself. */
  once<K extends EventKey>(
    event: K,
    handler: WebSocketEventMap[K]
  ): this {
    this.onceHandlers.add(handler as HandlerFn);
    return this.on(event, handler);
  }

  // ==================== Internals ====================

  /**
   * Create a WebSocket instance. Override this for environments that
   * support custom headers (e.g. Node.js `ws` library).
   */
  protected createWebSocket(
    url: string,
    _authHeaders: WebSocketAuthHeaders | null
  ): WebSocket {
    // Native WebSocket API — no custom header support.
    // Auth headers are ignored in browser environments.
    return new WebSocket(url);
  }

  private send(cmd: WebSocketCommand): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error(
        "[KalshiWS] Cannot send — not connected. Command:",
        cmd.cmd,
        cmd.id
      );
      return;
    }
    this.ws.send(JSON.stringify(cmd));
  }

  private nextCommandId(): number {
    return this.commandId++;
  }

  private handleMessage(data: unknown): void {
    let raw: string;
    if (typeof data === "string") {
      raw = data;
    } else {
      // Blob, ArrayBuffer, etc. — convert to string
      raw = String(data);
    }

    let msg: WebSocketMessage;
    try {
      msg = JSON.parse(raw) as WebSocketMessage;
    } catch {
      console.error("[KalshiWS] Failed to parse message:", raw);
      return;
    }

    // Track subscriptions
    if (msg.type === "subscribed") {
      const pending = this.pendingSubscribes.get(msg.id);
      if (pending) {
        this.subscriptions.set(msg.msg.sid, {
          sid: msg.msg.sid,
          params: pending,
        });
        this.pendingSubscribes.delete(msg.id);
      }
    }

    // Emit typed event
    this.emit(msg.type as EventKey, msg);

    // Emit wildcard
    this.emit("message", msg);
  }

  private handleError(event: globalThis.Event): void {
    console.error("[KalshiWS] WebSocket error:", event);
  }

  private handleClose(event: CloseEvent): void {
    this.ws = null;
    this.connectionState = "disconnected";
    this.pendingSubscribes.clear();

    console.log(
      `[KalshiWS] Connection closed: code=${event.code} reason="${event.reason}"`
    );
    this.emit("disconnected", {
      code: event.code,
      reason: event.reason,
    });

    // Auto-reconnect unless intentionally closed
    if (
      !this.intentionalClose &&
      this.config.autoReconnect &&
      this.reconnectAttempt < this.config.maxReconnectAttempts
    ) {
      this.scheduleReconnect();
    } else if (
      this.reconnectAttempt >= this.config.maxReconnectAttempts
    ) {
      this.connectionState = "failed";
      console.error(
        "[KalshiWS] Max reconnect attempts reached, giving up"
      );
    }
  }

  private scheduleReconnect(): void {
    const delay = Math.min(
      this.config.reconnectBaseDelay *
        Math.pow(2, this.reconnectAttempt),
      this.config.reconnectMaxDelay
    );

    this.reconnectAttempt++;
    this.connectionState = "reconnecting";

    console.log(
      `[KalshiWS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempt}/${this.config.maxReconnectAttempts})`
    );
    this.emit("reconnecting", this.reconnectAttempt);

    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      try {
        // Save subscriptions to re-subscribe after reconnect
        const prevSubscriptions = Array.from(
          this.subscriptions.values()
        );
        this.subscriptions.clear();

        await this.connect();

        // Re-subscribe to all previous subscriptions
        if (prevSubscriptions.length > 0) {
          console.log(
            `[KalshiWS] Re-subscribing to ${prevSubscriptions.length} subscription(s)`
          );
          for (const sub of prevSubscriptions) {
            this.subscribe(sub.params);
          }
          this.emit("resubscribed");
        }
      } catch (err) {
        console.error("[KalshiWS] Reconnect failed:", err);
        // handleClose will be called by the failed connection,
        // which will schedule another reconnect
      }
    }, delay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.reconnectAttempt = 0;
  }

  private emit(event: string, ...args: unknown[]): void {
    const set = this.handlers.get(event);
    if (!set) return;

    for (const handler of set) {
      try {
        handler(...args);
      } catch (err) {
        console.error(`[KalshiWS] Error in '${event}' handler:`, err);
      }

      // Remove one-shot handlers after first invocation
      if (this.onceHandlers.has(handler)) {
        set.delete(handler);
        this.onceHandlers.delete(handler);
      }
    }

    if (set.size === 0) {
      this.handlers.delete(event);
    }
  }
}
