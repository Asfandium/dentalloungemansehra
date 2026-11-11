import { clinicConfig } from '../config/clinicConfig';

/**
 * Resolves media and upload URLs so they always point to the correct static assets
 * whether running via Vite dev proxy, directly in production, or using external CDNs.
 */
export function getFullImageUrl(url?: string | null, fallback = ''): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }

  const cleanUrl = url.trim();

  // Already a full or data URL
  if (
    cleanUrl.startsWith('http://') ||
    cleanUrl.startsWith('https://') ||
    cleanUrl.startsWith('data:') ||
    cleanUrl.startsWith('blob:')
  ) {
    return cleanUrl;
  }

  // Uploaded media asset starting with /uploads/
  if (cleanUrl.startsWith('/uploads/')) {
    const base = clinicConfig.apiBaseUrl ? clinicConfig.apiBaseUrl.replace(/\/$/, '') : '';
    // If apiBaseUrl is defined, prepend it; otherwise Vite proxy forwards /uploads directly
    return base ? `${base}${cleanUrl}` : cleanUrl;
  }

  return cleanUrl;
}
