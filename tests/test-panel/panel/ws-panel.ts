/** WebSocket test panel — connect to Kalshi via the worker proxy and test subscriptions. */

import { MARKET_CHANNELS, USER_CHANNELS } from "./ws-channels";

// ---- Types ----

interface ActiveSubscription {
  sid: number;
  channel: string;
  marketTickers: string[];
}

interface ConsoleEntry {
  timestamp: Date;
  type: string;
  data: unknown;
}

// ---- State ----

let ws: WebSocket | null = null;
let connectionState: "disconnected" | "connecting" | "connected" = "disconnected";
let authMode: "dev" | "prod" = "dev";
let commandId = 1;
let subscriptions: ActiveSubscription[] = [];
let consoleEntries: ConsoleEntry[] = [];
let autoScroll = true;
const MAX_CONSOLE_ENTRIES = 500;

// Track pending subscribes to associate SIDs with ticker info
const pendingSubscribes = new Map<number, { marketTickers: string[] }>();

// ---- Cached DOM refs ----

let container: HTMLElement;
let statusDot: HTMLSpanElement;
let statusText: HTMLSpanElement;
let connectBtn: HTMLButtonElement;
let commandSelect: HTMLSelectElement;
let commandForm: HTMLDivElement;
let sendCommandBtn: HTMLButtonElement;
let subsBody: HTMLDivElement;
let consoleEl: HTMLDivElement;
let autoScrollCheckbox: HTMLInputElement;

/** Mount the WebSocket panel into the given container element. */
export function mountWsPanel(el: HTMLElement): void {
  container = el;
  container.innerHTML = buildShell();

  statusDot = qs("#ws-status-dot");
  statusText = qs("#ws-status-text");
  connectBtn = qs("#ws-connect-btn");
  commandSelect = qs("#ws-command-select");
  commandForm = qs("#ws-command-form");
  sendCommandBtn = qs("#ws-send-command");
  subsBody = qs("#ws-subs-body");
  consoleEl = qs("#ws-console");
  autoScrollCheckbox = qs("#ws-auto-scroll");

  // Auth mode toggle — auto-disconnect on change
  const authButtons = qsa<HTMLButtonElement>(".ws-auth-toggle button");
  authButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const newMode = btn.dataset.mode as "dev" | "prod";
      if (newMode === authMode) return;
      authMode = newMode;
      authButtons.forEach((b) => b.classList.toggle("active", b === btn));

      // Auto-disconnect and wipe subscriptions on auth mode change
      if (connectionState !== "disconnected") {
        disconnect();
        subscriptions = [];
        pendingSubscribes.clear();
        renderSubscriptions();
        addConsoleEntry("system", {
          message: `Auth mode changed to ${authMode}. Disconnected. Click Connect to reconnect.`,
        });
      }
    });
  });

  connectBtn.addEventListener("click", toggleConnection);
  commandSelect.addEventListener("change", renderCommandForm);
  sendCommandBtn.addEventListener("click", sendCommand);
  autoScrollCheckbox.addEventListener("change", () => {
    autoScroll = autoScrollCheckbox.checked;
  });

  qs<HTMLButtonElement>("#ws-console-clear").addEventListener("click", () => {
    consoleEntries = [];
    renderConsole();
  });

  // Refresh subscriptions button
  qs<HTMLButtonElement>("#ws-refresh-subs").addEventListener("click", refreshSubscriptions);

  renderCommandForm();
  renderSubscriptions();
  updateConnectionUI();
}

// ---- Shell HTML ----

function buildShell(): string {
  return `
    <h1>Kalshi WebSocket Test Panel</h1>

    <!-- Connection Bar -->
    <div class="ws-connection-bar">
      <div class="field">
        <label>Auth Mode</label>
        <div class="ws-auth-toggle auth-toggle">
          <button data-mode="dev" class="${authMode === "dev" ? "active" : ""}">Dev</button>
          <button data-mode="prod" class="${authMode === "prod" ? "active" : ""}">Prod</button>
        </div>
      </div>
      <button id="ws-connect-btn" class="btn-send">Connect</button>
      <div class="ws-status">
        <span id="ws-status-dot" class="ws-status-dot ws-status-dot--disconnected"></span>
        <span id="ws-status-text" class="ws-status-text">Disconnected</span>
      </div>
    </div>

    <!-- Command Section -->
    <div class="params-section">
      <h2>Command</h2>
      <div class="ws-command-row">
        <div class="field">
          <label for="ws-command-select">Action</label>
          <select id="ws-command-select">
            <option value="subscribe">Subscribe</option>
            <option value="unsubscribe">Unsubscribe</option>
            <option value="update_subscription">Update Subscription</option>
          </select>
        </div>
      </div>
      <div id="ws-command-form"></div>
      <div class="send-row">
        <button id="ws-send-command" class="btn-send" disabled>Send Command</button>
      </div>
    </div>

    <!-- Active Subscriptions -->
    <div class="params-section">
      <div class="ws-subs-header">
        <h2>Active Subscriptions</h2>
        <button id="ws-refresh-subs" class="ws-refresh-btn" title="Send list_subscriptions to confirm server state">Refresh</button>
      </div>
      <div id="ws-subs-body" class="ws-subs-body">
        <p class="no-params">No active subscriptions.</p>
      </div>
    </div>

    <!-- Message Console -->
    <div class="ws-console-section">
      <div class="ws-console-header">
        <h2>Message Console</h2>
        <div class="ws-console-controls">
          <label class="ws-auto-scroll-label">
            <input type="checkbox" id="ws-auto-scroll" checked> Auto-scroll
          </label>
          <button id="ws-console-clear" class="ws-console-clear-btn">Clear</button>
        </div>
      </div>
      <div id="ws-console" class="ws-console"></div>
    </div>
  `;
}

// ---- Command Form Rendering ----

function renderCommandForm(): void {
  const cmd = commandSelect.value;

  if (cmd === "subscribe") {
    commandForm.innerHTML = `
      <div class="ws-channels-section">
        <label>Channels <span class="ws-hint">(all require authenticated connection)</span></label>
        <div class="ws-channels-group">
          <div class="ws-channels-col">
            <span class="ws-channels-label">Market Data</span>
            ${MARKET_CHANNELS.map((ch) => `
              <label class="ws-channel-checkbox">
                <input type="checkbox" data-channel="${ch.name}" />
                <span>${ch.label}</span>
                <span class="ws-channel-desc">${ch.description}</span>
              </label>
            `).join("")}
          </div>
          <div class="ws-channels-col">
            <span class="ws-channels-label">User Data</span>
            ${USER_CHANNELS.map((ch) => `
              <label class="ws-channel-checkbox">
                <input type="checkbox" data-channel="${ch.name}" />
                <span>${ch.label}</span>
                <span class="ws-channel-desc">${ch.description}</span>
              </label>
            `).join("")}
          </div>
        </div>
      </div>
      <div class="params-grid">
        <div class="param-field">
          <label>market_tickers <span class="ws-hint">(comma-separated; mutually exclusive with market_ids)</span></label>
          <input type="text" id="ws-market-tickers" placeholder="e.g. KXBTCD-25FEB14,KXETHD-25FEB14" />
        </div>
        <div class="param-field">
          <label>market_ids <span class="ws-hint">(UUIDs, comma-separated; ticker/ticker_v2 only; mutually exclusive with market_tickers)</span></label>
          <input type="text" id="ws-market-ids" placeholder="e.g. abc123-...,def456-..." />
        </div>
        <div class="param-field ws-checkbox-field">
          <label><input type="checkbox" id="ws-send-initial-snapshot" /> send_initial_snapshot <span class="ws-hint">(receive initial snapshot on ticker channel)</span></label>
        </div>
        <div class="param-field ws-checkbox-field">
          <label><input type="checkbox" id="ws-skip-ticker-ack" /> skip_ticker_ack <span class="ws-hint">(omit market_tickers/market_ids from OK response)</span></label>
        </div>
        <div class="param-field">
          <label>shard_factor <span class="ws-hint">(integer; for communications channel only)</span></label>
          <input type="number" id="ws-shard-factor" min="1" placeholder="optional" />
        </div>
      </div>
    `;
  } else if (cmd === "unsubscribe") {
    const options = subscriptions.length
      ? subscriptions
          .map(
            (s) =>
              `<option value="${s.sid}">SID ${s.sid} — ${s.channel} [${s.marketTickers.join(", ") || "all"}]</option>`
          )
          .join("")
      : `<option value="" disabled>No active subscriptions</option>`;
    commandForm.innerHTML = `
      <div class="params-grid">
        <div class="param-field">
          <label>Subscription IDs</label>
          <select id="ws-unsub-sids" multiple size="4">${options}</select>
        </div>
      </div>
    `;
  } else if (cmd === "update_subscription") {
    const options = subscriptions.length
      ? subscriptions
          .map(
            (s) =>
              `<option value="${s.sid}">SID ${s.sid} — ${s.channel} [${s.marketTickers.join(", ") || "all"}]</option>`
          )
          .join("")
      : `<option value="" disabled>No active subscriptions</option>`;
    commandForm.innerHTML = `
      <div class="params-grid">
        <div class="param-field">
          <label>Subscription IDs</label>
          <select id="ws-update-sids" multiple size="4">${options}</select>
        </div>
        <div class="param-field">
          <label>action</label>
          <select id="ws-update-action">
            <option value="add">add</option>
            <option value="remove">remove</option>
          </select>
        </div>
        <div class="param-field">
          <label>market_tickers <span class="ws-hint">(comma-separated; mutually exclusive with market_ids)</span></label>
          <input type="text" id="ws-market-tickers" placeholder="e.g. KXBTCD-25FEB14" />
        </div>
        <div class="param-field">
          <label>market_ids <span class="ws-hint">(UUIDs, comma-separated; ticker/ticker_v2 only)</span></label>
          <input type="text" id="ws-market-ids" placeholder="e.g. abc123-...,def456-..." />
        </div>
        <div class="param-field ws-checkbox-field">
          <label><input type="checkbox" id="ws-send-initial-snapshot" /> send_initial_snapshot <span class="ws-hint">(receive snapshot for newly added tickers)</span></label>
        </div>
      </div>
    `;
  }
}

// ---- Connection ----

function toggleConnection(): void {
  if (connectionState === "disconnected") {
    connect();
  } else {
    disconnect();
  }
}

function connect(): void {
  if (ws) return;

  connectionState = "connecting";
  updateConnectionUI();

  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  const url = `${protocol}//${location.host}/api/ws/kalshi?authMode=${authMode}`;

  ws = new WebSocket(url);

  ws.addEventListener("open", () => {
    connectionState = "connected";
    subscriptions = [];
    pendingSubscribes.clear();
    renderSubscriptions();
    updateConnectionUI();
    addConsoleEntry("system", { message: `Connected (${authMode} mode)` });
  });

  ws.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data as string);
      handleMessage(data);
    } catch {
      addConsoleEntry("raw", event.data);
    }
  });

  ws.addEventListener("close", (event) => {
    connectionState = "disconnected";
    ws = null;
    updateConnectionUI();
    addConsoleEntry("system", {
      message: `Disconnected (code: ${event.code}, reason: ${event.reason || "none"})`,
    });
  });

  ws.addEventListener("error", () => {
    addConsoleEntry("error", { message: "WebSocket error" });
  });
}

function disconnect(): void {
  if (ws) {
    ws.close(1000, "User disconnect");
    ws = null;
  }
  connectionState = "disconnected";
  updateConnectionUI();
}

// ---- Message handling ----

function handleMessage(data: Record<string, unknown>): void {
  const type = (data.type as string) || "unknown";
  addConsoleEntry(type, data);

  if (type === "subscribed") {
    const msg = data.msg as { sid: number; channel: string };
    const pending = pendingSubscribes.get(data.id as number);
    subscriptions.push({
      sid: msg.sid,
      channel: msg.channel,
      marketTickers: pending?.marketTickers ?? [],
    });
    pendingSubscribes.delete(data.id as number);
    renderSubscriptions();
    if (commandSelect.value !== "subscribe") {
      renderCommandForm();
    }
  } else if (type === "unsubscribed") {
    const sid = data.sid as number;
    subscriptions = subscriptions.filter((s) => s.sid !== sid);
    renderSubscriptions();
    if (commandSelect.value !== "subscribe") {
      renderCommandForm();
    }
  } else if (type === "list_subscriptions") {
    // Response from list_subscriptions: update our local state
    handleListSubscriptionsResponse(data);
  }
}

function handleListSubscriptionsResponse(data: Record<string, unknown>): void {
  // The response may contain a msg with subscription info.
  // Try to parse and replace our local subscription list.
  const msg = data.msg;
  if (!msg || typeof msg !== "object") return;

  // The response format may be an array of subscriptions or an object with subs.
  // Handle common formats:
  const subs = Array.isArray(msg)
    ? msg
    : (msg as Record<string, unknown>).subscriptions;

  if (Array.isArray(subs)) {
    subscriptions = subs.map((s: Record<string, unknown>) => ({
      sid: s.sid as number,
      channel: (s.channel as string) || "unknown",
      marketTickers: (s.market_tickers as string[]) ?? [],
    }));
    renderSubscriptions();
    if (commandSelect.value !== "subscribe") {
      renderCommandForm();
    }
  }
}

// ---- Refresh subscriptions ----

function refreshSubscriptions(): void {
  if (!ws || connectionState !== "connected") {
    addConsoleEntry("error", { message: "Not connected" });
    return;
  }
  const id = commandId++;
  ws.send(JSON.stringify({ id, cmd: "list_subscriptions", params: {} }));
  addConsoleEntry("sent", { id, cmd: "list_subscriptions", params: {} });
}

// ---- Send command ----

function sendCommand(): void {
  if (!ws || connectionState !== "connected") return;

  const cmd = commandSelect.value;
  const id = commandId++;

  if (cmd === "subscribe") {
    const checked = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        "[data-channel]:checked"
      )
    ).map((el) => el.dataset.channel!);

    if (checked.length === 0) {
      addConsoleEntry("error", { message: "Select at least one channel" });
      return;
    }

    const marketTickers = parseTickers("#ws-market-tickers");
    const marketIds = parseTickers("#ws-market-ids");

    if (marketTickers.length && marketIds.length) {
      addConsoleEntry("error", { message: "market_tickers and market_ids are mutually exclusive" });
      return;
    }

    const params: Record<string, unknown> = { channels: checked };

    // market_ticker (singular) vs market_tickers (plural)
    if (marketTickers.length === 1) {
      params.market_ticker = marketTickers[0];
    } else if (marketTickers.length > 1) {
      params.market_tickers = marketTickers;
    }

    // market_id (singular) vs market_ids (plural)
    if (marketIds.length === 1) {
      params.market_id = marketIds[0];
    } else if (marketIds.length > 1) {
      params.market_ids = marketIds;
    }

    const sendSnapshot = container.querySelector<HTMLInputElement>("#ws-send-initial-snapshot");
    if (sendSnapshot?.checked) params.send_initial_snapshot = true;

    const skipAck = container.querySelector<HTMLInputElement>("#ws-skip-ticker-ack");
    if (skipAck?.checked) params.skip_ticker_ack = true;

    const shardInput = container.querySelector<HTMLInputElement>("#ws-shard-factor");
    const shardVal = shardInput?.value ? parseInt(shardInput.value, 10) : NaN;
    if (!isNaN(shardVal) && shardVal > 0) params.shard_factor = shardVal;

    pendingSubscribes.set(id, { marketTickers: marketTickers.length ? marketTickers : marketIds });

    ws.send(JSON.stringify({ id, cmd: "subscribe", params }));
    addConsoleEntry("sent", { id, cmd: "subscribe", params });
  } else if (cmd === "unsubscribe") {
    const select = document.querySelector<HTMLSelectElement>("#ws-unsub-sids");
    const sids = Array.from(select?.selectedOptions ?? []).map((o) =>
      Number(o.value)
    );
    if (sids.length === 0) {
      addConsoleEntry("error", { message: "Select at least one subscription" });
      return;
    }
    ws.send(JSON.stringify({ id, cmd: "unsubscribe", params: { sids } }));
    addConsoleEntry("sent", { id, cmd: "unsubscribe", params: { sids } });
  } else if (cmd === "update_subscription") {
    const select = document.querySelector<HTMLSelectElement>("#ws-update-sids");
    const sids = Array.from(select?.selectedOptions ?? []).map((o) =>
      Number(o.value)
    );
    if (sids.length === 0) {
      addConsoleEntry("error", { message: "Select at least one subscription" });
      return;
    }

    const marketTickers = parseTickers("#ws-market-tickers");
    const marketIds = parseTickers("#ws-market-ids");

    if (marketTickers.length && marketIds.length) {
      addConsoleEntry("error", { message: "market_tickers and market_ids are mutually exclusive" });
      return;
    }

    // sid (singular) vs sids (plural)
    const params: Record<string, unknown> =
      sids.length === 1 ? { sid: sids[0] } : { sids };

    // market_ticker (singular) vs market_tickers (plural)
    if (marketTickers.length === 1) {
      params.market_ticker = marketTickers[0];
    } else if (marketTickers.length > 1) {
      params.market_tickers = marketTickers;
    }

    // market_id (singular) vs market_ids (plural)
    if (marketIds.length === 1) {
      params.market_id = marketIds[0];
    } else if (marketIds.length > 1) {
      params.market_ids = marketIds;
    }

    const actionSelect = container.querySelector<HTMLSelectElement>("#ws-update-action");
    if (actionSelect?.value) params.action = actionSelect.value;

    const sendSnapshot = container.querySelector<HTMLInputElement>("#ws-send-initial-snapshot");
    if (sendSnapshot?.checked) params.send_initial_snapshot = true;

    ws.send(
      JSON.stringify({ id, cmd: "update_subscription", params })
    );
    addConsoleEntry("sent", {
      id,
      cmd: "update_subscription",
      params,
    });
  }
}

// ---- Subscriptions table ----

function renderSubscriptions(): void {
  if (subscriptions.length === 0) {
    subsBody.innerHTML = `<p class="no-params">No active subscriptions.</p>`;
    return;
  }

  const rows = subscriptions
    .map(
      (s) => `
    <tr>
      <td>${s.sid}</td>
      <td><span class="ws-msg-badge ws-msg-badge--${badgeType(s.channel)}">${s.channel}</span></td>
      <td>${s.marketTickers.join(", ") || "—"}</td>
      <td>
        <button class="ws-unsub-btn" data-sid="${s.sid}">Unsub</button>
      </td>
    </tr>`
    )
    .join("");

  subsBody.innerHTML = `
    <table class="ws-subs-table">
      <thead>
        <tr><th>SID</th><th>Channel</th><th>Market Tickers</th><th></th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  // Bind unsub buttons
  subsBody.querySelectorAll<HTMLButtonElement>(".ws-unsub-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sid = Number(btn.dataset.sid);
      if (ws && connectionState === "connected") {
        const id = commandId++;
        ws.send(JSON.stringify({ id, cmd: "unsubscribe", params: { sids: [sid] } }));
        addConsoleEntry("sent", { id, cmd: "unsubscribe", params: { sids: [sid] } });
      }
    });
  });
}

// ---- Console ----

function addConsoleEntry(type: string, data: unknown): void {
  consoleEntries.push({ timestamp: new Date(), type, data });
  if (consoleEntries.length > MAX_CONSOLE_ENTRIES) {
    consoleEntries = consoleEntries.slice(-MAX_CONSOLE_ENTRIES);
  }
  renderConsole();
}

function renderConsole(): void {
  if (consoleEntries.length === 0) {
    consoleEl.innerHTML = `<div class="ws-console-empty">No messages yet. Connect and subscribe to start receiving data.</div>`;
    return;
  }

  const html = consoleEntries
    .map((entry) => {
      const ts = entry.timestamp.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
      } as Intl.DateTimeFormatOptions);
      const badge = `<span class="ws-msg-badge ws-msg-badge--${badgeType(entry.type)}">${entry.type}</span>`;
      const payload =
        typeof entry.data === "string"
          ? entry.data
          : JSON.stringify(entry.data, null, 2);
      return `<div class="ws-console-entry"><span class="ws-console-ts">${ts}</span>${badge}<pre class="ws-console-payload">${escapeHtml(payload)}</pre></div>`;
    })
    .join("");

  consoleEl.innerHTML = html;

  if (autoScroll) {
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }
}

// ---- UI Updates ----

function updateConnectionUI(): void {
  statusDot.className = `ws-status-dot ws-status-dot--${connectionState}`;
  statusText.textContent =
    connectionState === "connected"
      ? "Connected"
      : connectionState === "connecting"
        ? "Connecting..."
        : "Disconnected";

  connectBtn.textContent =
    connectionState === "disconnected" ? "Connect" : "Disconnect";
  connectBtn.classList.toggle(
    "btn-send--danger",
    connectionState !== "disconnected"
  );

  sendCommandBtn.disabled = connectionState !== "connected";
}

// ---- Utilities ----

function parseTickers(selector: string): string[] {
  const el = document.querySelector<HTMLInputElement>(selector);
  const raw = el?.value?.trim() ?? "";
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function badgeType(type: string): string {
  if (type === "subscribed" || type === "ok") return "success";
  if (type === "unsubscribed" || type === "list_subscriptions") return "info";
  if (type === "error") return "error";
  if (type === "sent" || type === "system") return "system";
  return "data";
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function qs<T extends Element = Element>(selector: string): T {
  return container.querySelector<T>(selector)!;
}

function qsa<T extends Element = Element>(selector: string): NodeListOf<T> {
  return container.querySelectorAll<T>(selector);
}
