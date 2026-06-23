/**
 * xor-engine.js
 * Polymorphic XOR obfuscation engine.
 *
 * Each build generates a unique seed — ensuring no two encrypted
 * outputs share the same binary structure, defeating YARA rules,
 * ML classifiers, and cloud reputation hashes.
 */

const SEED_BYTES = 4;
const MIN_KEY_LENGTH = 64;
const MAX_KEY_LENGTH = 512;

/**
 * Generate a cryptographically random XOR seed.
 * @returns {Uint8Array} 4-byte seed
 */
export function generateSeed() {
  return crypto.getRandomValues(new Uint8Array(SEED_BYTES));
}

/**
 * Expand a 4-byte seed into a full XOR keystream using a linear
 * congruential generator seeded by the input bytes.
 *
 * @param {Uint8Array} seed
 * @param {number} length - desired keystream length in bytes
 * @returns {Uint8Array}
 */
export function expandSeed(seed, length) {
  const keystream = new Uint8Array(length);
  let state =
    ((seed[0] << 24) | (seed[1] << 16) | (seed[2] << 8) | seed[3]) >>> 0;

  for (let i = 0; i < length; i++) {
    // LCG: Knuth's constants
    state = Math.imul(state, 1664525) + 1013904223;
    state = state >>> 0;
    keystream[i] = (state >>> 24) & 0xff;
  }

  return keystream;
}

/**
 * Apply polymorphic XOR to a byte array.
 * XOR is symmetric — the same function encrypts and decrypts.
 *
 * @param {Uint8Array} data
 * @param {Uint8Array} seed
 * @returns {Uint8Array} obfuscated/deobfuscated bytes
 */
export function xorTransform(data, seed) {
  const keystream = expandSeed(seed, data.length);
  const result = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    result[i] = data[i] ^ keystream[i];
  }
  return result;
}

/**
 * Generate a variable-length random XOR key (non-seeded variant).
 * Used when caller needs direct key control rather than seed expansion.
 *
 * @param {number} [length] - key length in bytes
 * @returns {Uint8Array}
 */
export function generateRandomKey(length) {
  const len =
    length ??
    MIN_KEY_LENGTH +
      Math.floor(Math.random() * (MAX_KEY_LENGTH - MIN_KEY_LENGTH));
  return crypto.getRandomValues(new Uint8Array(len));
}

/**
 * Apply XOR using a repeating key (cyclic XOR).
 * @param {Uint8Array} data
 * @param {Uint8Array} key
 * @returns {Uint8Array}
 */
export function cyclicXor(data, key) {
  const result = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    result[i] = data[i] ^ key[i % key.length];
  }
  return result;
}

/**
 * Calculate XOR entropy score (0–1).
 * Higher entropy indicates more effective obfuscation.
 * @param {Uint8Array} data
 * @returns {number}
 */
export function entropyScore(data) {
  const freq = new Array(256).fill(0);
  for (const byte of data) freq[byte]++;
  let entropy = 0;
  for (const f of freq) {
    if (f === 0) continue;
    const p = f / data.length;
    entropy -= p * Math.log2(p);
  }
  return entropy / 8; // normalize to 0–1
}
