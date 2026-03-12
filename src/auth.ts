import * as crypto from "crypto";
import * as fs from "fs";
import type { WebSocketAuthHeaders } from "./types/websocket.js";

export interface AuthConfig {
  apiKey: string;
  privateKeyPath: string;
}

export function loadPrivateKey(path: string): string {
  const pem = fs.readFileSync(path, "utf-8");
  return normalizePemFormat(pem);
}

export function loadPrivateKeyFromContent(pem: string): string {
  return normalizePemFormat(pem);
}

/**
 * Normalizes PEM format to ensure proper line breaks for crypto operations.
 * Handles escaped newlines, single-line format, and already-formatted PEM.
 */
function normalizePemFormat(pem: string): string {
  // Handle escaped newlines: \n → actual newlines
  let normalizedPem = pem.replace(/\\n/g, "\n");

  // If the key doesn't have proper line breaks, reconstruct them
  if (!normalizedPem.includes("\n")) {
    normalizedPem = reconstructPemFormat(normalizedPem);
  }

  // Validate that it looks like a valid PEM key
  if (!normalizedPem.includes("-----BEGIN") || !normalizedPem.includes("-----END")) {
    throw new Error(
      `Invalid PEM format: missing BEGIN or END markers. ` +
      `Key preview: ${pem.substring(0, 100)}...`
    );
  }

  return normalizedPem;
}

/**
 * Reconstructs a single-line PEM key into proper multi-line format.
 * Example input: -----BEGIN RSA PRIVATE KEY-----MIIEpQ...XYZ-----END RSA PRIVATE KEY-----
 * Example output:
 * -----BEGIN RSA PRIVATE KEY-----
 * MIIEpQ...
 * XYZ
 * -----END RSA PRIVATE KEY-----
 */
function reconstructPemFormat(singleLine: string): string {
  // Match PEM header and footer
  const beginMatch = singleLine.match(/-----BEGIN [A-Z ]+-----/);
  const endMatch = singleLine.match(/-----END [A-Z ]+-----/);

  if (!beginMatch || !endMatch) {
    throw new Error("Invalid PEM format: missing BEGIN or END markers");
  }

  const header = beginMatch[0];
  const footer = endMatch[0];
  const headerEnd = beginMatch.index! + header.length;
  const footerStart = endMatch.index!;

  // Extract the base64 content between header and footer
  const base64Content = singleLine.substring(headerEnd, footerStart);

  // Split base64 content into 64-character lines (standard PEM format)
  const lines = [header];
  for (let i = 0; i < base64Content.length; i += 64) {
    lines.push(base64Content.substring(i, i + 64));
  }
  lines.push(footer);

  return lines.join("\n");
}

export function generateHeaders(
  apiKey: string,
  privateKeyPem: string,
  method: string,
  path: string
): WebSocketAuthHeaders {
  const timestamp = Date.now().toString();
  const uppercaseMethod = method.toUpperCase();
  const msgString = `${timestamp}${uppercaseMethod}${path}`;

  // Use createSign/sign pattern (matches official Kalshi TypeScript SDK)
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(msgString);
  sign.end();
  const signature = sign.sign({
    key: privateKeyPem,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
  });
  const base64Signature = signature.toString("base64");

  return {
    "KALSHI-ACCESS-KEY": apiKey,
    "KALSHI-ACCESS-TIMESTAMP": timestamp,
    "KALSHI-ACCESS-SIGNATURE": base64Signature,
  };
}
