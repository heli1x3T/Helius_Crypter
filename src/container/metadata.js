/**
 * metadata.js
 * Container metadata encoding/decoding.
 * Stores original filename, MIME type, timestamps and build info
 * as a JSON blob prepended to the plaintext payload before encryption.
 */

const METADATA_MAGIC = 0xDEADB4BE;
const METADATA_VERSION = 1;

/**
 * @typedef {Object} PayloadMetadata
 * @property {number}  magic       - Magic constant for validation
 * @property {number}  version     - Metadata schema version
 * @property {string}  originalName - Original filename
 * @property {string}  mime        - MIME type
 * @property {string}  sha256      - Hex SHA-256 of original plaintext
 * @property {number}  size        - Original size in bytes
 * @property {string}  algorithm   - Encryption algorithm used
 * @property {boolean} xor         - Whether XOR layer was applied
 * @property {number}  iterations  - PBKDF2 iteration count
 * @property {number}  builtAt     - Unix timestamp (ms) of build
 * @property {string}  buildId     - Unique build identifier
 */

/**
 * Encode metadata + plaintext into a combined buffer.
 * Layout: [4-byte metadata length LE][metadata JSON][plaintext bytes]
 *
 * @param {Uint8Array} plaintext
 * @param {Omit<PayloadMetadata, 'magic' | 'version'>} meta
 * @returns {Uint8Array}
 */
export function encodeWithMetadata(plaintext, meta) {
  const full = {
    magic: METADATA_MAGIC,
    version: METADATA_VERSION,
    builtAt: Date.now(),
    buildId: generateBuildId(),
    ...meta,
  };

  const enc = new TextEncoder();
  const metaBytes = enc.encode(JSON.stringify(full));
  const lenBuf = new Uint8Array(4);
  new DataView(lenBuf.buffer).setUint32(0, metaBytes.length, true);

  const combined = new Uint8Array(4 + metaBytes.length + plaintext.length);
  combined.set(lenBuf, 0);
  combined.set(metaBytes, 4);
  combined.set(plaintext, 4 + metaBytes.length);

  return combined;
}

/**
 * Decode metadata + plaintext from a combined buffer.
 *
 * @param {Uint8Array} combined
 * @returns {{ metadata: PayloadMetadata, plaintext: Uint8Array }}
 */
export function decodeWithMetadata(combined) {
  const metaLen = new DataView(combined.buffer, combined.byteOffset).getUint32(0, true);
  const metaBytes = combined.slice(4, 4 + metaLen);
  const plaintext = combined.slice(4 + metaLen);

  const dec = new TextDecoder();
  const metadata = JSON.parse(dec.decode(metaBytes));

  if (metadata.magic !== METADATA_MAGIC) {
    throw new Error('Container metadata magic mismatch — container may be corrupt.');
  }

  return { metadata, plaintext };
}

/**
 * Generate a unique build ID (16 hex chars).
 * @returns {string}
 */
function generateBuildId() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}
