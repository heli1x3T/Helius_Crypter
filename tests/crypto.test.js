/**
 * Hermes Crypter — Crypto Core Test Suite
 * Tests AES-256-GCM, PBKDF2 key derivation, XOR engine, and SHA-256.
 * Run with: node --experimental-vm-modules tests/crypto.test.js
 */

import { strict as assert } from 'assert';

// ── Helpers ──────────────────────────────────────────────────
const enc = new TextEncoder();
const toHex = (bytes) =>
  Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');

// ── XOR Engine ───────────────────────────────────────────────
function expandSeed(seed, length) {
  const ks = new Uint8Array(length);
  let state = ((seed[0] << 24) | (seed[1] << 16) | (seed[2] << 8) | seed[3]) >>> 0;
  for (let i = 0; i < length; i++) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    ks[i] = (state >>> 24) & 0xff;
  }
  return ks;
}

function xorTransform(data, seed) {
  const ks = expandSeed(seed, data.length);
  return data.map((b, i) => b ^ ks[i]);
}

// ── Test runner ──────────────────────────────────────────────
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

async function testAsync(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// ── XOR Tests ────────────────────────────────────────────────
console.log('\n[XOR Engine]');

test('XOR is symmetric (encrypt = decrypt)', () => {
  const seed = new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]);
  const plain = enc.encode('Hello, Hermes Crypter!');
  const encrypted = new Uint8Array(xorTransform(plain, seed));
  const decrypted = new Uint8Array(xorTransform(encrypted, seed));
  assert.deepEqual(decrypted, plain);
});

test('XOR produces different output for different seeds', () => {
  const seed1 = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
  const seed2 = new Uint8Array([0x05, 0x06, 0x07, 0x08]);
  const plain = enc.encode('test payload');
  const out1 = xorTransform(plain, seed1);
  const out2 = xorTransform(plain, seed2);
  assert.notDeepEqual(out1, out2);
});

test('XOR output length equals input length', () => {
  const seed = new Uint8Array([0xAA, 0xBB, 0xCC, 0xDD]);
  const plain = new Uint8Array(1337);
  const out = xorTransform(plain, seed);
  assert.equal(out.length, plain.length);
});

// ── SHA-256 Tests ─────────────────────────────────────────────
console.log('\n[SHA-256]');

await testAsync('SHA-256 of empty string matches known value', async () => {
  const data = enc.encode('');
  const digest = await crypto.subtle.digest('SHA-256', data);
  const hex = toHex(new Uint8Array(digest));
  assert.equal(hex, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
});

await testAsync('SHA-256 output is 32 bytes', async () => {
  const digest = await crypto.subtle.digest('SHA-256', enc.encode('hermes'));
  assert.equal(new Uint8Array(digest).length, 32);
});

// ── AES-GCM Tests ─────────────────────────────────────────────
console.log('\n[AES-256-GCM]');

await testAsync('AES-GCM encrypt/decrypt round-trip', async () => {
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plain = enc.encode('FUD payload test');

  const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain);
  const plainBuf  = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipherBuf);

  assert.deepEqual(new Uint8Array(plainBuf), plain);
});

await testAsync('AES-GCM ciphertext differs from plaintext', async () => {
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plain = enc.encode('Hermes Crypter 2025');

  const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain);
  const cipher = new Uint8Array(cipherBuf).slice(0, plain.length);

  assert.notDeepEqual(cipher, plain);
});

await testAsync('AES-GCM with different IV produces different ciphertext', async () => {
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  const plain = enc.encode('same plaintext');
  const iv1 = crypto.getRandomValues(new Uint8Array(12));
  const iv2 = crypto.getRandomValues(new Uint8Array(12));

  const c1 = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv1 }, key, plain);
  const c2 = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv2 }, key, plain);

  assert.notDeepEqual(new Uint8Array(c1), new Uint8Array(c2));
});

// ── PBKDF2 Tests ─────────────────────────────────────────────
console.log('\n[PBKDF2-SHA-256]');

await testAsync('PBKDF2 derives 256-bit key from passphrase', async () => {
  const passKey = await crypto.subtle.importKey('raw', enc.encode('passphrase'), 'PBKDF2', false, ['deriveKey']);
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 1000 },
    passKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt'],
  );
  const raw = await crypto.subtle.exportKey('raw', key);
  assert.equal(new Uint8Array(raw).length, 32);
});

await testAsync('PBKDF2 different salts produce different keys', async () => {
  const pass = enc.encode('same-pass');
  const salt1 = crypto.getRandomValues(new Uint8Array(32));
  const salt2 = crypto.getRandomValues(new Uint8Array(32));

  const derive = async (salt) => {
    const pk = await crypto.subtle.importKey('raw', pass, 'PBKDF2', false, ['deriveKey']);
    const k  = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 1000 },
      pk,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt'],
    );
    return new Uint8Array(await crypto.subtle.exportKey('raw', k));
  };

  const k1 = await derive(salt1);
  const k2 = await derive(salt2);
  assert.notDeepEqual(k1, k2);
});

// ── Summary ───────────────────────────────────────────────────
console.log(`\n${'─'.repeat(40)}`);
console.log(`  Passed: ${passed}  Failed: ${failed}`);
console.log(`${'─'.repeat(40)}\n`);

if (failed > 0) process.exit(1);
