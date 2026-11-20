export function normalizeBase(value = '/') {
  if (!/^\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]*\/?$/.test(value)) {
    throw new Error('SITE_BASE doit être un chemin comme / ou /invasion/');
  }
  return value === '/' ? '/' : `${value.replace(/\/$/, '')}/`;
}
export function withBase(path = '', base = '/') {
  if (/^(?:[a-z]+:|\/\/)/i.test(path) || path.includes('..')) {
    throw new Error('Chemin interne attendu');
  }
  return normalizeBase(base) + path.replace(/^\//, '');
}
export function siteOrigin(value) {
  if (!value) return undefined;
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SITE_URL doit être une origine HTTPS, sans sous-dossier');
  }
  return url.origin;
}
