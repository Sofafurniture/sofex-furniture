import { DELIVERY_HUB_POSTCODE, getDeliveryZone } from '@/lib/delivery-zone';

const UK_POSTCODE_REGEX = /([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})/i;

export function extractUkPostcodeFromAddress(address: string): string | null {
  const match = address.match(UK_POSTCODE_REGEX);
  return match ? match[1].replace(/\s+/g, ' ').trim().toUpperCase() : null;
}

export async function getDistanceFromHubForAddress(address: string): Promise<number | null> {
  const postcode = extractUkPostcodeFromAddress(address);
  if (!postcode) return null;
  const zone = await getDeliveryZone(postcode);
  return zone.distanceMiles;
}

export function formatDistanceFromHub(miles: number | null | undefined): string {
  if (miles == null) return 'Distance unknown';
  return `${miles} mi from ${DELIVERY_HUB_POSTCODE}`;
}
