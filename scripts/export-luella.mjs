import fs from 'fs';

const html = fs.readFileSync('.tmp-luella-full.html', 'utf8');

// JSON-LD array
const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
const ld = JSON.parse(ldMatch[1]);
const mainProduct = Array.isArray(ld) ? ld.find((x) => x['@type'] === 'Product') : ld;
fs.writeFileSync('.tmp-luella-ld.json', JSON.stringify(mainProduct, null, 2));

// Extract variants array
const variantsStart = html.indexOf('"variants":[');
if (variantsStart === -1) throw new Error('variants not found');

let depth = 0;
let arrayStart = html.indexOf('[', variantsStart);
let arrayEnd = arrayStart;
for (let i = arrayStart; i < html.length; i++) {
  const ch = html[i];
  if (ch === '[') depth++;
  if (ch === ']') {
    depth--;
    if (depth === 0) {
      arrayEnd = i + 1;
      break;
    }
  }
}

const variants = JSON.parse(html.slice(arrayStart, arrayEnd));
console.log('Total variants:', variants.length);

// Dedupe by configuration type - pick first SKU per config (stone all over fabric as default)
const byConfig = new Map();
for (const v of variants) {
  const config = v.buildConfigurationOptionPackDescription;
  if (!byConfig.has(config)) {
    byConfig.set(config, v);
  }
}

const configs = [...byConfig.entries()].map(([config, v]) => ({
  config,
  sku: v.skuid.toLowerCase(),
  price: v.skuSalePrice || v.skuPrice,
  dimensions: v.dimensionsCopy,
  thumb: v.skuThumbImages,
  variant: v.swkVariant,
}));

configs.sort((a, b) => a.price - b.price);
console.log('\nConfigurations:');
for (const c of configs) {
  console.log(`- ${c.config}: £${c.price} | ${c.dimensions} | ${c.sku}`);
}

// Build image URLs for each unique SKU used
function imagesForSku(sku) {
  const id = sku.toLowerCase();
  return {
    lifestyle: `https://images.sofology.co.uk/productmedia/lifestyle/${id}.jpg`,
    cameos: [0, 1, 2, 3].map((n) => `https://images.sofology.co.uk/productmedia/cameos/${id}-${n}.jpg`),
    scoop: `https://images.sofology.co.uk/productmedia/scoops/${id}.png`,
  };
}

// Main 3 seater SKU from URL
const mainSku = 'sku001597374';
const heroSku = 'sku001592766'; // from JSON-LD images

// Verify images exist for key SKUs
async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
    return res.ok;
  } catch {
    return false;
  }
}

const output = {
  product: {
    name: 'Luella',
    description: mainProduct.description,
    sku: mainProduct.sku,
    priceRange: { low: mainProduct.offers.lowPrice, high: mainProduct.offers.highPrice },
    mainImages: mainProduct.image,
    lifestyleHero: `https://images.sofology.co.uk/productmedia/lifestyle/${heroSku}.jpg`,
  },
  configurations: configs,
  specs: {
    frame: 'Made from hardwood, softwood and composite wood.',
    feet: 'Metal feet in chrome or gold shades, with supporting hidden feet on selected configurations.',
    composition: 'Seats filled with foam wrapped in Dacron fibre. Back cushions are filled with fibre. Scatter cushions and bolsters are feather-filled.',
    mechanism: 'Static sofa range with no mechanisms included.',
    care: 'Follow 8 easy care tips. Use Sofology care kits for fabric cleaning. Regularly plump and vacuum with soft brush attachment.',
    guarantee: 'Lifetime structural guarantee.',
    assembly: 'Expert delivery partners install feet and any sofa glides in your preferred room.',
    delivery: 'UK mainland delivery £129 per order. 7 days a week, 7am–7pm. Handcrafted, in your home from 7 weeks.',
    finance: 'Up to 4 years 0% APR available (min spend £600).',
  },
};

// Check images for each config SKU
for (const c of configs) {
  const imgs = imagesForSku(c.sku);
  c.images = {
    lifestyle: (await checkUrl(imgs.lifestyle)) ? imgs.lifestyle : c.thumb.replace('.png', '.jpg').replace('/scoops/', '/lifestyle/'),
    scoop: c.thumb,
  };
  const cameoChecks = await Promise.all(imgs.cameos.map(async (url, i) => ((await checkUrl(url)) ? url : null)));
  c.images.cameos = cameoChecks.filter(Boolean);
  if (!c.images.cameos.length && (await checkUrl(c.images.lifestyle))) {
    c.images.cameos = [c.images.lifestyle];
  }
}

// Main gallery from hero SKU
const mainGallery = [];
for (let i = 0; i < 4; i++) {
  const url = `https://images.sofology.co.uk/productmedia/cameos/${heroSku}-${i}.jpg`;
  if (await checkUrl(url)) mainGallery.push(url);
}
if (await checkUrl(`https://images.sofology.co.uk/productmedia/lifestyle/${heroSku}.jpg`)) {
  mainGallery.push(`https://images.sofology.co.uk/productmedia/lifestyle/${heroSku}.jpg`);
}

output.mainGallery = mainGallery;
fs.writeFileSync('.tmp-luella-export.json', JSON.stringify(output, null, 2));
console.log('\nSaved .tmp-luella-export.json');
console.log('Main gallery images:', mainGallery.length);
