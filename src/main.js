/**
 * main.js — Hermes Crypter Landing Page
 * Entry point. Imports modules and bootstraps all UI behaviour.
 */

import './style.css';
import { FEATURES, STEPS, AV_ENGINES } from './data.js';
import { initConstellation } from './constellation.js';

// ── DOM helpers ──────────────────────────────────────────────
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ── Boot ─────────────────────────────────────────────────────
document.documentElement.classList.add('js-ready');

init();

function init() {
  renderFeatures();
  renderSteps();
  renderCodeBlock();
  renderAvGrid();
  bindScrollReveal();
  bindHeaderScroll();
  bindMagneticButtons();
  initConstellation($('#constellation'));
}

// ── Render: Features grid ────────────────────────────────────
function renderFeatures() {
  const grid = $('#featuresGrid');
  if (!grid) return;

  grid.innerHTML = FEATURES.map((f, i) => /* html */`
    <article class="feature-card reveal" style="transition-delay:${i * 60}ms"
             aria-labelledby="feature-${i}">
      <span class="feature-icon" aria-hidden="true">${f.icon}</span>
      <h3 class="feature-name" id="feature-${i}">${f.name}</h3>
      <p class="feature-desc">${f.desc}</p>
    </article>
  `).join('');
}

// ── Render: How-it-works steps ───────────────────────────────
function renderSteps() {
  const container = $('#steps');
  if (!container) return;

  container.innerHTML = STEPS.map((s, i) => /* html */`
    <div class="step reveal" style="transition-delay:${i * 80}ms">
      <div class="step-num" aria-hidden="true">${s.num}</div>
      <div>
        <div class="step-title">${s.title}</div>
        <div class="step-desc">${s.desc}</div>
      </div>
    </div>
  `).join('');
}

// ── Render: Terminal code block ──────────────────────────────
function renderCodeBlock() {
  const body = $('#codeBody');
  if (!body) return;

  const lines = [
    [`<span class="c-comment">// Build started — ${new Date().toISOString().slice(0, 10)}</span>`],
    [`<span class="c-key">algorithm</span><span class="c-op"> : </span><span class="c-val">AES-256-GCM</span>`],
    [`<span class="c-key">xor_seed </span><span class="c-op"> : </span><span class="c-str">0x${randomHex(8)}</span> <span class="c-comment">// unique per build</span>`],
    [`<span class="c-key">pbkdf2   </span><span class="c-op"> : </span><span class="c-val">600,000 iterations</span>`],
    [`<span class="c-key">salt     </span><span class="c-op"> : </span><span class="c-str">random(32)</span>`],
    [`<span class="c-key">iv       </span><span class="c-op"> : </span><span class="c-str">random(12)</span>`],
    [`&nbsp;`],
    [`<span class="c-comment">// Encryption complete</span>`],
    [`<span class="c-key">sha256   </span><span class="c-op"> : </span><span class="c-val">${randomHex(8)}...${randomHex(4)}</span>`],
    [`<span class="c-key">output   </span><span class="c-op"> : </span><span class="c-str">payload_encrypted.exe</span>`],
    [`&nbsp;`],
    [`<span class="c-comment">// VirusTotal private scan</span>`],
    [`<span class="c-key">detected </span><span class="c-op"> : </span><span class="c-val">0</span><span class="c-op"> / 62</span>`],
    [`<span class="c-key">status   </span><span class="c-op"> : </span><span class="c-success">✓ FULLY UNDETECTED</span>`],
  ];

  body.innerHTML = lines.map(([line]) => `<div>${line}</div>`).join('');
}

// ── Render: AV grid ──────────────────────────────────────────
function renderAvGrid() {
  const grid = $('#avGrid');
  if (!grid) return;

  grid.innerHTML = AV_ENGINES.map((name, i) => /* html */`
    <div class="av-card reveal" style="transition-delay:${Math.min(i * 30, 400)}ms">
      <span class="av-name">${name}</span>
      <span class="av-status" aria-label="Bypassed">
        <span class="av-status-dot"></span>
        BYPASSED
      </span>
    </div>
  `).join('');
}

// ── Scroll reveal ────────────────────────────────────────────
function bindScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -5%' });

  // Observe initial elements + re-run after dynamic rendering
  const observeAll = () => $$('.reveal').forEach((el) => observer.observe(el));
  observeAll();

  // Re-observe after dynamic content is injected
  requestAnimationFrame(observeAll);
}

// ── Header scroll state ──────────────────────────────────────
function bindHeaderScroll() {
  const header = $('.header');
  if (!header) return;

  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ── Magnetic buttons ─────────────────────────────────────────
function bindMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  $$('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.14;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.14;
      el.style.transform = `translate3d(${x}px,${y}px,0)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = 'translate3d(0,0,0)';
    });
  });
}

// ── Utility ──────────────────────────────────────────────────
function randomHex(len) {
  return Array.from({ length: len }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('').toUpperCase();
}
