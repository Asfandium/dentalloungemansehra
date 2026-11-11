import { fallbackServicesData, type DentalService } from '../config/servicesData';
import { clinicConfig } from '../config/clinicConfig';

export interface PublicServiceDto {
  id: string;
  orderNumber: number;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  whoItIsFor?: string;
  generalBenefits?: string[];
  iconName?: string;
  image?: string;
  category?: 'Preventative' | 'Restorative' | 'Cosmetics' | 'Orthodontics';
  priceDisplay: string;
  priceNote?: string;
  isPublished?: boolean;
}

let cachedServices: DentalService[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

/**
 * Service API layer:
 * Fetches published services and prices from backend API endpoint:
 * GET /api/services
 *
 * If backend is unavailable or not yet deployed, falls back to certified local data.
 * Guarantees strict 10-service order preservation.
 */
export async function getDentalServices(): Promise<DentalService[]> {
  const now = Date.now();
  if (cachedServices && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedServices;
  }

  const endpoint = clinicConfig.apiBaseUrl
    ? `${clinicConfig.apiBaseUrl.replace(/\/$/, '')}/api/services`
    : '/api/services';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data: PublicServiceDto[] = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        // Merge backend price & image updates while preserving mandatory 10-service order
        const merged: DentalService[] = fallbackServicesData.map((fallback) => {
          const apiMatch = data.find(
            (d) => d.id === fallback.id || d.name.toLowerCase() === fallback.name.toLowerCase()
          );
          if (apiMatch) {
            return {
              ...fallback,
              priceDisplay: apiMatch.priceDisplay || fallback.priceDisplay,
              priceNote: apiMatch.priceNote !== undefined ? apiMatch.priceNote : fallback.priceNote,
              image: apiMatch.image || fallback.image,
              shortDescription: apiMatch.shortDescription || fallback.shortDescription,
              fullDescription: apiMatch.fullDescription || fallback.fullDescription,
            };
          }
          return fallback;
        });

        cachedServices = merged;
        lastFetchTime = now;
        return merged;
      }
    }
  } catch (_err) {
    // Graceful fallback to development/certified dataset
  }

  cachedServices = fallbackServicesData;
  lastFetchTime = now;
  return fallbackServicesData;
}
