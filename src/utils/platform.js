/**
 * platform.js — target platform detection and payload profile utilities
 */

export const PLATFORMS = Object.freeze({
  windows: {
    label: 'Windows',
    icon: '⊞',
    extensions: ['.exe','.com','.scr','.msi','.msp','.msix','.appx','.bat','.cmd','.ps1','.vbs','.vbe','.js','.jse','.wsf','.wsh','.hta'],
    avEngines: ['Windows Defender','Kaspersky','Bitdefender','ESET NOD32','Avast','CrowdStrike Falcon','SentinelOne','Carbon Black'],
  },
  android: {
    label: 'Android',
    icon: '◉',
    extensions: ['.apk','.apks','.xapk','.apkm','.aab','.dex','.jar','.so','.aar'],
    avEngines: ['Google Play Protect','Lookout','Malwarebytes Mobile','Sophos Intercept X'],
  },
  macos: {
    label: 'macOS',
    icon: '⌘',
    extensions: ['.dmg','.pkg','.app'],
    avEngines: ['XProtect','MRT','Malwarebytes for Mac','Sophos Home'],
  },
});

/**
 * Detect platform from file extension.
 * @param {string} ext - e.g. '.exe'
 * @returns {string | null} platform key
 */
export function detectPlatform(ext) {
  const lower = ext.toLowerCase();
  for (const [key, profile] of Object.entries(PLATFORMS)) {
    if (profile.extensions.includes(lower)) return key;
  }
  return null;
}

/**
 * Get all supported extensions across all platforms.
 * @returns {string[]}
 */
export function getAllExtensions() {
  return Object.values(PLATFORMS).flatMap((p) => p.extensions);
}

/**
 * Validate that a file extension is supported.
 * @param {string} ext
 * @returns {boolean}
 */
export function isSupportedExtension(ext) {
  return getAllExtensions().includes(ext.toLowerCase());
}
