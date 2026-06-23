/**
 * index.js — crypto module barrel export
 * Re-exports all cryptographic primitives for ergonomic imports.
 *
 * @example
 * import { sha256Hex, deriveKey, xorTransform } from './crypto/index.js';
 */

export { encryptAesGcm, decryptAesGcm, generateAesKey, importRawKey, exportRawKey } from './aes-gcm.js';
export { deriveKey, generateSalt, estimateCrackTime } from './pbkdf2.js';
export { generateSeed, expandSeed, xorTransform, cyclicXor, entropyScore, generateRandomKey } from './xor-engine.js';
export { sha256, sha512, sha256Hex, verifyIntegrity, hmacSha256, bytesToHex, hexToBytes } from './sha256.js';
