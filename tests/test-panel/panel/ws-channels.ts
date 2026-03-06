/** Channel definitions for the WebSocket test panel. */

export interface ChannelDef {
  name: string;
  label: string;
  description: string;
}

/** Market data channels — public data, but auth still required for the WS connection. */
export const MARKET_CHANNELS: ChannelDef[] = [
  {
    name: "ticker",
    label: "Ticker",
    description: "Real-time bid/ask prices",
  },
  {
    name: "ticker_v2",
    label: "Ticker v2",
    description: "Incremental ticker deltas with volume, OI",
  },
  {
    name: "orderbook_delta",
    label: "Orderbook",
    description: "Snapshot first, then incremental deltas",
  },
  {
    name: "trade",
    label: "Trade",
    description: "Public trade execution notifications",
  },
  {
    name: "market_lifecycle_v2",
    label: "Market Lifecycle",
    description: "Market/event status change events",
  },
  {
    name: "multivariate",
    label: "Multivariate",
    description: "Multivariate collection data",
  },
];

/** User-specific channels — requires auth, returns data for the authenticated user. */
export const USER_CHANNELS: ChannelDef[] = [
  {
    name: "user_order",
    label: "User Orders",
    description: "Your order lifecycle events",
  },
  {
    name: "fill",
    label: "Fills",
    description: "Your order fill notifications",
  },
  {
    name: "market_positions",
    label: "Positions",
    description: "Your position updates",
  },
  {
    name: "communications",
    label: "Communications",
    description: "RFQ and quote notifications",
  },
  {
    name: "order_group_updates",
    label: "Order Groups",
    description: "Order group status changes",
  },
];

export const ALL_CHANNELS: ChannelDef[] = [
  ...MARKET_CHANNELS,
  ...USER_CHANNELS,
];
