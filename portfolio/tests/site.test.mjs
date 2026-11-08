import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const dist = resolve('dist');
async function files(path) {
  const result = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const name = join(path, entry.name);
    if (entry.isDirectory()) result.push(...await files(name));
    else if (name.endsWith('.html')) result.push(name);
  }
  return result;
}
const pages = await files(dist);
const documents = new Map(await Promise.all(pages.map(async path => [path, await readFile(path, 'utf8')])));
const attr = (html, name) => [...html.matchAll(new RegExp(`\\s${name}="([^"]*)"`, 'g'))].map(match => match[1]);

test('Both languages have a home, designboard and all seven case studies', () => {
  for (const lang of ['en', 'de']) {
    const local = pages.filter(path => path.startsWith(join(dist, lang)));
    assert.equal(local.length, 9);
    for (const path of local) {
      const html = documents.get(path);
      assert.match(html, new RegExp(`<html lang="${lang}"`));
      assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, path);
      const ids = attr(html, 'id');
      assert.equal(new Set(ids).size, ids.length, `Duplicate ID: ${path}`);
      for (const id of [...attr(html, 'aria-controls'), ...attr(html, 'aria-labelledby')]) {
        assert.ok(ids.includes(id), `Missing accessible target ${id} in ${path}`);
      }
      const counterpart = path.replace(`${join(dist, lang)}`, join(dist, lang === 'en' ? 'de' : 'en'));
      assert.ok(documents.has(counterpart), `Missing translation: ${path}`);
    }
  }
});

test('Every local navigation, image, script and stylesheet points to a built file', async () => {
  for (const [page, html] of documents) {
    for (const value of [...attr(html, 'href'), ...attr(html, 'src')]) {
      if (!value.startsWith('/') && !value.startsWith('#')) continue;
      const [pathname, hash] = value.split('#');
      let target = pathname ? join(dist, pathname) : page;
      if ((await stat(target)).isDirectory()) target = join(target, 'index.html');
      assert.ok((await stat(target)).isFile(), `Missing file ${value} in ${page}`);
      if (hash && target.endsWith('.html')) {
        const targetHtml = documents.get(target) ?? await readFile(target, 'utf8');
        assert.ok(attr(targetHtml, 'id').includes(hash), `Missing anchor ${value} in ${page}`);
      }
    }
  }
});

test('No eager third-party media; images have alternatives and fonts are local', () => {
  for (const [path, html] of documents) {
    assert.doesNotMatch(html, /<iframe\b/, path);
    for (const tag of html.matchAll(/<img\b[^>]*>/g)) assert.match(tag[0], /\salt="[^"]+"/, path);
    for (const src of attr(html, 'src')) assert.ok(!src.startsWith('https://'), `Unexpected external request: ${src}`);
  }
});

test('Core text and interaction palette meets WCAG AA contrast', () => {
  const luminance = hex => {
    const rgb = hex.match(/\w\w/g).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  };
  for (const [fg, bg] of [['f3f1e8','141817'],['afbab2','141817'],['f3f1e8','202723'],['afbab2','202723'],['141817','c7f464'],['ffad70','202723']]) {
    const a = luminance(fg), b = luminance(bg);
    assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05) >= 4.5, `${fg} on ${bg}`);
  }
});
