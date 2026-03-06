import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { loadPrivateKey, generateHeaders } from "./auth";

describe("loadPrivateKey", () => {
  let tmpDir: string;
  let keyPath: string;
  let testKeyPem: string;

  beforeAll(() => {
    // Generate a throwaway RSA key pair for testing
    const { privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });
    testKeyPem = privateKey
      .export({ type: "pkcs8", format: "pem" })
      .toString();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "kalshi-test-"));
    keyPath = path.join(tmpDir, "test-key.pem");
    fs.writeFileSync(keyPath, testKeyPem);
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("loads a PEM file and returns a string", () => {
    const key = loadPrivateKey(keyPath);
    expect(typeof key).toBe("string");
    expect(key).toContain("-----BEGIN");
    expect(key).toContain("-----END");
  });

  it("throws on non-existent file", () => {
    expect(() => loadPrivateKey("/tmp/does-not-exist.pem")).toThrow();
  });

  it("throws on invalid PEM content", () => {
    const badPath = path.join(tmpDir, "bad-key.pem");
    fs.writeFileSync(badPath, "not a real pem file");
    expect(() => loadPrivateKey(badPath)).toThrow();
  });
});

describe("generateHeaders", () => {
  let privateKeyPem: string;
  let publicKey: crypto.KeyObject;

  beforeAll(() => {
    const pair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });
    privateKeyPem = pair.privateKey
      .export({ type: "pkcs8", format: "pem" })
      .toString();
    publicKey = pair.publicKey;
  });

  it("returns the three required Kalshi headers", () => {
    const headers = generateHeaders(
      "test-api-key",
      privateKeyPem,
      "GET",
      "/trade-api/v2/exchange/status"
    );

    expect(headers).toHaveProperty("KALSHI-ACCESS-KEY", "test-api-key");
    expect(headers).toHaveProperty("KALSHI-ACCESS-TIMESTAMP");
    expect(headers).toHaveProperty("KALSHI-ACCESS-SIGNATURE");
  });

  it("timestamp is a recent millisecond epoch string", () => {
    const before = Date.now();
    const headers = generateHeaders(
      "key",
      privateKeyPem,
      "GET",
      "/trade-api/v2/test"
    );
    const after = Date.now();

    const ts = parseInt(headers["KALSHI-ACCESS-TIMESTAMP"], 10);
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });

  it("signature is valid base64", () => {
    const headers = generateHeaders(
      "key",
      privateKeyPem,
      "POST",
      "/trade-api/v2/portfolio/orders"
    );

    const sig = headers["KALSHI-ACCESS-SIGNATURE"];
    const decoded = Buffer.from(sig, "base64");
    // Re-encode should match original (proves it's valid base64)
    expect(decoded.toString("base64")).toBe(sig);
    // RSA-2048 PSS signature should be 256 bytes
    expect(decoded.length).toBe(256);
  });

  it("signature verifies against the public key", () => {
    const headers = generateHeaders(
      "key",
      privateKeyPem,
      "GET",
      "/trade-api/v2/exchange/status"
    );

    const timestamp = headers["KALSHI-ACCESS-TIMESTAMP"];
    const message = Buffer.from(
      `${timestamp}GET/trade-api/v2/exchange/status`,
      "utf-8"
    );
    const signature = Buffer.from(
      headers["KALSHI-ACCESS-SIGNATURE"],
      "base64"
    );

    const valid = crypto.verify(
      "sha256",
      message,
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
      },
      signature
    );

    expect(valid).toBe(true);
  });

  it("different methods produce different signatures", () => {
    const h1 = generateHeaders(
      "key",
      privateKeyPem,
      "GET",
      "/trade-api/v2/test"
    );
    const h2 = generateHeaders(
      "key",
      privateKeyPem,
      "POST",
      "/trade-api/v2/test"
    );
    expect(h1["KALSHI-ACCESS-SIGNATURE"]).not.toBe(
      h2["KALSHI-ACCESS-SIGNATURE"]
    );
  });

  it("different paths produce different signatures", () => {
    const h1 = generateHeaders(
      "key",
      privateKeyPem,
      "GET",
      "/trade-api/v2/exchange/status"
    );
    const h2 = generateHeaders(
      "key",
      privateKeyPem,
      "GET",
      "/trade-api/v2/portfolio/orders"
    );
    expect(h1["KALSHI-ACCESS-SIGNATURE"]).not.toBe(
      h2["KALSHI-ACCESS-SIGNATURE"]
    );
  });
});
