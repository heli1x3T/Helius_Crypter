/**
 * pbkdf2.js
 * PBKDF2-SHA-256 key derivation with configurable iteration count.
 * Used to derive AES keys from passphrase + random salt.
 */

const HASH = 'SHA-256';
const KEY_BITS = 256;
const DEFAULT_ITERATIONS = 600_000;
const SALT_BYTES = 32;

/**
 * Derive a 256-bit AES-GCM key from a passphrase using PBKDF2-SHA-256.
 *
 * @param {string} passphrase
 * @param {Uint8Array} salt
 * @param {number} [iterations]
 * @returns {Promise<CryptoKey>}
 */
export async function deriveKey(passphrase, salt, iterations = DEFAULT_ITERATIONS) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      hash: HASH,
      salt,
      iterations,
    },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_BITS },
    false,
    ['encrypt', 'decrypt'],
  );
}

/**
 * Generate a cryptographically random salt.
 * @param {number} [bytes]
 * @returns {Uint8Array}
 */
export function generateSalt(bytes = SALT_BYTES) {
  return crypto.getRandomValues(new Uint8Array(bytes));
}

/**
 * Estimate approximate crack time for a PBKDF2-derived key.
 * (Educational reference only — based on GPU throughput estimates.)
 *
 * @param {number} iterations
 * @param {number} [gpuHashRatePerSec] - SHA-256 hashes/s per modern GPU
 * @returns {{ years: number, label: string }}
 */
export function estimateCrackTime(iterations, gpuHashRatePerSec = 10e9) {
  // Keyspace: 2^256 possible keys
  // Each guess costs `iterations` PBKDF2 rounds
  const hashesPerGuess = iterations;
  const guessesPerSec = gpuHashRatePerSec / hashesPerGuess;
  const keyspace = 2 ** 128; // conservative — half keyspace
  const seconds = keyspace / guessesPerSec;
  const years = seconds / (60 * 60 * 24 * 365.25);
  const label = years > 1e30
    ? 'Heat death of the universe'
    : `${years.toExponential(2)} years`;
  return { years, label };
}
