import { siteConfig } from '../site.config.mjs';
import { normalizeBase, siteOrigin } from './paths.mjs';

// Mêmes valeurs pour Astro, les contrôles de compilation et les tests.
export function deploymentConfig(env = process.env) {
  return {
    site: siteOrigin(env.SITE_URL || siteConfig.origin),
    base: normalizeBase(env.SITE_BASE || siteConfig.base),
  };
}
