import fs from 'fs';

const html = fs.readFileSync('.tmp-luella-full.html', 'utf8');
const idx = html.indexOf('SKU001597374');
console.log('context:', html.slice(idx - 250, idx + 250));

const variantRegex =
  /\{"buildConfigurationOptionPackDescription":"([^"]+)","dimensionsCopy":"([^"]+)","leadTimeInDays":\d+,"leadTimeCopy":"[^"]+","skuPrice":(\d+),"skuSalePrice":(\d+),"skuThumbImages":"([^"]+)","skuid":"(SKU\d+)","swkVariant":"([^"]+)"\}/g;

for (const m of html.matchAll(variantRegex)) {
  if (m[6] === 'SKU001597374') {
    console.log('\nFound variant:', m[1], m[2], m[4], m[7]);
  }
}

// Try GET for images
const tests = [
  'https://images.sofology.co.uk/productmedia/lifestyle/sku001592194.jpg',
  'https://images.sofology.co.uk/productmedia/lifestyle/sku001592766.jpg',
  'https://images.sofology.co.uk/productmedia/cameos/sku001592194-0.jpg',
  'https://images.sofology.co.uk/productmedia/studio/sku001592194.jpg',
  'https://images.sofology.co.uk/productmedia/scoops/sku001592194.png',
  'https://images.sofology.co.uk/dpr_auto/f_auto,c_limit,w_1200,q_auto/productmedia/lifestyle/sku001592194.jpg',
];

for (const url of tests) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  console.log(res.status, url.split('/').slice(-2).join('/'), res.headers.get('content-type'));
}
