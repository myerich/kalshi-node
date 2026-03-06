/** Entry point — lightweight router that delegates to REST or WebSocket panel. */

import { mountRestPanel } from "./rest-panel";
import { mountWsPanel } from "./ws-panel";

const app = document.querySelector<HTMLDivElement>("#app")!;

type PanelId = "rest" | "ws";

function currentPanel(): PanelId {
  const path = location.pathname.replace(/^\//, "");
  if (path === "ws") return "ws";
  return "rest";
}

function render(): void {
  const panel = currentPanel();

  app.innerHTML = `
    <nav class="tab-nav">
      <a href="/rest" class="tab-link${panel === "rest" ? " tab-link--active" : ""}">REST API</a>
      <a href="/ws" class="tab-link${panel === "ws" ? " tab-link--active" : ""}">WebSocket</a>
    </nav>
    <div id="panel-content"></div>
  `;

  const content = document.querySelector<HTMLDivElement>("#panel-content")!;

  if (panel === "ws") {
    mountWsPanel(content);
  } else {
    mountRestPanel(content);
  }
}

// Client-side navigation
app.addEventListener("click", (e) => {
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>(".tab-link");
  if (!link) return;
  e.preventDefault();
  const href = link.getAttribute("href")!;
  if (href !== location.pathname) {
    history.pushState(null, "", href);
    render();
  }
});

window.addEventListener("popstate", render);

render();
