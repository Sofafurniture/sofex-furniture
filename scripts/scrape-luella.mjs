import fs from 'fs';

const html = fs.readFileSync('.tmp-luella.html', 'utf8');

// JSON-LD
const ldMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
for (const [i, m] of ldMatches.entries()) {
  try {
    const data = JSON.parse(m[1]);
    fs.writeFileSync(`.tmp-ld-${i}.json`, JSON.stringify(data, null, 2));
    console.log(`LD ${i}:`, data['@type'], data.name || data.sku);
  } catch (e) {
    console.log(`LD ${i} parse error`);
  }
}

// Extract all sku codes
const skus = [...new Set([...html.matchAll(/sku00\d{6}/gi)].map((m) => m[0].toLowerCase()))];
console.log('SKUs found:', skus);

// Extract inline JSON blobs mentioning luella
const jsonBlobs = [...html.matchAll(/\{"[^"]*luella[^"]*":/gi)].slice(0, 5);
console.log('json blobs', jsonBlobs.length);

// Try fetch product API
const apis = [
  'https://www.sofology.co.uk/api/product/luella',
  'https://www.sofology.co.uk/api/products/luella',
  'https://www.sofology.co.uk/sofology/api/product/luella',
];

for (const url of apis) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    console.log(url, res.status, res.headers.get('content-type'));
    if (res.ok) {
      const text = await res.text();
      fs.writeFileSync('.tmp-api.json', text.slice(0, 500000));
      console.log('saved api response', text.length);
    }
  } catch (e) {
    console.log(url, e.message);
  }
}
