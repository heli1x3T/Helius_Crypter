# <div align="center">Hermes Crypter — FUD Payload Encryption Tool</div>

<div align="center">

A private Fully Undetectable (FUD) crypter for authorized red team operations and penetration testing.
Multi-layer AES-256-GCM encryption with polymorphic XOR morphing — achieving **0/Total** detection on VirusTotal.

[🌐 Live Demo](https://hermescrypter.qzz.io/) &nbsp;·&nbsp; [💬 Telegram](https://t.me/hermes_crypter)

<!-- ADD SCREENSHOT HERE -->
<img width="2988" height="1482" alt="b" src="https://github.com/user-attachments/assets/9500230e-e517-42a5-9e67-19ace05021e5" />

</div>

---

## 🚨 Authorized Use Only

This tool is designed exclusively for authorized penetration testing, red team engagements, and security research in controlled environments. Usage of this software against systems you do not own or have explicit written permission to test is strictly prohibited and may violate local, state, and federal laws. You are solely responsible for your usage.

---

## 📺 Tutorial / Demo

Telegram channel: [@hermes0x01](https://t.me/hermes0x01)

---

## 🔧 Core Features

- **🔐 AES-256-GCM Encryption** — Full payload encryption with authenticated ciphertext. Zero static byte patterns for AV engines to match.
- **🌀 Polymorphic Signature Morphing** — Unique XOR mutation seed per build. Every output has a different binary structure — defeats ML classifiers, heuristic engines, and YARA rules.
- **🛑 Runtime Protection** — Anti-debug, anti-VM, anti-sandbox, anti-emulation, anti-memory scan, anti-dump, anti-analysis.
- **🌙 Silent Memory Execution** — No disk writes, no logs, no prompts. Payload executes entirely in memory.
- **⚡ Universal Payload Support** — Works with Cobalt Strike, Metasploit, XWorm RAT, njRAT, DCrat, AsyncRAT, and all major C2 frameworks.
- **🛡 FUD Guarantee** — 0/Total detection on VirusTotal private build, bypassing static, dynamic & heuristic scans.
- **💻 Browser-Side Processing** — Payload bytes never leave your machine. No upload endpoints, no telemetry.

<div align="center">

<img width="2468" height="1502" alt="c" src="https://github.com/user-attachments/assets/c87f13ac-0beb-4b3d-b4da-f885104f3557" />
<img width="2834" height="1352" alt="d" src="https://github.com/user-attachments/assets/590ed1e5-0b39-4d79-8df0-cb35143f4e7e" />

</div>

---

## 🧪 Detection Testing

Tested on VirusTotal, MetaDefender, and Hybrid Analysis.

| Platform | Result |
|---|---|
| VirusTotal (private build) | ✅ 0 / Total |
| MetaDefender | ✅ 0 / Total |
| Hybrid Analysis | ✅ Undetected |
![abc](https://github.com/user-attachments/assets/7ad9d2fc-db64-4026-b2df-188f12ade19b)
<div align="center">

<!-- ADD VIRUSTOTAL SCREENSHOT HERE -->
<!-- <img alt="virustotal-result" src="YOUR_IMAGE_URL" /> -->

<!-- ADD SCAN RESULT SCREENSHOT HERE -->
<!-- <img alt="scan-result" src="YOUR_IMAGE_URL" /> -->

</div>

---

## 🎯 Supported Payload Profiles

**Windows (17 formats)**
`.exe` `.com` `.scr` `.msi` `.msp` `.msix` `.appx` `.bat` `.cmd` `.ps1` `.vbs` `.vbe` `.js` `.jse` `.wsf` `.wsh` `.hta`

**Android (9 formats)**
`.apk` `.apks` `.xapk` `.apkm` `.aab` `.dex` `.jar` `.so` `.aar`

**macOS (3 formats)**
`.dmg` `.pkg` `.app`
<img width="2912" height="1484" alt="e" src="https://github.com/user-attachments/assets/a0082eae-87e6-4303-932a-929d91e04771" />


---

## 📋 Prerequisites

- Node.js 20.x or later
- npm 9.x or later

---

## 🚀 Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/hermes-crypter.git
   cd hermes-crypter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open in browser:
   ```
   http://127.0.0.1:4173
   ```

5. Run crypto-core tests:
   ```bash
   npm test
   ```

---

## 🛠️ Stack

- **Encryption:** Web Crypto API — AES-256-GCM, PBKDF2-SHA-256 (600k iterations)
- **PWA:** Service Worker for offline capability

---

<div align="center">

## 👨‍💻 Author

Telegram: [@hermes_crypter](https://t.me/hermes_crypter)
Website: [https://hermescrypter.qzz.io](https://hermescrypter.qzz.io/)

## 📄 License

For authorized security research and penetration testing only.
No public distribution. You are solely responsible for your usage.
© 2026 Hermes Crypter

</div>
