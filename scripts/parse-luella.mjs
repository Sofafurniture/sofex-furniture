import fs from 'fs';

const html = fs.readFileSync('.tmp-luella-full.html', 'utf8');

// JSON-LD blocks
const ldMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
for (const [i, m] of ldMatches.entries()) {
  try {
    const data = JSON.parse(m[1]);
    fs.writeFileSync(`.tmp-ld-${i}.json`, JSON.stringify(data, null, 2));
    console.log(`LD ${i}: type=${data['@type']} name=${data.name}`);
  } catch {}
}

// Find product configuration data - search for seater labels near skus
const seaterMatches = [...html.matchAll(/(2 Seater|3 Seater|4 Seater|Loveseat|Chaise|Corner|Armchair|Pouffe|Footstool)[^<]{0,200}sku00\d{6}/gi)];
console.log('\nSeater+SKU patterns:', seaterMatches.length);
for (const m of seaterMatches.slice(0, 15)) {
  console.log(m[0].replace(/\s+/g, ' ').slice(0, 120));
}

// Search for configuration objects
const configIdx = html.indexOf('"configurations"');
if (configIdx > -1) {
  console.log('\nconfigurations at', configIdx);
  console.log(html.slice(configIdx, configIdx + 2000));
}

// Search for variants array
for (const key of ['"variants"', '"sizes"', '"styles"', '"products"', '"skus"']) {
  const idx = html.indexOf(key);
  if (idx > -1) console.log(`Found ${key} at ${idx}`);
}

// Extract name+sku pairs from JSON-like fragments
const pairs = [...html.matchAll(/"name":"([^"]+)"[^}]{0,300}?"sku":"?(SKU\d+|sku\d+)"?/gi)];
console.log('\nname+sku pairs:', pairs.length);
const seen = new Set();
for (const m of pairs) {
  const key = m[1] + '|' + m[2];
  if (seen.has(key)) continue;
  seen.add(key);
  if (/luella|seater|chaise|corner|loveseat|armchair|pouffe|footstool/i.test(m[1])) {
    console.log(m[1], '->', m[2]);
  }
}

// Broader sku title search
const titleSku = [...html.matchAll(/"title":"([^"]+)"[^}]{0,400}?"sku":"?(SKU\d+|sku\d+)"?/gi)];
console.log('\ntitle+sku:', titleSku.length);
for (const m of titleSku.slice(0, 20)) {
  console.log(m[1], '->', m[2]);
}

// Image URLs per sku
const skuImages = new Map();
for (const m of html.matchAll(/productmedia\/(?:cameos|lifestyle|studio)\/(sku00\d{6})(?:-\d+)?\.jpg/gi)) {
  const sku = m[1].toLowerCase();
  if (!skuImages.has(sku)) skuImages.set(sku, new Set());
  skuImages.get(sku).add(m[0].replace(/\\/g, '/'));
}
console.log('\nSKUs with images:', skuImages.size);
for (const [sku, imgs] of [...skuImages.entries()].slice(0, 20)) {
  console.log(sku, [...imgs][0]);
}

// Search price patterns near luella items
const priceMatches = [...html.matchAll(/"price":(\d+)[^}]{0,200}?"name":"([^"]+)"/g)];
console.log('\nprice+name samples:');
for (const m of priceMatches.slice(0, 15)) {
  if (/luella|seater|chaise/i.test(m[2])) console.log(m[2], '£' + m[1]);
}
