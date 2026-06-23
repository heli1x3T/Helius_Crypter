/**
 * aes-gcm.js
 * AES-256-GCM encryption/decryption primitives using Web Crypto API.
 * Authenticated encryption with associated data (AEAD).
 */

const ALGO = 'AES-GCM';
const KEY_BITS = 256;
const IV_BYTES = 12;   // 96-bit IV recommended for GCM
const TAG_BITS = 128;  // authentication tag length

/**
 * Derive a CryptoKey from raw key bytes.
 * @param {Uint8Array} rawKey - 32-byte raw key material
 * @returns {Promise<CryptoKey>}
 */
export async function importRawKey(rawKey) {
  return crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: ALGO },
    false,
    ['encrypt', 'decrypt'],
  );
}

/**
 * Encrypt plaintext bytes with AES-256-GCM.
 * @param {Uint8Array} plaintext
 * @param {CryptoKey} key
 * @param {Uint8Array} [aad] - optional additional authenticated data
 * @returns {Promise<{ ciphertext: Uint8Array, iv: Uint8Array }>}
 */
export async function encryptAesGcm(plaintext, key, aad) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const params = { name: ALGO, iv, tagLength: TAG_BITS };
  if (aad) params.additionalData = aad;

  const buf = await crypto.subtle.encrypt(params, key, plaintext);
  return { ciphertext: new Uint8Array(buf), iv };
}

/**
 * Decrypt ciphertext bytes with AES-256-GCM.
 * @param {Uint8Array} ciphertext
 * @param {CryptoKey} key
 * @param {Uint8Array} iv
 * @param {Uint8Array} [aad]
 * @returns {Promise<Uint8Array>}
 */
export async function decryptAesGcm(ciphertext, key, iv, aad) {
  const params = { name: ALGO, iv, tagLength: TAG_BITS };
  if (aad) params.additionalData = aad;

  const buf = await crypto.subtle.decrypt(params, key, ciphertext);
  return new Uint8Array(buf);
}

/**
 * Generate a random 256-bit AES key.
 * @returns {Promise<CryptoKey>}
 */
export async function generateAesKey() {
  return crypto.subtle.generateKey(
    { name: ALGO, length: KEY_BITS },
    true,
    ['encrypt', 'decrypt'],
  );
}

/**
 * Export CryptoKey to raw bytes.
 * @param {CryptoKey} key
 * @returns {Promise<Uint8Array>}
 */
export async function exportRawKey(key) {
  const buf = await crypto.subtle.exportKey('raw', key);
  return new Uint8Array(buf);
}
