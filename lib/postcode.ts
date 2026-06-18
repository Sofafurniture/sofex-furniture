export interface UkPostcodeDetails {
  postcode: string;
  postTown: string;
  adminDistrict: string;
  latitude: number;
  longitude: number;
}

function normalizePostcode(postcode: string): string {
  return postcode.replace(/\s+/g, '').toUpperCase();
}

export function formatUkPostcode(postcode: string): string {
  const raw = normalizePostcode(postcode);
  if (raw.length <= 3) return raw;
  return `${raw.slice(0, -3)} ${raw.slice(-3)}`;
}

/** UK postcode lookup via postcodes.io */
export async function lookupUkPostcode(postcode: string): Promise<UkPostcodeDetails | null> {
  const normalized = normalizePostcode(postcode);
  const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(normalized)}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    result?: {
      postcode: string;
      post_town?: string;
      admin_district?: string;
      parish?: string;
      latitude: number;
      longitude: number;
    };
  };

  const result = data.result;
  if (!result) return null;

  return {
    postcode: result.postcode,
    postTown: result.post_town || result.admin_district || result.parish || 'United Kingdom',
    adminDistrict: result.admin_district || result.post_town || '',
    latitude: result.latitude,
    longitude: result.longitude,
  };
}

export function toStripeAddress(
  street: string,
  postcode: string,
  lookup: UkPostcodeDetails | null,
): { line1: string; city: string; postal_code: string; country: 'GB' } {
  return {
    line1: street.trim(),
    city: lookup?.postTown || 'United Kingdom',
    postal_code: formatUkPostcode(postcode),
    country: 'GB',
  };
}
