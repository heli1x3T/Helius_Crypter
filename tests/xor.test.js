/**
 * xor.test.js — XOR engine unit tests
 */

import { strict as assert } from 'assert';

// inline XOR impl (mirrors src/crypto/xor-engine.js)
function expandSeed(seed, length) {
  const ks = new Uint8Array(length);
  let s = ((seed[0] << 24) | (seed[1] << 16) | (seed[2] << 8) | seed[3]) >>> 0;
  for (let i = 0; i < length; i++) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    ks[i] = (s >>> 24) & 0xff;
  }
  return ks;
}

function xor(data, seed) {
  const ks = expandSeed(seed, data.length);
  return data.map((b, i) => b ^ ks[i]);
}

function shannonEntropy(data) {
  const freq = new Array(256).fill(0);
  for (const b of data) freq[b]++;
  let e = 0;
  for (const f of freq) {
    if (!f) continue;
    const p = f / data.length;
    e -= p * Math.log2(p);
  }
  return e;
}

let pass = 0, fail = 0;
const test = (name, fn) => {
  try { fn(); console.log(`  ✓ ${name}`); pass++; }
  catch (e) { console.error(`  ✗ ${name}: ${e.message}`); fail++; }
};

console.log('\n[XOR Engine — extended]');

test('Symmetry: encrypt then decrypt returns original', () => {
  const seed = new Uint8Array([0xCA, 0xFE, 0xBA, 0xBE]);
  const plain = new TextEncoder().encode('Hermes XOR test vector');
  const enc  = new Uint8Array(xor(plain, seed));
  const dec  = new Uint8Array(xor(enc, seed));
  assert.deepEqual(dec, plain);
});

test('Zero plaintext produces non-zero ciphertext', () => {
  const seed = new Uint8Array([0x01, 0x23, 0x45, 0x67]);
  const zeros = new Uint8Array(256);
  const out = new Uint8Array(xor(zeros, seed));
  const allZero = out.every((b) => b === 0);
  assert.equal(allZero, false);
});

test('Entropy of XOR output >= 6 bits/byte', () => {
  const seed = new Uint8Array([0x89, 0xAB, 0xCD, 0xEF]);
  const plain = new Uint8Array(4096).fill(0x41); // repeated 'A'
  const enc = new Uint8Array(xor(plain, seed));
  const entropy = shannonEntropy(enc);
  assert(entropy >= 6, `Entropy too low: ${entropy.toFixed(2)}`);
});

test('Different seeds produce different keystreams', () => {
  const ks1 = expandSeed(new Uint8Array([0x00, 0x00, 0x00, 0x01]), 128);
  const ks2 = expandSeed(new Uint8Array([0x00, 0x00, 0x00, 0x02]), 128);
  assert.notDeepEqual(ks1, ks2);
});

test('Keystream length matches requested length', () => {
  [0, 1, 100, 1024, 65536].forEach((len) => {
    const ks = expandSeed(new Uint8Array(4), len);
    assert.equal(ks.length, len, `Length mismatch for ${len}`);
  });
});

test('XOR is stable (same seed always same output)', () => {
  const seed = new Uint8Array([0xFF, 0xEE, 0xDD, 0xCC]);
  const data = new Uint8Array(64).fill(0x42);
  const a = xor(data, seed).join(',');
  const b = xor(data, seed).join(',');
  assert.equal(a, b);
});

console.log(`\n  Passed: ${pass}  Failed: ${fail}\n`);
if (fail > 0) process.exit(1);
