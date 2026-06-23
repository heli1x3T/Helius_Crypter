/**
 * container.js
 * HCR (Hermes Crypter Runtime) container format.
 *
 * Binary format specification:
 *
 *  [0..3]   Magic bytes: 0x48 0x43 0x52 0x01  ("HCR\x01")
 *  [4]      Format version: 0x02
 *  [5]      Flags: bit0=xor, bit1=hmac, bit2=compressed
 *  [6..7]   Reserved (0x00 0x00)
 *  [8..39]  PBKDF2 salt (32 bytes)
 *  [40..51] AES-GCM IV (12 bytes)
 *  [52..55] XOR seed (4 bytes, 0x00 if xor disabled)
 *  [56..87] SHA-256 payload checksum (32 bytes)
 *  [88..91] Original payload length (uint32 LE)
 *  [92..N]  Encrypted payload ciphertext (AES-GCM + tag)
 */

export const MAGIC = new Uint8Array([0x48, 0x43, 0x52, 0x01]);
export const FORMAT_VERSION = 0x02;

export const OFFSETS = Object.freeze({
  MAGIC:      0,
  VERSION:    4,
  FLAGS:      5,
  RESERVED:   6,
  SALT:       8,
  IV:         40,
  XOR_SEED:   52,
  CHECKSUM:   56,
  ORIG_LEN:   88,
  PAYLOAD:    92,
});

export const FLAGS = Object.freeze({
  XOR:        0b00000001,
  HMAC:       0b00000010,
  COMPRESSED: 0b00000100,
});

/**
 * Serialize a Hermes container from encrypted components.
 *
 * @param {{
 *   ciphertext: Uint8Array,
 *   iv:         Uint8Array,
 *   salt:       Uint8Array,
 *   xorSeed:    Uint8Array | null,
 *   checksum:   Uint8Array,
 *   origLen:    number,
 *   useXor:     boolean,
 * }} parts
 * @returns {Uint8Array}
 */
export function serializeContainer(parts) {
  const { ciphertext, iv, salt, xorSeed, checksum, origLen, useXor } = parts;

  const totalSize = OFFSETS.PAYLOAD + ciphertext.byteLength;
  const buf = new Uint8Array(totalSize);

  let flags = 0;
  if (useXor) flags |= FLAGS.XOR;

  buf.set(MAGIC,                       OFFSETS.MAGIC);
  buf[OFFSETS.VERSION]  = FORMAT_VERSION;
  buf[OFFSETS.FLAGS]    = flags;
  buf.set(salt,                        OFFSETS.SALT);
  buf.set(iv,                          OFFSETS.IV);
  buf.set(xorSeed ?? new Uint8Array(4),OFFSETS.XOR_SEED);
  buf.set(checksum,                    OFFSETS.CHECKSUM);

  // origLen as uint32 little-endian
  new DataView(buf.buffer).setUint32(OFFSETS.ORIG_LEN, origLen, true);

  buf.set(ciphertext, OFFSETS.PAYLOAD);
  return buf;
}

/**
 * Parse and validate a Hermes container header.
 *
 * @param {Uint8Array} buf
 * @returns {{
 *   version:    number,
 *   flags:      number,
 *   salt:       Uint8Array,
 *   iv:         Uint8Array,
 *   xorSeed:    Uint8Array,
 *   checksum:   Uint8Array,
 *   origLen:    number,
 *   ciphertext: Uint8Array,
 *   useXor:     boolean,
 * }}
 */
export function parseContainer(buf) {
  // Validate magic
  for (let i = 0; i < MAGIC.length; i++) {
    if (buf[i] !== MAGIC[i]) {
      throw new Error('Invalid HCR container: magic mismatch.');
    }
  }

  const version = buf[OFFSETS.VERSION];
  if (version !== FORMAT_VERSION) {
    throw new Error(`Unsupported container version: 0x${version.toString(16)}`);
  }

  const flags    = buf[OFFSETS.FLAGS];
  const salt     = buf.slice(OFFSETS.SALT,     OFFSETS.IV);
  const iv       = buf.slice(OFFSETS.IV,       OFFSETS.XOR_SEED);
  const xorSeed  = buf.slice(OFFSETS.XOR_SEED, OFFSETS.CHECKSUM);
  const checksum = buf.slice(OFFSETS.CHECKSUM, OFFSETS.ORIG_LEN);
  const origLen  = new DataView(buf.buffer, buf.byteOffset).getUint32(OFFSETS.ORIG_LEN, true);
  const ciphertext = buf.slice(OFFSETS.PAYLOAD);

  return {
    version,
    flags,
    salt,
    iv,
    xorSeed,
    checksum,
    origLen,
    ciphertext,
    useXor: Boolean(flags & FLAGS.XOR),
  };
}
