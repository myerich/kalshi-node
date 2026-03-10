/** REST API test panel — extracted from the original main.ts. */

import { ENDPOINTS, type EndpointDef, type ParamDef } from "./endpoints";

// ---- State ----

let selectedEndpoint: EndpointDef = ENDPOINTS[0];
let authMode: "none" | "dev" | "prod" = "prod";
let loading = false;
let responseStatus = 0;
let responseBody = "";
let responseTime = 0;

// ---- Persistence (localStorage) ----

const LS_ENDPOINT = "kalshi_rest_endpoint";
const LS_AUTH = "kalshi_rest_auth";
const lsParams = (idx: number) => `kalshi_rest_params_${idx}`;

function loadState(): void {
  const savedAuth = localStorage.getItem(LS_AUTH) as typeof authMode | null;
  if (savedAuth === "none" || savedAuth === "dev" || savedAuth === "prod") {
    authMode = savedAuth;
  }
  const savedIdx = parseInt(localStorage.getItem(LS_ENDPOINT) ?? "");
  if (!isNaN(savedIdx) && savedIdx >= 0 && savedIdx < ENDPOINTS.length) {
    selectedEndpoint = ENDPOINTS[savedIdx];
  }
}

function saveParams(): void {
  const idx = ENDPOINTS.indexOf(selectedEndpoint);
  const vals: Record<string, string> = {};
  paramsContainer
    .querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-param]")
    .forEach((el) => {
      vals[el.dataset.param!] = el.value;
    });
  localStorage.setItem(lsParams(idx), JSON.stringify(vals));
}

function restoreParams(): void {
  const idx = ENDPOINTS.indexOf(selectedEndpoint);
  const raw = localStorage.getItem(lsParams(idx));
  if (!raw) return;
  try {
    const vals = JSON.parse(raw) as Record<string, string>;
    paramsContainer
      .querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-param]")
      .forEach((el) => {
        const v = vals[el.dataset.param!];
        if (v !== undefined) el.value = v;
      });
  } catch {
    /* ignore corrupt data */
  }
}

// ---- Cached DOM refs (set in mount) ----

let endpointSelect: HTMLSelectElement;
let authButtons: NodeListOf<HTMLButtonElement>;
let paramsContainer: HTMLDivElement;
let endpointInfo: HTMLDivElement;
let sendBtn: HTMLButtonElement;
let statusEl: HTMLSpanElement;
let responsePre: HTMLPreElement;
let responseMeta: HTMLSpanElement;

/** Mount the REST panel into the given container element. */
export function mountRestPanel(container: HTMLElement): void {
  loadState();

  container.innerHTML = buildShell();

  endpointSelect = qs<HTMLSelectElement>("#endpoint-select", container);
  authButtons = qsa<HTMLButtonElement>(".auth-toggle button", container);
  paramsContainer = qs<HTMLDivElement>("#params-container", container);
  endpointInfo = qs<HTMLDivElement>("#endpoint-info", container);
  sendBtn = qs<HTMLButtonElement>("#btn-send", container);
  statusEl = qs<HTMLSpanElement>("#status-indicator", container);
  responsePre = qs<HTMLPreElement>("#response-body", container);
  responseMeta = qs<HTMLSpanElement>("#response-meta", container);

  // Restore endpoint select position
  endpointSelect.value = String(ENDPOINTS.indexOf(selectedEndpoint));

  // Restore active auth button
  authButtons.forEach((b) =>
    b.classList.toggle("active", b.dataset.mode === authMode)
  );

  endpointSelect.addEventListener("change", () => {
    selectedEndpoint = ENDPOINTS[parseInt(endpointSelect.value)];
    localStorage.setItem(LS_ENDPOINT, endpointSelect.value);
    renderForm();
  });

  authButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      authMode = btn.dataset.mode as typeof authMode;
      localStorage.setItem(LS_AUTH, authMode);
      authButtons.forEach((b) => b.classList.toggle("active", b === btn));
    });
  });

  sendBtn.addEventListener("click", sendRequest);

  renderForm();
}

// ---- Render helpers ----

function buildShell(): string {
  const categories = [...new Set(ENDPOINTS.map((e) => e.category))];
  const optgroups = categories
    .map((cat) => {
      const opts = ENDPOINTS.filter((e) => e.category === cat)
        .map((e) => {
          const idx = ENDPOINTS.indexOf(e);
          return `<option value="${idx}"><span class="method-badge method-badge--${e.method}">${e.method}</span> ${e.name}</option>`;
        })
        .join("");
      return `<optgroup label="${cat}">${opts}</optgroup>`;
    })
    .join("");

  return `
    <h1>Kalshi REST API Test Panel</h1>

    <div class="controls">
      <div class="field field--grow">
        <label for="endpoint-select">Endpoint</label>
        <select id="endpoint-select">${optgroups}</select>
      </div>

      <div class="field">
        <label>Auth Mode</label>
        <div class="auth-toggle">
          <button data-mode="none">No Auth</button>
          <button data-mode="dev">Dev</button>
          <button data-mode="prod" class="active">Prod</button>
        </div>
      </div>
    </div>

    <div id="endpoint-info" class="endpoint-info"></div>

    <div id="params-container"></div>

    <div class="send-row">
      <button id="btn-send" class="btn-send">Send Request</button>
      <span id="status-indicator" class="status-indicator"></span>
    </div>

    <div class="response-section">
      <div class="response-header">
        <h2>Response</h2>
        <span id="response-meta" class="response-meta"></span>
      </div>
      <div class="response-body">
        <pre id="response-body"><span class="empty">Send a request to see the response.</span></pre>
      </div>
    </div>
  `;
}

function renderForm(): void {
  const ep = selectedEndpoint;

  const authBadge = ep.auth
    ? `<span class="auth-badge">Auth Required</span>`
    : `<span class="no-auth-badge">Public</span>`;
  const methodBadge = `<span class="method-badge method-badge--${ep.method}">${ep.method}</span>`;
  endpointInfo.innerHTML = `${methodBadge} ${ep.endpoint} ${authBadge}`;

  const sections: string[] = [];

  if (ep.pathParams?.length) {
    sections.push(
      buildParamSection(
        "Path Parameters",
        ep.pathParams.map((p) => ({
          name: p,
          type: "string" as const,
          required: true,
        }))
      )
    );
  }

  if (ep.queryParams?.length) {
    sections.push(buildParamSection("Query Parameters", ep.queryParams));
  }

  if (ep.bodyParams?.length) {
    sections.push(buildParamSection("Body Parameters", ep.bodyParams));
  }

  if (sections.length === 0) {
    paramsContainer.innerHTML = `
      <div class="params-section">
        <p class="no-params">This endpoint has no parameters.</p>
      </div>`;
  } else {
    paramsContainer.innerHTML = sections.join("");
    restoreParams();
    paramsContainer.addEventListener("input", saveParams);
    paramsContainer.addEventListener("change", saveParams);
  }
}

function buildParamSection(title: string, params: ParamDef[]): string {
  const fields = params
    .map((p) => {
      const reqMark = p.required ? `<span class="required">*</span>` : "";
      let input: string;

      if (p.options) {
        const opts = [`<option value="">—</option>`]
          .concat(p.options.map((o) => `<option value="${o}">${o}</option>`))
          .join("");
        input = `<select data-param="${p.name}" data-ptype="${p.type}">${opts}</select>`;
      } else if (p.type === "boolean") {
        input = `<select data-param="${p.name}" data-ptype="boolean">
        <option value="">—</option>
        <option value="true">true</option>
        <option value="false">false</option>
      </select>`;
      } else {
        const inputType = p.type === "number" ? "number" : "text";
        input = `<input type="${inputType}" data-param="${p.name}" data-ptype="${p.type}" placeholder="${p.name}" />`;
      }

      return `<div class="param-field"><label>${p.name} ${reqMark}</label>${input}</div>`;
    })
    .join("");

  return `
    <div class="params-section">
      <h2>${title}</h2>
      <div class="params-grid">${fields}</div>
    </div>`;
}

// ---- Send request ----

async function sendRequest(): Promise<void> {
  if (loading) return;
  loading = true;
  sendBtn.disabled = true;
  statusEl.className = "status-indicator status-indicator--loading";
  statusEl.textContent = "Sending...";
  responsePre.textContent = "";
  responseMeta.textContent = "";

  const ep = selectedEndpoint;

  let resolvedEndpoint = ep.endpoint;
  if (ep.pathParams) {
    for (const p of ep.pathParams) {
      const el = qs<HTMLInputElement>(`[data-param="${p}"]`);
      const val = el?.value?.trim() ?? "";
      if (!val) {
        showError(`Path parameter "${p}" is required.`);
        return;
      }
      resolvedEndpoint = resolvedEndpoint.replace(
        `:${p}`,
        encodeURIComponent(val)
      );
    }
  }

  const params: Record<string, string | number | boolean> = {};
  if (ep.queryParams) {
    for (const p of ep.queryParams) {
      const el = qs<HTMLInputElement | HTMLSelectElement>(
        `[data-param="${p.name}"]`
      );
      const raw = el?.value?.trim() ?? "";
      if (raw === "") continue;
      params[p.name] = coerce(raw, p.type);
    }
  }

  let data: Record<string, unknown> | undefined;
  if (ep.bodyParams) {
    data = {};
    for (const p of ep.bodyParams) {
      const el = qs<HTMLInputElement | HTMLSelectElement>(
        `[data-param="${p.name}"]`
      );
      const raw = el?.value?.trim() ?? "";
      if (raw === "") continue;
      data[p.name] = coerce(raw, p.type);
    }
    if (Object.keys(data).length === 0) data = undefined;
  }

  const t0 = performance.now();

  try {
    const res = await fetch("/api/kalshi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: ep.method,
        endpoint: resolvedEndpoint,
        params: Object.keys(params).length > 0 ? params : undefined,
        data,
        authMode,
      }),
    });

    responseTime = Math.round(performance.now() - t0);
    responseStatus = res.status;

    const text = await res.text();
    try {
      const json = JSON.parse(text);
      responseBody = JSON.stringify(json, null, 2);
    } catch {
      responseBody = text;
    }

    const ok = res.status >= 200 && res.status < 300;
    statusEl.className = `status-indicator ${ok ? "status-indicator--ok" : "status-indicator--error"}`;
    statusEl.textContent = `${res.status} ${res.statusText}`;
    responseMeta.textContent = `${responseTime}ms`;
    responsePre.textContent = responseBody;
  } catch (err) {
    showError(`Network error: ${(err as Error).message}`);
  } finally {
    loading = false;
    sendBtn.disabled = false;
  }
}

function showError(msg: string): void {
  statusEl.className = "status-indicator status-indicator--error";
  statusEl.textContent = msg;
  loading = false;
  sendBtn.disabled = false;
}

// ---- Utilities ----

function coerce(raw: string, type: string): string | number | boolean {
  if (type === "number") return Number(raw);
  if (type === "boolean") return raw === "true";
  return raw;
}

function qs<T extends Element>(selector: string, root?: Element): T {
  return (root ?? document).querySelector<T>(selector)!;
}

function qsa<T extends Element>(selector: string, root?: Element): NodeListOf<T> {
  return (root ?? document).querySelectorAll<T>(selector);
}
