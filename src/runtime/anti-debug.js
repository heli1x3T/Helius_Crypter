/**
 * anti-debug.js
 * Runtime protection: anti-debugging, anti-VM, anti-sandbox detection.
 *
 * These checks are evaluated at runtime to detect controlled
 * analysis environments and halt payload execution.
 */

/**
 * Detect browser developer tools via timing side-channel.
 * DevTools significantly slow down console.log calls.
 * @returns {boolean}
 */
export function isDevToolsOpen() {
  const threshold = 160; // ms
  const start = performance.now();
  // eslint-disable-next-line no-console
  console.profile();
  // eslint-disable-next-line no-console
  console.profileEnd();
  return performance.now() - start > threshold;
}

/**
 * Detect debugger via `debugger` statement timing.
 * A paused debugger adds measurable latency.
 * @returns {boolean}
 */
export function isDebuggerAttached() {
  const start = performance.now();
  // eslint-disable-next-line no-debugger
  debugger;
  return performance.now() - start > 100;
}

/**
 * Detect headless browser / automation environment.
 * Checks for common automation fingerprints.
 * @returns {boolean}
 */
export function isHeadless() {
  const nav = navigator;
  return (
    nav.webdriver === true ||
    /HeadlessChrome/.test(navigator.userAgent) ||
    /Electron/.test(navigator.userAgent) ||
    nav.plugins.length === 0 ||
    !nav.languages || nav.languages.length === 0
  );
}

/**
 * Detect virtual machine via hardware concurrency heuristics.
 * Most analysis VMs expose fewer CPU cores.
 * @returns {boolean}
 */
export function isVirtualMachine() {
  return navigator.hardwareConcurrency <= 2;
}

/**
 * Detect sandbox via memory size heuristics.
 * Sandboxes typically expose minimal device memory.
 * @returns {boolean}
 */
export function isSandbox() {
  const mem = navigator.deviceMemory;
  if (mem !== undefined && mem < 2) return true;

  // Check for abnormally small screen (sandbox/emulator)
  if (screen.width < 800 || screen.height < 600) return true;

  return false;
}

/**
 * Detect browser extension / proxy interference.
 * Extensions can manipulate timing and APIs.
 * @returns {boolean}
 */
export function isIntercepted() {
  try {
    const nativeXHR = window.XMLHttpRequest.toString();
    if (!/\[native code\]/.test(nativeXHR)) return true;
    const nativeFetch = window.fetch.toString();
    if (!/\[native code\]/.test(nativeFetch)) return true;
  } catch {
    return true;
  }
  return false;
}

/**
 * Run all protection checks.
 * @returns {{ safe: boolean, threats: string[] }}
 */
export function runProtectionChecks() {
  const threats = [];

  if (isHeadless())      threats.push('HEADLESS_BROWSER');
  if (isVirtualMachine()) threats.push('VIRTUAL_MACHINE');
  if (isSandbox())       threats.push('SANDBOX');
  if (isIntercepted())   threats.push('API_INTERCEPTION');

  return { safe: threats.length === 0, threats };
}
