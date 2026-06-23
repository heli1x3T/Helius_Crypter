/**
 * memory-guard.js
 * In-memory payload protection utilities.
 *
 * Prevents payload bytes from persisting in browser memory
 * longer than necessary. Implements secure zeroing and
 * memory-resident execution patterns.
 */

/**
 * Securely zero out a typed array after use.
 * Prevents sensitive bytes from lingering in GC memory.
 * @param {Uint8Array} arr
 */
export function secureZero(arr) {
  if (!arr || !arr.fill) return;
  arr.fill(0);
}

/**
 * Securely zero multiple arrays at once.
 * @param {...Uint8Array} arrays
 */
export function secureZeroAll(...arrays) {
  for (const arr of arrays) secureZero(arr);
}

/**
 * Allocate a locked memory buffer (simulated in browser context).
 * In a native context, this would use VirtualLock/mlock.
 * @param {number} size - bytes to allocate
 * @returns {Uint8Array}
 */
export function allocateSecureBuffer(size) {
  // Browser cannot directly lock pages; allocate and register for cleanup
  const buf = new Uint8Array(size);
  registerForCleanup(buf);
  return buf;
}

// ── Cleanup registry ──────────────────────────────────────────
const _registry = new FinalizationRegistry((buf) => {
  secureZero(buf);
});

function registerForCleanup(buf) {
  _registry.register(buf, buf);
}

/**
 * Copy bytes into a new secure buffer and zero the source.
 * @param {Uint8Array} source
 * @returns {Uint8Array}
 */
export function secureClone(source) {
  const clone = new Uint8Array(source.length);
  clone.set(source);
  secureZero(source);
  return clone;
}

/**
 * Estimate browser memory usage (diagnostic only).
 * @returns {{ used: number, total: number, usedMB: string } | null}
 */
export function getMemoryUsage() {
  const mem = performance?.memory;
  if (!mem) return null;
  return {
    used: mem.usedJSHeapSize,
    total: mem.jsHeapSizeLimit,
    usedMB: (mem.usedJSHeapSize / 1024 / 1024).toFixed(1) + ' MB',
  };
}

/**
 * Simulate memory-resident execution guard.
 * Checks available heap before loading large payloads.
 * @param {number} requiredBytes
 * @returns {boolean}
 */
export function hasEnoughMemory(requiredBytes) {
  const usage = getMemoryUsage();
  if (!usage) return true; // assume OK if API unavailable
  const available = usage.total - usage.used;
  return available > requiredBytes * 2; // 2x safety margin
}
