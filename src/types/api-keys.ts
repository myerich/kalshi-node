// ==================== API Key Types ====================

export interface ApiKey {
  api_key_id: string;
  name: string;
  scopes: string[];
}

export interface GetApiKeysResponse {
  api_keys: ApiKey[];
}

export interface CreateApiKeyRequest {
  name: string;
  public_key: string;
  scopes?: string[];
}

export interface CreateApiKeyResponse {
  api_key_id: string;
}

export interface GenerateApiKeyRequest {
  name: string;
  scopes?: string[];
}

export interface GenerateApiKeyResponse {
  api_key_id: string;
  private_key: string;
}
