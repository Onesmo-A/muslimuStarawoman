import FingerprintJS from '@fingerprintjs/fingerprintjs';

const FINGERPRINT_KEY = 'mswa_device_fingerprint_seed';
const FINGERPRINT_VERSION = 'browser-v1';

const getLocalSeed = () => {
    const existing = localStorage.getItem(FINGERPRINT_KEY);

    if (existing) {
        return existing;
    }

    const created = `mswa-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(FINGERPRINT_KEY, created);

    return created;
};

const hashValue = async (value) => {
    if (window.crypto?.subtle) {
        const bytes = new TextEncoder().encode(value);
        const digest = await window.crypto.subtle.digest('SHA-256', bytes);

        return Array.from(new Uint8Array(digest))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    return btoa(unescape(encodeURIComponent(value))).replace(/=+$/, '');
};

export const getDeviceFingerprintPayload = async () => {
    const localSeed = getLocalSeed();
    const fp = await FingerprintJS.load();
    const fpResult = await fp.get();
    const signals = {
        fingerprintVersion: FINGERPRINT_VERSION,
        localSeed,
        fingerprintJsVisitorId: fpResult.visitorId,
        fingerprintJsConfidence: fpResult.confidence,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        languages: navigator.languages,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
        touchPoints: navigator.maxTouchPoints,
        colorDepth: window.screen?.colorDepth,
        screen: {
            width: window.screen?.width,
            height: window.screen?.height,
            pixelRatio: window.devicePixelRatio,
        },
    };

    const rawFingerprint = JSON.stringify({
        visitorId: fpResult.visitorId,
        localSeed,
        version: FINGERPRINT_VERSION,
    });

    return {
        device_fingerprint: await hashValue(rawFingerprint),
        device_signals: signals,
    };
};
