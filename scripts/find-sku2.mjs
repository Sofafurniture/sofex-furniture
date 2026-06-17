import fs from 'fs';

const html = fs.readFileSync('.tmp-luella-full.html', 'utf8');
const variantRegex =
  /\{"buildConfigurationOptionPackDescription":"([^"]+)","dimensionsCopy":"([^"]+)","leadTimeInDays":\d+,"leadTimeCopy":"[^"]+","skuPrice":(\d+),"skuSalePrice":(\d+),"skuThumbImages":"([^"]+)","skuid":"(SKU\d+)","swkVariant":"([^"]+)"\}/g;

const sku59737 = [];
for (const m of html.matchAll(variantRegex)) {
  if (m[6].startsWith('SKU0015973')) {
    sku59737.push({ config: m[1], sku: m[6], price: m[4], variant: m[7], thumb: m[5] });
  }
}
console.log('SKU0015973* variants:', sku59737.length);
for (const v of sku59737) console.log(v);

// Find selected product scoop for sku001597374
const scoopIdx = html.indexOf('sku001597374');
if (scoopIdx > -1) console.log('\nscoop context:', html.slice(scoopIdx - 100, scoopIdx + 200));
