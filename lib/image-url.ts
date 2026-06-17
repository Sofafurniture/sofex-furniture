/** Append a width hint for Shopify CDN URLs. */
export function shopifyImage(url: string, width = 900): string {
  if (!url.includes('cdn.shopify.com')) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}width=${width}`;
}

/** Sofology CDN resize transform. */
export function sofologyImage(path: string, width = 900): string {
  if (path.startsWith('http')) {
    if (path.includes('/dpr_auto/')) return path;
    const match = path.match(/productmedia\/(.+)$/);
    if (!match) return path;
    return `https://images.sofology.co.uk/dpr_auto/f_auto,c_limit,w_${width},q_auto/productmedia/${match[1]}`;
  }
  return `https://images.sofology.co.uk/dpr_auto/f_auto,c_limit,w_${width},q_auto/productmedia/${path}`;
}

/** B&Q / Kingfisher image resize. */
export function kingfisherImage(url: string, width = 900): string {
  if (!url.includes('media.diy.com')) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}wid=${width}&fit=constrain`;
}
