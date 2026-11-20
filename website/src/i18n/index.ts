import fr from './fr';
import frStrings from './fr.json';
import enStrings from './en.json';
import esStrings from './es.json';
import { withBase } from '../paths.mjs';

export const defaultLocale = 'fr';
export const locales = ['fr', 'en', 'es'] as const;
export type Locale = typeof locales[number];
export const translations = { fr: frStrings, en: enStrings, es: esStrings };
export const messages = {
  fr: { ...fr, label: 'Français', ogLocale: 'fr_CH', skip: 'Aller au contenu', navLabel: 'Navigation principale', languageLabel: 'Langue', homeLabel: 'INVASION — accueil', footerNav: 'Navigation de pied de page', footerMotto: 'La confiance est une ressource fragile.', draft: 'Aperçu privé — politique de confidentialité et publication à valider.' },
  en: { language: 'en', label: 'English', ogLocale: 'en_GB', navigation: { home: 'The game', support: 'Support', privacy: 'Privacy' }, description: 'INVASION: a game of bluff, suspicion and betrayal among friends on Android and iOS. From 5 to 25 players and a Game Master, over a local network.', soon: 'Coming soon to mobile', skip: 'Skip to content', navLabel: 'Main navigation', languageLabel: 'Language', homeLabel: 'INVASION — home', footerNav: 'Footer navigation', footerMotto: 'Trust is a fragile resource.', draft: 'Private preview — privacy policy and publication pending approval.' },
  es: { language: 'es', label: 'Español', ogLocale: 'es_ES', navigation: { home: 'El juego', support: 'Ayuda', privacy: 'Privacidad' }, description: 'INVASION: un juego de faroles, sospechas y traición entre amigos en Android e iOS. De 5 a 25 jugadores y un director de juego, en red local.', soon: 'Próximamente en móviles', skip: 'Saltar al contenido', navLabel: 'Navegación principal', languageLabel: 'Idioma', homeLabel: 'INVASION — inicio', footerNav: 'Navegación del pie de página', footerMotto: 'La confianza es un recurso frágil.', draft: 'Vista previa privada — política de privacidad y publicación pendientes de aprobación.' },
};

export function tr(locale: Locale, text: string): string {
  const dictionary = translations[locale];
  if (!dictionary || !Object.hasOwn(dictionary, text)) throw new Error(`Missing translation: ${locale}: ${text}`);
  return dictionary[text as keyof typeof dictionary];
}

export function localizedUrl(path = '', locale: Locale = 'fr', base = '/') {
  return withBase(`${locale === 'fr' ? '' : `${locale}/`}${path}`, base);
}
