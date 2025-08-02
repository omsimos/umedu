import * as crypto from "crypto";
const { subtle } = globalThis.crypto;

function toUint8Array(base64Text: string): Uint8Array {
  return new Uint8Array(Buffer.from(base64Text, "base64"));
}

function toBase64(uint8Array: Uint8Array): string {
  return Buffer.from(uint8Array).toString("base64");
}

function getAesKeyFromEnv(): string {
  const key = process.env.AES_256_GCM_KEY;
  if (!key) throw new Error("AES_256_GCM_KEY environment variable not set");
  return key;
}

async function importAesKey(base64Key: string): Promise<CryptoKey> {
  const rawKey = toUint8Array(base64Key);

  if (rawKey.length !== 32) {
    throw new Error("AES-GCM key must be 256 bits (32 bytes)");
  }

  return await subtle.importKey("raw", rawKey, { name: "AES-GCM" }, true, [
    "encrypt",
    "decrypt",
  ]);
}

function splitPayload(payload: string): {
  cipherText: Uint8Array;
  iv: Uint8Array;
} {
  const [cipherTextBase64, ivBase64] = payload.split(".");
  if (!cipherTextBase64 || !ivBase64)
    throw new Error("Invalid encrypted payload format");
  return {
    cipherText: toUint8Array(cipherTextBase64),
    iv: toUint8Array(ivBase64),
  };
}

export async function aesEncrypt(plainText: string): Promise<string> {
  try {
    const rawKey = getAesKeyFromEnv();
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await importAesKey(rawKey);

    const cipherText = await subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      enc.encode(plainText),
    );

    return `${toBase64(new Uint8Array(cipherText))}.${toBase64(iv)}`;
  } catch (err) {
    console.error("Error during AES encryption:", err);
    throw err;
  }
}

export async function aesDecrypt(payload: string): Promise<string> {
  try {
    const rawKey = getAesKeyFromEnv();
    const { cipherText, iv } = splitPayload(payload);
    const key = await importAesKey(rawKey);

    const plainText = await subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      cipherText,
    );

    return new TextDecoder().decode(plainText);
  } catch (err) {
    console.error("Error during AES decryption:", err);
    throw err;
  }
}
