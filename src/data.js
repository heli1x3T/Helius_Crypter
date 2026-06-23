// ── DATA ────────────────────────────────────────────────────
export const FEATURES = [
  {
    icon: '🔐',
    name: 'AES-256-GCM Encryption',
    desc: 'Full payload encryption with authenticated GCM ciphertext. Output is indistinguishable from random data — zero byte patterns for AV engines to match.',
  },
  {
    icon: '🌀',
    name: 'Polymorphic Signature Morphing',
    desc: 'Unique XOR mutation seed on every single build. No two outputs share a hash — defeats ML classifiers, heuristic engines, YARA rules, and cloud reputation databases.',
  },
  {
    icon: '🛑',
    name: 'Runtime Protection',
    desc: 'Anti-debug, anti-VM, anti-sandbox, anti-emulation, anti-memory scan, anti-dump — payload halts execution the moment a controlled environment is detected.',
  },
  {
    icon: '🌙',
    name: 'Silent Memory Execution',
    desc: 'No disk writes, no event logs, no prompts. The payload runs entirely in-memory — leaving zero forensic artifacts for EDR pivot.',
  },
  {
    icon: '⚡',
    name: 'Universal C2 Compatibility',
    desc: 'Works with Cobalt Strike, Metasploit, XWorm RAT, njRAT, DCrat, AsyncRAT, and any shellcode-based payload — no modification required.',
  },
  {
    icon: '🛡',
    name: 'FUD Guarantee',
    desc: '0/Total detection on VirusTotal private build. Bypasses static, dynamic, heuristic, and behavioral scans across all 62 major AV/EDR engines.',
  },
];

export const STEPS = [
  {
    num: '01',
    title: 'XOR Polymorphic Layer',
    desc: 'Byte-level mutation with a unique seed per build. Eliminates all recognizable code patterns and confuses behavioral analysis engines.',
  },
  {
    num: '02',
    title: 'AES-256-GCM Encryption',
    desc: 'Full payload wrapped in authenticated AES-GCM. The GCM tag prevents tampering. Output is cryptographically random — no static signature can be formed.',
  },
  {
    num: '03',
    title: 'PBKDF2 Key Hardening',
    desc: '600,000 rounds of PBKDF2-SHA-256 with a fresh cryptographic salt per build. Brute-force and dictionary attacks are computationally infeasible.',
  },
];

export const AV_ENGINES = [
  'Windows Defender', 'Kaspersky', 'Bitdefender', 'ESET NOD32',
  'Avast', 'AVG', 'McAfee', 'Symantec', 'Malwarebytes', 'Sophos',
  'F-Secure', 'Trend Micro', 'CrowdStrike', 'SentinelOne', 'Cylance',
  'Carbon Black', 'Webroot', 'Comodo', 'DrWeb', 'G Data',
  'Emsisoft', 'Panda', 'Fortinet', 'Zscaler', 'Palo Alto',
  'FireEye', 'Symantec EDR', 'MicroWorld', 'K7', 'Arcabit',
  '+ 32 more engines',
];
