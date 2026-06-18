export interface MapLink {
  id: 'google' | 'apple' | 'waze';
  label: string;
  href: string;
}

export function buildMapLinks(address: string): MapLink[] {
  const query = encodeURIComponent(address.trim());
  return [
    {
      id: 'google',
      label: 'Google Maps',
      href: `https://www.google.com/maps/search/?api=1&query=${query}`,
    },
    {
      id: 'apple',
      label: 'Apple Maps',
      href: `https://maps.apple.com/?q=${query}`,
    },
    {
      id: 'waze',
      label: 'Waze',
      href: `https://waze.com/ul?q=${query}&navigate=yes`,
    },
  ];
}
