import type {
  ExchangeStatus,
  ExchangeAnnouncementsResponse,
  SeriesFeeChangesResponse,
  SeriesFeeChangesParams,
  ExchangeSchedule,
  UserDataTimestamp,
  SeriesListResponse,
  SeriesListParams,
  SeriesResponse,
  SeriesParams,
  TagsByCategoriesResponse,
  FiltersBySportsResponse,
  AccountLimitsResponse,
  EventsListResponse,
  EventsListParams,
  EventResponse,
  EventParams,
  MultivariateEventsResponse,
  MultivariateEventsParams,
  EventMetadataResponse,
  MarketsListResponse,
  MarketsListParams,
  MarketResponse,
  Orderbook,
  OrderbookParams,
  TradesResponse,
  TradesParams,
  BatchCandlesticksResponse,
  BatchCandlesticksParams,
  MarketCandlesticksResponse,
  MarketCandlesticksParams,
  EventCandlesticksResponse,
  EventCandlesticksParams,
  ForecastPercentilesHistoryResponse,
  ForecastPercentilesHistoryParams,
  IncentiveProgramsResponse,
  IncentiveProgramsParams,
  MilestonesResponse,
  MilestonesParams,
  MilestoneByIdResponse,
  LiveDataResponse,
  LiveDataBatchResponse,
  LiveDataBatchParams,
  StructuredTargetsResponse,
  StructuredTargetsParams,
  StructuredTargetByIdResponse,
  MultivariateEventCollectionsResponse,
  MultivariateEventCollectionsParams,
  MultivariateEventCollectionResponse,
  CollectionLookupHistoryResponse,
  CollectionLookupHistoryParams,
  CreateMarketInCollectionData,
  CreateMarketInCollectionResponse,
  LookupTickersInCollectionData,
  LookupTickersInCollectionResponse,
  PortfolioOrdersResponse,
  PortfolioOrdersParams,
  PortfolioOrderResponse,
  QueuePositionsResponse,
  QueuePositionsParams,
  QueuePositionByIdResponse,
  OrderGroupsResponse,
  OrderGroupByIdResponse,
  CreateOrderGroupResponse,
  CreateOrderGroupData,
  UpdateOrderGroupLimitData,
  Balance,
  SubaccountBalancesResponse,
  SubaccountTransfersResponse,
  SubaccountTransfersParams,
  PortfolioPositionsResponse,
  PortfolioPositionsParams,
  PortfolioSettlementsResponse,
  PortfolioSettlementsParams,
  RestingValue,
  PortfolioFillsResponse,
  PortfolioFillsParams,
  CreateOrderData,
  CreateOrderResponse,
  DeleteOrderResponse,
  AmendOrderData,
  AmendOrderResponse,
  DecreaseOrderData,
  DecreaseOrderResponse,
  BatchCreateOrdersData,
  BatchCreateOrdersResponse,
  BatchCancelOrdersData,
  BatchCancelOrdersResponse,
  CreateSubaccountResponse,
  TransferBetweenSubaccountsData,
  GetSubaccountNettingResponse,
  UpdateSubaccountNettingRequest,
  GetHistoricalCutoffResponse,
  GetHistoricalMarketsParams,
  GetHistoricalCandlesticksParams,
  GetHistoricalOrdersParams,
  GetHistoricalFillsParams,
  GetApiKeysResponse,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  GenerateApiKeyRequest,
  GenerateApiKeyResponse,
  GetFCMOrdersParams,
  GetFCMPositionsParams,
  GetCommunicationsIDResponse,
  GetRFQsParams,
  GetRFQsResponse,
  GetRFQResponse,
  CreateRFQRequest,
  CreateRFQResponse,
  GetQuotesParams,
  GetQuotesResponse,
  GetQuoteResponse,
  CreateQuoteRequest,
  CreateQuoteResponse,
  AcceptQuoteRequest,
} from "./types";

export interface RequestOptions {
  params?: object;
  data?: object;
  auth?: boolean;
  retries?: number;
}

export abstract class KalshiClientBase {
  protected abstract request<T>(
    method: string,
    endpoint: string,
    options?: RequestOptions
  ): Promise<T>;

  // ==================== Exchange ====================

  async getExchangeStatus(): Promise<ExchangeStatus> {
    return this.request<ExchangeStatus>("GET", "/exchange/status");
  }

  async getExchangeAnnouncements(): Promise<ExchangeAnnouncementsResponse> {
    return this.request<ExchangeAnnouncementsResponse>("GET", "/exchange/announcements");
  }

  async getExchangeSchedule(): Promise<ExchangeSchedule> {
    return this.request<ExchangeSchedule>("GET", "/exchange/schedule");
  }

  async getExchangeUserDataTimestamp(): Promise<UserDataTimestamp> {
    return this.request<UserDataTimestamp>("GET", "/exchange/user_data_timestamp");
  }

  // ==================== Account ====================

  async getAccountLimits(): Promise<AccountLimitsResponse> {
    return this.request<AccountLimitsResponse>("GET", "/account/limits", {
      auth: true,
    });
  }

  // ==================== Series ====================

  async getSeriesFeeChanges(
    params?: SeriesFeeChangesParams
  ): Promise<SeriesFeeChangesResponse> {
    return this.request<SeriesFeeChangesResponse>("GET", "/series/fee_changes", {
      params,
    });
  }

  async getSearchTagsForSeriesCategories(): Promise<TagsByCategoriesResponse> {
    return this.request<TagsByCategoriesResponse>("GET", "/search/tags_by_categories");
  }

  async getSearchFiltersBySport(): Promise<FiltersBySportsResponse> {
    return this.request<FiltersBySportsResponse>("GET", "/search/filters_by_sport");
  }

  async getSeriesList(params?: SeriesListParams): Promise<SeriesListResponse> {
    return this.request<SeriesListResponse>("GET", "/series", {
      params,
    });
  }

  async getSeries(
    seriesTicker: string,
    params?: SeriesParams
  ): Promise<SeriesResponse> {
    return this.request<SeriesResponse>("GET", `/series/${seriesTicker}`, {
      params,
    });
  }

  // ==================== Events ====================

  async getEventsList(params?: EventsListParams): Promise<EventsListResponse> {
    return this.request<EventsListResponse>("GET", "/events", {
      params,
    });
  }

  async getEvent(
    eventTicker: string,
    params?: EventParams
  ): Promise<EventResponse> {
    return this.request<EventResponse>("GET", `/events/${eventTicker}`, {
      params,
    });
  }

  async getMultivariateEvents(
    params?: MultivariateEventsParams
  ): Promise<MultivariateEventsResponse> {
    return this.request<MultivariateEventsResponse>("GET", "/events/multivariate", {
      params,
    });
  }

  async getEventMetadata(eventTicker: string): Promise<EventMetadataResponse> {
    return this.request<EventMetadataResponse>(
      "GET",
      `/events/${eventTicker}/metadata`
    );
  }

  // ==================== Markets ====================

  async getMarketsList(params?: MarketsListParams): Promise<MarketsListResponse> {
    return this.request<MarketsListResponse>("GET", "/markets", {
      params,
    });
  }

  async getMarket(ticker: string): Promise<MarketResponse> {
    return this.request<MarketResponse>("GET", `/markets/${ticker}`);
  }

  async getMarketOrderbook(
    ticker: string,
    params?: OrderbookParams
  ): Promise<Orderbook> {
    return this.request<Orderbook>("GET", `/markets/${ticker}/orderbook`, {
      params,
    });
  }

  async getMarketTrades(params?: TradesParams): Promise<TradesResponse> {
    return this.request<TradesResponse>("GET", "/markets/trades", {
      params,
    });
  }

  async getBatchCandlesticks(
    params: BatchCandlesticksParams
  ): Promise<BatchCandlesticksResponse> {
    return this.request<BatchCandlesticksResponse>("GET", "/markets/candlesticks", {
      params,
    });
  }

  async getMarketCandlesticks(
    seriesTicker: string,
    ticker: string,
    params: MarketCandlesticksParams
  ): Promise<MarketCandlesticksResponse> {
    return this.request<MarketCandlesticksResponse>(
      "GET",
      `/series/${seriesTicker}/markets/${ticker}/candlesticks`,
      { params }
    );
  }

  async getEventCandlesticks(
    seriesTicker: string,
    eventTicker: string,
    params: EventCandlesticksParams
  ): Promise<EventCandlesticksResponse> {
    return this.request<EventCandlesticksResponse>(
      "GET",
      `/series/${seriesTicker}/events/${eventTicker}/candlesticks`,
      { params }
    );
  }

  async getEventForecastPercentilesHistory(
    seriesTicker: string,
    eventTicker: string,
    params: ForecastPercentilesHistoryParams
  ): Promise<ForecastPercentilesHistoryResponse> {
    return this.request<ForecastPercentilesHistoryResponse>(
      "GET",
      `/series/${seriesTicker}/events/${eventTicker}/forecast_percentile_history`,
      { params }
    );
  }

  // ==================== Milestones ====================

  async getMilestones(params: MilestonesParams): Promise<MilestonesResponse> {
    return this.request<MilestonesResponse>("GET", "/milestones", {
      params,
    });
  }

  async getMilestoneById(milestoneId: string): Promise<MilestoneByIdResponse> {
    return this.request<MilestoneByIdResponse>(
      "GET",
      `/milestones/${milestoneId}`
    );
  }

  // ==================== Live Data ====================

  async getLiveData(type: string, milestoneId: string): Promise<LiveDataResponse> {
    return this.request<LiveDataResponse>(
      "GET",
      `/live_data/${type}/milestone/${milestoneId}`
    );
  }

  async getLiveDataBatch(params: LiveDataBatchParams): Promise<LiveDataBatchResponse> {
    return this.request<LiveDataBatchResponse>("GET", "/live_data/batch", {
      params,
    });
  }

  // ==================== Structured Targets ====================

  async getStructuredTargets(
    params?: StructuredTargetsParams
  ): Promise<StructuredTargetsResponse> {
    return this.request<StructuredTargetsResponse>("GET", "/structured_targets", {
      params,
    });
  }

  async getStructuredTargetById(
    structuredTargetId: string
  ): Promise<StructuredTargetByIdResponse> {
    return this.request<StructuredTargetByIdResponse>(
      "GET",
      `/structured_targets/${structuredTargetId}`
    );
  }

  // ==================== Multivariate Event Collections ====================

  async getMultivariateEventCollections(
    params?: MultivariateEventCollectionsParams
  ): Promise<MultivariateEventCollectionsResponse> {
    return this.request<MultivariateEventCollectionsResponse>(
      "GET",
      "/multivariate_event_collections",
      { params }
    );
  }

  async getMultivariateEventCollection(
    collectionTicker: string
  ): Promise<MultivariateEventCollectionResponse> {
    return this.request<MultivariateEventCollectionResponse>(
      "GET",
      `/multivariate_event_collections/${collectionTicker}`
    );
  }

  async createMarketInCollection(
    collectionTicker: string,
    data: CreateMarketInCollectionData
  ): Promise<CreateMarketInCollectionResponse> {
    return this.request<CreateMarketInCollectionResponse>(
      "POST",
      `/multivariate_event_collections/${collectionTicker}`,
      { data, auth: true }
    );
  }

  async getCollectionLookupHistory(
    collectionTicker: string,
    params: CollectionLookupHistoryParams
  ): Promise<CollectionLookupHistoryResponse> {
    return this.request<CollectionLookupHistoryResponse>(
      "GET",
      `/multivariate_event_collections/${collectionTicker}/lookup`,
      { params }
    );
  }

  async lookupTickersInCollection(
    collectionTicker: string,
    data: LookupTickersInCollectionData
  ): Promise<LookupTickersInCollectionResponse> {
    return this.request<LookupTickersInCollectionResponse>(
      "PUT",
      `/multivariate_event_collections/${collectionTicker}/lookup`,
      { data }
    );
  }

  // ==================== Incentives ====================

  async getIncentivePrograms(
    params?: IncentiveProgramsParams
  ): Promise<IncentiveProgramsResponse> {
    return this.request<IncentiveProgramsResponse>("GET", "/incentive_programs", {
      params,
    });
  }

  // ==================== Portfolio - Orders ====================

  async getPortfolioOrders(
    params?: PortfolioOrdersParams
  ): Promise<PortfolioOrdersResponse> {
    return this.request<PortfolioOrdersResponse>("GET", "/portfolio/orders", {
      params,
      auth: true,
    });
  }

  async getPortfolioOrderById(orderId: string): Promise<PortfolioOrderResponse> {
    return this.request<PortfolioOrderResponse>(
      "GET",
      `/portfolio/orders/${orderId}`,
      { auth: true }
    );
  }

  async getPortfolioOrderQueuePositions(
    params?: QueuePositionsParams
  ): Promise<QueuePositionsResponse> {
    return this.request<QueuePositionsResponse>(
      "GET",
      "/portfolio/orders/queue_positions",
      { params, auth: true }
    );
  }

  async getPortfolioOrderQueuePositionById(
    orderId: string
  ): Promise<QueuePositionByIdResponse> {
    return this.request<QueuePositionByIdResponse>(
      "GET",
      `/portfolio/orders/${orderId}/queue_position`,
      { auth: true }
    );
  }

  // ==================== Portfolio - Order Groups ====================

  async getPortfolioOrderGroups(): Promise<OrderGroupsResponse> {
    return this.request<OrderGroupsResponse>("GET", "/portfolio/order_groups", {
      auth: true,
    });
  }

  async getPortfolioOrderGroupById(
    groupId: string
  ): Promise<OrderGroupByIdResponse> {
    return this.request<OrderGroupByIdResponse>(
      "GET",
      `/portfolio/order_groups/${groupId}`,
      { auth: true }
    );
  }

  async createPortfolioOrderGroup(
    data: CreateOrderGroupData
  ): Promise<CreateOrderGroupResponse> {
    return this.request<CreateOrderGroupResponse>(
      "POST",
      "/portfolio/order_groups/create",
      { data, auth: true }
    );
  }

  async deletePortfolioOrderGroup(groupId: string): Promise<void> {
    await this.request<Record<string, never>>(
      "DELETE",
      `/portfolio/order_groups/${groupId}`,
      { auth: true }
    );
  }

  async resetPortfolioOrderGroup(groupId: string): Promise<void> {
    await this.request<Record<string, never>>(
      "PUT",
      `/portfolio/order_groups/${groupId}/reset`,
      { auth: true }
    );
  }

  async triggerPortfolioOrderGroup(groupId: string): Promise<void> {
    await this.request<Record<string, never>>(
      "PUT",
      `/portfolio/order_groups/${groupId}/trigger`,
      { auth: true }
    );
  }

  async updatePortfolioOrderGroupLimit(
    groupId: string,
    data: UpdateOrderGroupLimitData
  ): Promise<void> {
    await this.request<Record<string, never>>(
      "PUT",
      `/portfolio/order_groups/${groupId}/limit`,
      { data, auth: true }
    );
  }

  // ==================== Portfolio - Balance ====================

  async getPortfolioBalance(): Promise<Balance> {
    return this.request<Balance>("GET", "/portfolio/balance", { auth: true });
  }

  async getPortfolioSubaccountBalances(): Promise<SubaccountBalancesResponse> {
    return this.request<SubaccountBalancesResponse>(
      "GET",
      "/portfolio/subaccounts/balances",
      { auth: true }
    );
  }

  async getPortfolioSubaccountTransfers(
    params?: SubaccountTransfersParams
  ): Promise<SubaccountTransfersResponse> {
    return this.request<SubaccountTransfersResponse>(
      "GET",
      "/portfolio/subaccounts/transfers",
      { params, auth: true }
    );
  }

  // ==================== Portfolio - Positions ====================

  async getPortfolioPositions(
    params?: PortfolioPositionsParams
  ): Promise<PortfolioPositionsResponse> {
    return this.request<PortfolioPositionsResponse>(
      "GET",
      "/portfolio/positions",
      { params, auth: true }
    );
  }

  // ==================== Portfolio - Settlements ====================

  async getPortfolioSettlements(
    params?: PortfolioSettlementsParams
  ): Promise<PortfolioSettlementsResponse> {
    return this.request<PortfolioSettlementsResponse>(
      "GET",
      "/portfolio/settlements",
      { params, auth: true }
    );
  }

  // ==================== Portfolio - Resting Value ====================

  async getPortfolioTotalRestingOrderValue(): Promise<RestingValue> {
    return this.request<RestingValue>("GET", "/portfolio/summary/total_resting_order_value", {
      auth: true,
    });
  }

  // ==================== Portfolio - Fills ====================

  async getPortfolioFills(
    params?: PortfolioFillsParams
  ): Promise<PortfolioFillsResponse> {
    return this.request<PortfolioFillsResponse>("GET", "/portfolio/fills", {
      params,
      auth: true,
    });
  }

  // ==================== Portfolio - Order Mutations ====================

  async batchCreatePortfolioOrders(
    data: BatchCreateOrdersData
  ): Promise<BatchCreateOrdersResponse> {
    return this.request<BatchCreateOrdersResponse>(
      "POST",
      "/portfolio/orders/batched",
      { data, auth: true }
    );
  }

  async batchCancelPortfolioOrders(
    data: BatchCancelOrdersData
  ): Promise<BatchCancelOrdersResponse> {
    return this.request<BatchCancelOrdersResponse>(
      "DELETE",
      "/portfolio/orders/batched",
      { data, auth: true }
    );
  }

  async createPortfolioOrder(data: CreateOrderData): Promise<CreateOrderResponse> {
    return this.request<CreateOrderResponse>("POST", "/portfolio/orders", {
      data,
      auth: true,
    });
  }

  async deletePortfolioOrder(orderId: string): Promise<DeleteOrderResponse> {
    return this.request<DeleteOrderResponse>(
      "DELETE",
      `/portfolio/orders/${orderId}`,
      { auth: true }
    );
  }

  async amendPortfolioOrder(
    orderId: string,
    data: AmendOrderData
  ): Promise<AmendOrderResponse> {
    return this.request<AmendOrderResponse>(
      "POST",
      `/portfolio/orders/${orderId}/amend`,
      { data, auth: true }
    );
  }

  async decreasePortfolioOrder(
    orderId: string,
    data: DecreaseOrderData
  ): Promise<DecreaseOrderResponse> {
    return this.request<DecreaseOrderResponse>(
      "POST",
      `/portfolio/orders/${orderId}/decrease`,
      { data, auth: true }
    );
  }

  // ==================== Subaccounts ====================

  async createSubaccount(): Promise<CreateSubaccountResponse> {
    return this.request<CreateSubaccountResponse>(
      "POST",
      "/portfolio/subaccounts",
      { auth: true }
    );
  }

  async transferBetweenSubaccounts(
    data: TransferBetweenSubaccountsData
  ): Promise<void> {
    await this.request<Record<string, never>>(
      "POST",
      "/portfolio/subaccounts/transfer",
      { data, auth: true }
    );
  }

  // ==================== Subaccount Netting ====================

  async getSubaccountNetting(): Promise<GetSubaccountNettingResponse> {
    return this.request<GetSubaccountNettingResponse>(
      "GET",
      "/portfolio/subaccounts/netting",
      { auth: true }
    );
  }

  async updateSubaccountNetting(
    data: UpdateSubaccountNettingRequest
  ): Promise<GetSubaccountNettingResponse> {
    return this.request<GetSubaccountNettingResponse>(
      "PUT",
      "/portfolio/subaccounts/netting",
      { data, auth: true }
    );
  }

  // ==================== API Keys ====================

  async getApiKeys(): Promise<GetApiKeysResponse> {
    return this.request<GetApiKeysResponse>("GET", "/api_keys", { auth: true });
  }

  async createApiKey(data: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
    return this.request<CreateApiKeyResponse>("POST", "/api_keys", {
      data,
      auth: true,
    });
  }

  async generateApiKey(
    data: GenerateApiKeyRequest
  ): Promise<GenerateApiKeyResponse> {
    return this.request<GenerateApiKeyResponse>("POST", "/api_keys/generate", {
      data,
      auth: true,
    });
  }

  async deleteApiKey(apiKey: string): Promise<void> {
    await this.request<Record<string, never>>("DELETE", `/api_keys/${apiKey}`, {
      auth: true,
    });
  }

  // ==================== Historical ====================

  async getHistoricalCutoff(): Promise<GetHistoricalCutoffResponse> {
    return this.request<GetHistoricalCutoffResponse>(
      "GET",
      "/historical/cutoff"
    );
  }

  async getHistoricalMarkets(
    params?: GetHistoricalMarketsParams
  ): Promise<MarketsListResponse> {
    return this.request<MarketsListResponse>("GET", "/historical/markets", {
      params,
    });
  }

  async getHistoricalMarket(ticker: string): Promise<MarketResponse> {
    return this.request<MarketResponse>(
      "GET",
      `/historical/markets/${ticker}`
    );
  }

  async getHistoricalMarketCandlesticks(
    ticker: string,
    params: GetHistoricalCandlesticksParams
  ): Promise<MarketCandlesticksResponse> {
    return this.request<MarketCandlesticksResponse>(
      "GET",
      `/historical/markets/${ticker}/candlesticks`,
      { params }
    );
  }

  async getHistoricalFills(
    params?: GetHistoricalFillsParams
  ): Promise<PortfolioFillsResponse> {
    return this.request<PortfolioFillsResponse>("GET", "/historical/fills", {
      params,
      auth: true,
    });
  }

  async getHistoricalOrders(
    params?: GetHistoricalOrdersParams
  ): Promise<PortfolioOrdersResponse> {
    return this.request<PortfolioOrdersResponse>("GET", "/historical/orders", {
      params,
      auth: true,
    });
  }

  // ==================== FCM ====================

  async getFCMOrders(
    params: GetFCMOrdersParams
  ): Promise<PortfolioOrdersResponse> {
    return this.request<PortfolioOrdersResponse>("GET", "/fcm/orders", {
      params,
      auth: true,
    });
  }

  async getFCMPositions(
    params: GetFCMPositionsParams
  ): Promise<PortfolioPositionsResponse> {
    return this.request<PortfolioPositionsResponse>("GET", "/fcm/positions", {
      params,
      auth: true,
    });
  }

  // ==================== Communications ====================

  async getCommunicationsID(): Promise<GetCommunicationsIDResponse> {
    return this.request<GetCommunicationsIDResponse>(
      "GET",
      "/communications/id",
      { auth: true }
    );
  }

  async getRFQs(params?: GetRFQsParams): Promise<GetRFQsResponse> {
    return this.request<GetRFQsResponse>("GET", "/communications/rfqs", {
      params,
      auth: true,
    });
  }

  async createRFQ(data: CreateRFQRequest): Promise<CreateRFQResponse> {
    return this.request<CreateRFQResponse>("POST", "/communications/rfqs", {
      data,
      auth: true,
    });
  }

  async getRFQ(rfqId: string): Promise<GetRFQResponse> {
    return this.request<GetRFQResponse>(
      "GET",
      `/communications/rfqs/${rfqId}`,
      { auth: true }
    );
  }

  async deleteRFQ(rfqId: string): Promise<void> {
    await this.request<Record<string, never>>(
      "DELETE",
      `/communications/rfqs/${rfqId}`,
      { auth: true }
    );
  }

  async getQuotes(params?: GetQuotesParams): Promise<GetQuotesResponse> {
    return this.request<GetQuotesResponse>("GET", "/communications/quotes", {
      params,
      auth: true,
    });
  }

  async createQuote(data: CreateQuoteRequest): Promise<CreateQuoteResponse> {
    return this.request<CreateQuoteResponse>(
      "POST",
      "/communications/quotes",
      { data, auth: true }
    );
  }

  async getQuote(quoteId: string): Promise<GetQuoteResponse> {
    return this.request<GetQuoteResponse>(
      "GET",
      `/communications/quotes/${quoteId}`,
      { auth: true }
    );
  }

  async deleteQuote(quoteId: string): Promise<void> {
    await this.request<Record<string, never>>(
      "DELETE",
      `/communications/quotes/${quoteId}`,
      { auth: true }
    );
  }

  async acceptQuote(
    quoteId: string,
    data: AcceptQuoteRequest
  ): Promise<void> {
    await this.request<Record<string, never>>(
      "PUT",
      `/communications/quotes/${quoteId}/accept`,
      { data, auth: true }
    );
  }

  async confirmQuote(quoteId: string): Promise<void> {
    await this.request<Record<string, never>>(
      "PUT",
      `/communications/quotes/${quoteId}/confirm`,
      { auth: true }
    );
  }
}
