import fs from 'fs';

const html = fs.readFileSync('.tmp-luella-full.html', 'utf8');

// Extract variants JSON block
const variantsIdx = html.indexOf('"variants"');
const chunk = html.slice(variantsIdx - 100, variantsIdx + 50000);

// Try to find JSON object containing variants
const start = html.lastIndexOf('{', variantsIdx);
let depth = 0;
let end = variantsIdx;
for (let i = variantsIdx; i < html.length; i++) {
  if (html[i] === '{') depth++;
  if (html[i] === '}') {
    depth--;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }
}

// Better approach: regex for product config objects
const configs = [...html.matchAll(/\{"sku":"(SKU\d+)"[^}]*?"name":"([^"]+)"[^}]*?"skuPrice":(\d+)[^}]*?"dimensionsCopy":"([^"]+)"[^}]*?\}/gi)];
console.log('config objects (simple):', configs.length);

// More flexible - extract all objects with skuPrice and name containing Seater
const blocks = [...html.matchAll(/"name":"(Luella [^"]+|[^"]*Seater[^"]*|[^"]*Chaise[^"]*|[^"]*Corner[^"]*|[^"]*Loveseat[^"]*|[^"]*Armchair[^"]*|[^"]*Footstool[^"]*|[^"]*Pouffe[^"]*)"[^}]{0,800}?"sku":"(SKU\d+)"[^}]{0,200}?"skuPrice":(\d+)[^}]{0,200}?"dimensionsCopy":"([^"]+)"/gi)];

const unique = new Map();
for (const m of blocks) {
  const name = m[1];
  const sku = m[2].toLowerCase();
  const price = Number(m[3]);
  const dims = m[4];
  const key = name.replace(/^Luella /, '');
  if (!unique.has(key) || unique.get(key).price > price) {
    unique.set(key, { name: key, sku, price, dims });
  }
}

console.log('\nUnique configurations:', unique.size);
for (const [k, v] of unique) {
  console.log(`${k} | £${v.price} | ${v.dims} | ${v.sku}`);
}

// Also try reverse order sku before name
const blocks2 = [...html.matchAll(/"sku":"(SKU\d+)"[^}]{0,400}?"name":"(Luella [^"]+|[^"]*Seater[^"]*)"[^}]{0,400}?"skuPrice":(\d+)[^}]{0,200}?"dimensionsCopy":"([^"]+)"/gi)];
for (const m of blocks2) {
  const name = m[2].replace(/^Luella /, '');
  const sku = m[1].toLowerCase();
  const price = Number(m[3]);
  const dims = m[4];
  if (!unique.has(name)) {
    unique.set(name, { name, sku, price, dims });
  }
}

console.log('\nAfter reverse pass:', unique.size);
for (const [k, v] of unique) {
  console.log(`${k} | £${v.price} | ${v.dims} | ${v.sku}`);
}

// Save for use
fs.writeFileSync('.tmp-luella-configs.json', JSON.stringify([...unique.values()], null, 2));

// Get main product description from JSON-LD
const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (ld) {
  const data = JSON.parse(ld[1]);
  fs.writeFileSync('.tmp-luella-ld.json', JSON.stringify(data, null, 2));
  console.log('\nDescription:', data.description?.slice(0, 200));
  console.log('SKU:', data.sku);
  console.log('Price range:', data.offers?.lowPrice, '-', data.offers?.highPrice);
  console.log('Images:', data.image?.length);
}

// Find review data
const reviewBlocks = [...html.matchAll(/"reviewBody":"([^"]+)"[^}]{0,200}?"author":"([^"]+)"[^}]{0,100}?"ratingValue":(\d)/g)];
console.log('\nReviews found:', reviewBlocks.length);
for (const m of reviewBlocks.slice(0, 5)) {
  console.log(`- ${m[2]} (${m[3]}*): ${m[1].slice(0, 80)}`);
}

// aggregateRating
const rating = html.match(/"aggregateRating":\{[^}]+\}/);
if (rating) console.log('\n', rating[0]);
