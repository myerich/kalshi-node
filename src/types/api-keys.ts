// ==================== API Key Types ====================

export interface ApiKey {
  key_id: string;
  name: string;
  created_at: string;
  last_used_at?: string;
  public_key?: string;
}

export interface GetApiKeysResponse {
  api_keys: ApiKey[];
}

export interface CreateApiKeyRequest {
  name: string;
  public_key: string;
}

export interface CreateApiKeyResponse {
  api_key: ApiKey;
}

export interface GenerateApiKeyRequest {
  name: string;
}

export interface GenerateApiKeyResponse {
  api_key: ApiKey;
  private_key: string;
}
