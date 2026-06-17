import fs from 'fs';

const configs = JSON.parse(fs.readFileSync('.tmp-luella-configs.json', 'utf8'));

async function ok(url) {
  try {
    const r = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
    return r.ok;
  } catch {
    return false;
  }
}

for (const c of configs) {
  const sku = c.sku;
  const lifestyle = `https://images.sofology.co.uk/productmedia/lifestyle/${sku}.jpg`;
  const cameo0 = `https://images.sofology.co.uk/productmedia/cameos/${sku}-0.jpg`;
  const scoop = c.thumb;
  const hasLife = await ok(lifestyle);
  const hasCameo = await ok(cameo0);
  const hasScoop = await ok(scoop);
  c.imageUrl = hasLife ? lifestyle : hasCameo ? cameo0 : hasScoop ? scoop : lifestyle;
  console.log(c.config.padEnd(28), hasLife ? 'life' : '-', hasCameo ? 'cameo' : '-', hasScoop ? 'scoop' : '-', '->', c.imageUrl.split('/').pop());
}

fs.writeFileSync('.tmp-luella-configs.json', JSON.stringify(configs, null, 2));
