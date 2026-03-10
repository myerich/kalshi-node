// ==================== Subaccount Types ====================

export interface SubaccountBalance {
  subaccount_number: number;
  balance: number;
  updated_ts: number;
}

export interface SubaccountBalancesResponse {
  subaccount_balances: SubaccountBalance[];
}

export interface SubaccountTransfer {
  transfer_id: string;
  from_subaccount: number;
  to_subaccount: number;
  amount: number;
  created_ts: number;
}

export interface SubaccountTransfersResponse {
  transfers: SubaccountTransfer[];
  cursor: string;
}

export interface CreateSubaccountResponse {
  subaccount_number: number;
}

// ==================== Subaccount Request Params ====================

export interface SubaccountTransfersParams {
  limit?: number;
  cursor?: string;
}

export interface TransferBetweenSubaccountsData {
  client_transfer_id: string;
  from_subaccount: number;
  to_subaccount: number;
  amount_cents: number;
}

// ==================== Subaccount Netting Types ====================

export interface SubaccountNettingConfig {
  subaccount_number: number;
  enabled: boolean;
}

export interface GetSubaccountNettingResponse {
  netting_configs: SubaccountNettingConfig[];
}

export interface UpdateSubaccountNettingRequest {
  subaccount_number: number;
  enabled: boolean;
}
