import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteConfig } from '../site.config.mjs';
import { normalizeBase, siteOrigin } from '../src/paths.mjs';
import { deploymentConfig } from '../src/deployment.mjs';

export function buildErrors(config, origin, base) {
  const errors = [];
  if (!config.editor.trim()) errors.push('Nom public de l’éditeur manquant.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)) errors.push('Adresse e-mail publique manquante ou invalide.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(config.updatedOn)) errors.push('Date de rédaction de la politique manquante.');
  try {
    if (!siteOrigin(origin)) errors.push('SITE_URL doit contenir l’origine HTTPS finale.');
  } catch (error) { errors.push(error.message); }
  try { normalizeBase(base); } catch (error) { errors.push(error.message); }
  return errors;
}

export function publicationErrors(config, origin, base = config.base) {
  const errors = buildErrors(config, origin, base);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(config.reviewedOn)) errors.push('Date de validation de la politique manquante.');
  for (const [key, value] of Object.entries(config.publication)) {
    if (value !== true) errors.push(`Validation manquante : ${key}.`);
  }
  return errors;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const publishing = process.argv.includes('--publication');
  let errors;
  try {
    const { site, base } = deploymentConfig();
    errors = (publishing ? publicationErrors : buildErrors)(siteConfig, site, base);
  } catch (error) { errors = [error.message]; }
  if (siteConfig.officialLogo && (!/^[\w/-]+\.(svg|png|webp|jpg)$/.test(siteConfig.officialLogo) || siteConfig.officialLogo.includes('..') || !existsSync(resolve('public', siteConfig.officialLogo)))) {
    errors.push('Le fichier du logo officiel est absent ou son chemin est invalide.');
  }
  if (errors.length) {
    console.error(`${publishing ? 'Publication' : 'Compilation'} bloquée :\n` + errors.map(error => `- ${error}`).join('\n'));
    process.exitCode = 1;
  }
}
