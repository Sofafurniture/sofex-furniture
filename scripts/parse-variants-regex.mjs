import fs from 'fs';

const html = fs.readFileSync('.tmp-luella-full.html', 'utf8');

const variantRegex =
  /\{"buildConfigurationOptionPackDescription":"([^"]+)","dimensionsCopy":"([^"]+)","leadTimeInDays":\d+,"leadTimeCopy":"[^"]+","skuPrice":(\d+),"skuSalePrice":(\d+),"skuThumbImages":"([^"]+)","skuid":"(SKU\d+)","swkVariant":"([^"]+)"\}/g;

const variants = [...html.matchAll(variantRegex)].map((m) => ({
  config: m[1],
  dimensions: m[2],
  price: Number(m[4]) || Number(m[3]),
  thumb: m[5],
  sku: m[6].toLowerCase(),
  variant: m[7],
}));

console.log('Variants matched:', variants.length);

const byConfig = new Map();
for (const v of variants) {
  if (!byConfig.has(v.config)) byConfig.set(v.config, v);
}

const configs = [...byConfig.values()].sort((a, b) => a.price - b.price);
console.log('\nUnique configs:');
for (const c of configs) {
  console.log(`${c.config} | £${c.price} | ${c.dimensions} | ${c.sku}`);
}

fs.writeFileSync('.tmp-luella-configs.json', JSON.stringify(configs, null, 2));
