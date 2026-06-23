/**
 * sandbox-detect.js
 * Sandbox and analysis environment detection.
 *
 * Combines multiple heuristics to identify automated analysis
 * pipelines, sandbox detonation environments, and emulators.
 */

/**
 * Check for abnormal timing — sandboxes often accelerate or slow time.
 * @returns {Promise<boolean>}
 */
export async function detectTimingAnomaly() {
  const iterations = 100_000;
  const start = performance.now();

  // Busy loop — predictable on real hardware
  let acc = 0;
  for (let i = 0; i < iterations; i++) acc += Math.sqrt(i);

  const elapsed = performance.now() - start;
  void acc;

  // Real hardware: ~10–40ms. Sandboxes: <5ms (accelerated) or >200ms (throttled)
  return elapsed < 5 || elapsed > 200;
}

/**
 * Detect missing browser APIs that real users always have.
 * @returns {boolean}
 */
export function detectMissingApis() {
  const required = [
    'WebSocket',
    'RTCPeerConnection',
    'AudioContext',
    'OffscreenCanvas',
    'SharedArrayBuffer',
  ];
  return required.some((api) => !(api in window));
}

/**
 * Detect screen resolution anomalies common in sandboxes.
 * @returns {boolean}
 */
export function detectScreenAnomaly() {
  const { width, height, colorDepth } = screen;
  return (
    width < 1024 ||
    height < 768 ||
    colorDepth < 24 ||
    (width === 800 && height === 600) || // classic sandbox res
    (width === 1024 && height === 768)   // common VM default
  );
}

/**
 * Detect emulated touch events on desktop.
 * @returns {boolean}
 */
export function detectTouchEmulation() {
  return navigator.maxTouchPoints > 0 && !/Mobile|Android/.test(navigator.userAgent);
}

/**
 * Detect canvas fingerprinting inconsistencies.
 * Sandboxes often return zeroed or randomized canvas data.
 * @returns {boolean}
 */
export function detectCanvasAnomaly() {
  try {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    if (!ctx) return true;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 2, 2);
    const pixel = ctx.getImageData(0, 0, 1, 1).data;

    // A working canvas should return approximately [10, 10, 10, 255]
    return pixel[3] === 0 || (pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0);
  } catch {
    return true;
  }
}

/**
 * Aggregate sandbox detection score (0 = safe, higher = suspicious).
 * @returns {Promise<{ score: number, indicators: string[] }>}
 */
export async function sandboxScore() {
  const indicators = [];

  if (detectMissingApis())      indicators.push('MISSING_BROWSER_APIS');
  if (detectScreenAnomaly())    indicators.push('SCREEN_ANOMALY');
  if (detectCanvasAnomaly())    indicators.push('CANVAS_ANOMALY');
  if (await detectTimingAnomaly()) indicators.push('TIMING_ANOMALY');

  return { score: indicators.length, indicators };
}
