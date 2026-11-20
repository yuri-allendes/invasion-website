import fr from './fr';
import frStrings from './fr.json';
import enStrings from './en.json';
import esStrings from './es.json';
import itStrings from './it.json';
import deStrings from './de.json';
import ptStrings from './pt.json';
import { withBase } from '../paths.mjs';

export const defaultLocale = 'fr';
export const locales = ['fr', 'en', 'es', 'it', 'de', 'pt'] as const;
export type Locale = typeof locales[number];
export const translations = { fr: frStrings, en: enStrings, es: esStrings, it: itStrings, de: deStrings, pt: ptStrings };
export const messages = {
  fr: { ...fr, label: 'Français', ogLocale: 'fr_CH', skip: 'Aller au contenu', navLabel: 'Navigation principale', languageLabel: 'Langue', homeLabel: 'INVASION — accueil', footerNav: 'Navigation de pied de page', footerMotto: 'La confiance est une ressource fragile.', draft: 'Aperçu privé — politique de confidentialité et publication à valider.' },
  en: { language: 'en', label: 'English', ogLocale: 'en_GB', navigation: { home: 'The game', support: 'Support', privacy: 'Privacy' }, description: 'INVASION: a game of bluff, suspicion and betrayal among friends on Android and iOS. From 5 to 25 players and a Game Master, over a local network.', soon: 'Coming soon to mobile', skip: 'Skip to content', navLabel: 'Main navigation', languageLabel: 'Language', homeLabel: 'INVASION — home', footerNav: 'Footer navigation', footerMotto: 'Trust is a fragile resource.', draft: 'Private preview — privacy policy and publication pending approval.' },
  es: { language: 'es', label: 'Español', ogLocale: 'es_ES', navigation: { home: 'El juego', support: 'Ayuda', privacy: 'Privacidad' }, description: 'INVASION: un juego de faroles, sospechas y traición entre amigos en Android e iOS. De 5 a 25 jugadores y un director de juego, en red local.', soon: 'Próximamente en móviles', skip: 'Saltar al contenido', navLabel: 'Navegación principal', languageLabel: 'Idioma', homeLabel: 'INVASION — inicio', footerNav: 'Navegación del pie de página', footerMotto: 'La confianza es un recurso frágil.', draft: 'Vista previa privada — política de privacidad y publicación pendientes de aprobación.' },
  it: { language: 'it', label: 'Italiano', ogLocale: 'it_IT', navigation: { home: 'Il gioco', support: 'Assistenza', privacy: 'Privacy' }, description: 'INVASION: un gioco di bluff, sospetti e tradimenti tra amici su Android e iOS. Da 5 a 25 giocatori e un master, in rete locale.', soon: 'Prossimamente su mobile', skip: 'Vai al contenuto', navLabel: 'Navigazione principale', languageLabel: 'Lingua', homeLabel: 'INVASION — home', footerNav: 'Navigazione a piè di pagina', footerMotto: 'La fiducia è una risorsa fragile.', draft: 'Anteprima privata — informativa sulla privacy e pubblicazione da approvare.' },
  de: { language: 'de', label: 'Deutsch', ogLocale: 'de_CH', navigation: { home: 'Das Spiel', support: 'Hilfe', privacy: 'Datenschutz' }, description: 'INVASION: ein Spiel voller Bluff, Verdacht und Verrat unter Freunden für Android und iOS. 5 bis 25 Spieler und ein Spielleiter, im lokalen Netzwerk.', soon: 'Demnächst für Mobilgeräte', skip: 'Zum Inhalt springen', navLabel: 'Hauptnavigation', languageLabel: 'Sprache', homeLabel: 'INVASION — Startseite', footerNav: 'Navigation in der Fusszeile', footerMotto: 'Vertrauen ist eine zerbrechliche Ressource.', draft: 'Private Vorschau — Datenschutztext und Veröffentlichung noch nicht freigegeben.' },
  pt: { language: 'pt', label: 'Português', ogLocale: 'pt_PT', navigation: { home: 'O jogo', support: 'Ajuda', privacy: 'Privacidade' }, description: 'INVASION: um jogo de bluff, suspeita e traição entre amigos para Android e iOS. De 5 a 25 jogadores e um mestre de jogo, em rede local.', soon: 'Brevemente para dispositivos móveis', skip: 'Saltar para o conteúdo', navLabel: 'Navegação principal', languageLabel: 'Idioma', homeLabel: 'INVASION — início', footerNav: 'Navegação do rodapé', footerMotto: 'A confiança é um recurso frágil.', draft: 'Pré-visualização privada — política de privacidade e publicação por aprovar.' },
};

export function tr(locale: Locale, text: string): string {
  const dictionary = translations[locale];
  if (!dictionary || !Object.hasOwn(dictionary, text)) throw new Error(`Missing translation: ${locale}: ${text}`);
  return dictionary[text as keyof typeof dictionary];
}

export function localizedUrl(path = '', locale: Locale = 'fr', base = '/') {
  return withBase(`${locale === 'fr' ? '' : `${locale}/`}${path}`, base);
}
