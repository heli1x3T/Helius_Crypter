/**
 * license.js — client-side license key format validation
 * Structural checks only. Cryptographic validation is server-side.
 */

const KEY_PATTERN = /^[A-Z0-9]{3,6}_[A-Z0-9]{3,6}_[A-Z0-9]{3,6}_[A-Z0-9]{3,6}$/;
const MIN_LENGTH = 12;

/**
 * Basic structural validation of a license key.
 * Server performs full cryptographic verification.
 * @param {string} key
 * @returns {boolean}
 */
export function isValidFormat(key) {
  const trimmed = String(key ?? '').trim();
  return trimmed.length >= MIN_LENGTH && KEY_PATTERN.test(trimmed);
}

/**
 * Mask a license key for display (e.g. "AAA_HBS_***_***").
 * @param {string} key
 * @returns {string}
 */
export function maskKey(key) {
  const parts = key.split('_');
  return parts
    .map((part, i) => (i < 2 ? part : '*'.repeat(part.length)))
    .join('_');
}

/**
 * Parse license key into its segment components.
 * @param {string} key
 * @returns {string[]}
 */
export function parseSegments(key) {
  return String(key).trim().split('_');
}

/**
 * Generate a demo license key for display purposes only.
 * @returns {string}
 */
export function generateDemoKey() {
  const seg = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const len = 3 + Math.floor(Math.random() * 4);
    return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };
  return `${seg()}_${seg()}_${seg()}_${seg()}`;
}
