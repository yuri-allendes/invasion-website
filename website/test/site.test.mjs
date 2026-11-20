import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { normalizeBase, withBase, siteOrigin } from '../src/paths.mjs';
import { buildErrors, publicationErrors } from '../scripts/check-publication.mjs';
import { deploymentConfig } from '../src/deployment.mjs';
import { siteConfig } from '../site.config.mjs';

const { site, base } = deploymentConfig();
const routes = ['', 'privacy/', 'support/', 'en/', 'en/privacy/', 'en/support/', 'es/', 'es/privacy/', 'es/support/'];
const html = route => readFileSync(resolve('dist', route, 'index.html'), 'utf8');

test('les neuf pages statiques sont complètes et accessibles sans JavaScript', () => {
  for (const route of routes) {
    const page = html(route);
    const locale = route.startsWith('en/') ? 'en' : route.startsWith('es/') ? 'es' : 'fr';
    assert.ok(page.includes(`<html lang="${locale}">`));
    assert.equal((page.match(/<h1(?:\s|>)/g) || []).length, 1);
    assert.match(page, /<main id="contenu">/);
    assert.match(page, /class="skip-link" href="#contenu"/);
    assert.match(page, /aria-current="page"/);
    assert.match(page, /<meta name="description"/);
    assert.match(page, /property="og:title"/);
    assert.ok(page.includes(`rel="canonical" href="${site}${base}${route}"`));
    assert.ok(page.includes(`property="og:image" content="${site}${base}media/corridor.jpg"`));
    assert.doesNotMatch(page, /<script|<iframe|<form|fonts\.google|googletagmanager|google-analytics/i);
    if (!siteConfig.publication.privacyReviewed) assert.match(page, /noindex,nofollow/);
    for (const match of page.matchAll(/<img\b[^>]*>/g)) {
      assert.match(match[0], /alt="[^\"]+"/);
      assert.match(match[0], /width="\d+"/);
      assert.match(match[0], /height="\d+"/);
    }
  }
});

test('chaque lien, ancre et ressource locale résout un fichier existant avec le bon préfixe', () => {
  for (const route of routes) {
    const page = html(route);
    for (const [, reference] of page.matchAll(/(?:href|src)="([^\"]+)"/g)) {
      if (/^(?:https:|mailto:)/.test(reference)) continue;
      if (reference.startsWith('#')) {
        assert.ok(page.includes(`id="${reference.slice(1)}"`), `Ancre absente : ${reference}`);
        continue;
      }
      assert.ok(reference.startsWith(base), `Mauvais préfixe : ${reference}`);
      const [path, fragment] = reference.slice(base.length).split('#');
      let file = resolve('dist', decodeURIComponent(path));
      assert.ok(existsSync(file), `Fichier absent : ${reference}`);
      if (statSync(file).isDirectory()) file = resolve(file, 'index.html');
      assert.ok(existsSync(file), `Page absente : ${reference}`);
      if (fragment) assert.ok(readFileSync(file, 'utf8').includes(`id="${fragment}"`));
    }
  }
});

test('les stores ne proposent aucun téléchargement et le contact utilise la configuration', () => {
  const home = html('');
  assert.equal((home.match(/class="store-badge" aria-disabled="true"/g) || []).length, 2);
  assert.doesNotMatch(home, /href="https:\/\/(?:apps\.apple\.com|play\.google\.com)/);
  assert.match(html('support/'), new RegExp(`mailto:${siteConfig.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  assert.match(home, /5–25/);
  assert.doesNotMatch(home, /jusqu’à 15|deux licences|host_extension/);
});

test('la publication reste bloquée tant que les validations manquent', () => {
  assert.ok(publicationErrors(siteConfig, undefined).length > 0);
  const complete = { ...siteConfig, reviewedOn: '2026-11-20', publication: Object.fromEntries(Object.keys(siteConfig.publication).map(k => [k, true])) };
  assert.deepEqual(publicationErrors(complete, 'https://example.org'), []);
  for (const key of Object.keys(complete.publication)) {
    assert.ok(publicationErrors({ ...complete, publication: { ...complete.publication, [key]: false } }, 'https://example.org').length > 0);
  }
  assert.ok(publicationErrors({ ...complete, email: '' }, 'https://example.org').length > 0);
  assert.ok(publicationErrors(complete, 'http://example.org').length > 0);
});

test('la compilation de production peut précéder l’autorisation de publication', () => {
  assert.deepEqual(buildErrors(siteConfig, site, base), []);
  assert.deepEqual(publicationErrors(siteConfig, site, base), []);
  assert.ok(publicationErrors({ ...siteConfig, publication: { ...siteConfig.publication, publicationApproved: false } }, site, base).length > 0);
  assert.deepEqual(deploymentConfig({}), { site: 'https://yuri-allendes.github.io', base: '/invasion-website/' });
  assert.deepEqual(deploymentConfig({ SITE_BASE: '/' }), { site: 'https://yuri-allendes.github.io', base: '/' });
  assert.ok(buildErrors(siteConfig, 'http://example.org', base).length > 0);
  assert.ok(buildErrors(siteConfig, site, '//autre-site/').length > 0);
});

test('la politique reste concise et décrit les traitements sans garanties absolues', () => {
  const page = html('privacy/');
  assert.match(page, /sans compte utilisateur INVASION obligatoire et sans serveur de jeu INVASION/);
  for (const text of ['pseudonyme', 'rôles, actions, votes', 'échangées entre les appareils participants', 'trousseau', 'caméra', 'justificatifs de transaction', 'Gmail']) assert.ok(page.includes(text), text);
  assert.doesNotMatch(page, /aucune donnée personnelle|aucune sauvegarde cloud|suppression absolue|jours après|bases juridiques applicables/);
  const article = page.split('<article class="prose">')[1].split('</article>')[0];
  assert.ok(article.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length < 650);
});

test('les chemins fonctionnent à la racine et dans un dépôt GitHub Pages', () => {
  assert.equal(withBase('privacy/', '/'), '/privacy/');
  assert.equal(withBase('privacy/', '/invasion'), '/invasion/privacy/');
  assert.equal(withBase('media/corridor.jpg', '/invasion/'), '/invasion/media/corridor.jpg');
  assert.throws(() => withBase('https://autre-site.test'));
  assert.throws(() => withBase('../secret'));
  assert.throws(() => normalizeBase('//autre-site/'));
  assert.throws(() => siteOrigin('https://example.org/invasion'));
});

test('le texte des boutons rouges conserve un contraste suffisant', () => {
  const css = readFileSync('src/styles/global.css', 'utf8');
  const luminance = hex => {
    const [r, g, b] = hex.match(/../g).map(x => parseInt(x, 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return r * 0.2126 + g * 0.7152 + b * 0.0722;
  };
  const normal = css.match(/--red:\s*#([\da-f]{6})/i)[1];
  const hover = css.match(/\.primary:hover\s*\{\s*background:\s*#([\da-f]{6})/i)[1];
  for (const color of [normal, hover]) assert.ok(1.05 / (luminance(color) + 0.05) >= 4.5);
});


test('les trois langues couvrent tous les textes et chaque page propose ses traductions', () => {
  const dictionaries = Object.fromEntries(['fr','en','es'].map(code => [code, JSON.parse(readFileSync(`src/i18n/${code}.json`, 'utf8'))]));
  for (const locale of ['en','es']) {
    assert.deepEqual(Object.keys(dictionaries[locale]).sort(), Object.keys(dictionaries.fr).sort());
    assert.ok(Object.values(dictionaries[locale]).every(text => text.trim().length > 0));
  }
  for (const route of routes) {
    const page = html(route);
    const section = route.replace(/^(en|es)\//, '');
    for (const locale of ['fr','en','es']) {
      const target = `${base}${locale === 'fr' ? '' : `${locale}/`}${section}`;
      assert.ok(page.includes(`hreflang="${locale}" href="${site}${target}"`));
      assert.ok(page.includes(`href="${target}" lang="${locale}"`));
    }
    assert.doesNotMatch(page, /noindex|Texte préparé pour validation|Private preview|Vista previa privada/);
  }
  for (const locale of ['fr','en','es']) {
    const prefix = locale === 'fr' ? '' : `${locale}/`;
    const text = dictionaries[locale][' Un jeu de bluff, de suspicion et de trahison entre amis'].trim();
    assert.ok(html(prefix).includes(text));
  }
});
