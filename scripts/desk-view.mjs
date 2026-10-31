import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { dirname, join, resolve } from 'path';

const root = resolve(import.meta.dirname, '..');
const buildDir = join(root, 'build');
const needle = '4471-two-problems';

function walk(dir, hit = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, hit);
    else if (name.endsWith('.html') && path.includes(needle)) hit.push(path);
  }
  return hit;
}

const [page] = walk(buildDir);
if (!page) throw new Error('built page not found: ' + needle);

let html = readFileSync(page, 'utf8');
const hrefs = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map((m) => m[0]);
for (const tag of hrefs) {
  const href = tag.match(/href="([^"]+)"/)?.[1];
  if (!href) continue;
  const file = href.startsWith('/') ? join(buildDir, href.slice(1)) : resolve(dirname(page), href);
  const css = readFileSync(file, 'utf8');
  html = html.replace(tag, () => `<style>\n${css}\n</style>`);
}

const outDir = join(root, 'desk-view');
mkdirSync(outDir, { recursive: true });
const out = join(outDir, '4471-two-problems.html');
writeFileSync(out, html);
console.log('desk view', out, 'bytes', Buffer.byteLength(html));
