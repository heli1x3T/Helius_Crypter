/**
 * sha256.js
 * SHA-256 / SHA-512 hashing helpers via Web Crypto API.
 * Used for integrity verification and container checksums.
 */

/**
 * Compute SHA-256 digest of arbitrary data.
 * @param {Uint8Array | ArrayBuffer | string} data
 * @returns {Promise<Uint8Array>}
 */
export async function sha256(data) {
  const buf = toBuffer(data);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return new Uint8Array(digest);
}

/**
 * Compute SHA-512 digest.
 * @param {Uint8Array | ArrayBuffer | string} data
 * @returns {Promise<Uint8Array>}
 */
export async function sha512(data) {
  const buf = toBuffer(data);
  const digest = await crypto.subtle.digest('SHA-512', buf);
  return new Uint8Array(digest);
}

/**
 * Compute SHA-256 and return lowercase hex string.
 * @param {Uint8Array | ArrayBuffer | string} data
 * @returns {Promise<string>}
 */
export async function sha256Hex(data) {
  const bytes = await sha256(data);
  return bytesToHex(bytes);
}

/**
 * Verify data integrity by comparing SHA-256 against an expected hex string.
 * Uses constant-time comparison to prevent timing attacks.
 *
 * @param {Uint8Array} data
 * @param {string} expectedHex
 * @returns {Promise<boolean>}
 */
export async function verifyIntegrity(data, expectedHex) {
  const actualBytes = await sha256(data);
  const actualHex = bytesToHex(actualBytes);

  if (actualHex.length !== expectedHex.length) return false;

  // Constant-time string comparison
  let diff = 0;
  for (let i = 0; i < actualHex.length; i++) {
    diff |= actualHex.charCodeAt(i) ^ expectedHex.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * HMAC-SHA-256 message authentication code.
 * @param {Uint8Array} keyBytes
 * @param {Uint8Array} message
 * @returns {Promise<Uint8Array>}
 */
export async function hmacSha256(keyBytes, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, message);
  return new Uint8Array(sig);
}

// ── Internal helpers ──────────────────────────────────────────

function toBuffer(data) {
  if (typeof data === 'string') {
    return new TextEncoder().encode(data);
  }
  return data instanceof ArrayBuffer ? data : data.buffer;
}

export function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToBytes(hex) {
  const result = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    result[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return result;
}
