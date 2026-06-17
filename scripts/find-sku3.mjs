import fs from 'fs';
const html = fs.readFileSync('.tmp-luella-full.html', 'utf8');
const indices = [];
let pos = 0;
while ((pos = html.indexOf('597374', pos)) !== -1) {
  indices.push(pos);
  pos += 6;
}
console.log('occurrences', indices.length);
for (const i of indices.slice(0, 8)) {
  console.log('---');
  console.log(html.slice(i - 120, i + 180).replace(/\s+/g, ' '));
}
