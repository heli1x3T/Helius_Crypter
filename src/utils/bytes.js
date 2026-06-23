/**
 * bytes.js — byte-level utilities
 */

/** Concatenate multiple Uint8Arrays into one. */
export function concatBytes(...arrays) {
  const total = arrays.reduce((n, a) => n + a.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const arr of arrays) {
    out.set(arr, offset);
    offset += arr.length;
  }
  return out;
}

/** Convert a number to a 4-byte little-endian Uint8Array. */
export function uint32LE(n) {
  const buf = new Uint8Array(4);
  new DataView(buf.buffer).setUint32(0, n >>> 0, true);
  return buf;
}

/** Read a 4-byte little-endian uint32 from a buffer at offset. */
export function readUint32LE(buf, offset = 0) {
  return new DataView(buf.buffer, buf.byteOffset + offset).getUint32(0, true);
}

/** Encode string to UTF-8 bytes. */
export function encode(str) {
  return new TextEncoder().encode(str);
}

/** Decode UTF-8 bytes to string. */
export function decode(bytes) {
  return new TextDecoder().decode(bytes);
}

/** Constant-time comparison of two Uint8Arrays. */
export function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** Format bytes into human-readable string (B / KB / MB / GB). */
export function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  return `${(n / 1024 ** 3).toFixed(2)} GB`;
}

/** Compute byte frequency histogram (256 bins). */
export function byteHistogram(data) {
  const hist = new Uint32Array(256);
  for (const b of data) hist[b]++;
  return hist;
}

/** Shannon entropy in bits per byte (0–8). */
export function shannonEntropy(data) {
  const hist = byteHistogram(data);
  let e = 0;
  for (const f of hist) {
    if (f === 0) continue;
    const p = f / data.length;
    e -= p * Math.log2(p);
  }
  return e;
}
