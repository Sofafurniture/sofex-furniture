/** Scene7 / B&Q and Home & Love URLs break Next.js image optimization on Netlify. */
export function shouldBypassImageOptimizer(src: string): boolean {
  return (
    src.includes('media.diy.com') ||
    src.includes('homeandlove.louisinteriors.co.uk') ||
    src.includes('images.sofology.co.uk')
  );
}
