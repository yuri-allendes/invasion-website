# Site officiel INVASION

Site Astro statique, indépendant de Flutter : accueil, confidentialité et assistance, en français, anglais et espagnol. Sans backend, service analytique, cookie publicitaire ou formulaire de collecte. Aucun lien de téléchargement actif. Aucun déploiement effectué.

Adresse de publication préparée : **https://yuri-allendes.github.io/invasion-website/**.

## Lancer et vérifier sur macOS

Prérequis : Node.js ≥ 22.23.4, npm, Git. Les dépendances sont verrouillées dans `package-lock.json`.

```sh
cd ~/Developer/INVASION/website
npm ci
npm run build:release
npm test
npm run preview
```

Ouvrir **http://127.0.0.1:4321/invasion-website/**. L'aperçu doit utiliser le sous-chemin, comme le site final. Pour modifier les sources avec rechargement : `npm run dev`, à la même adresse. Arrêter avec Ctrl+C si le serveur occupe le terminal, sinon `npm run stop:preview` ou `npm run stop:dev`.

Les scripts désactivent la télémétrie de compilation Astro. Les pages produites n'envoient aucun JavaScript au navigateur. `dist/`, `.astro/` et `node_modules/` ne sont pas versionnés.

## Compilation et publication sont deux étapes distinctes

- `npm run build:release` vérifie les coordonnées et la configuration technique, puis génère la sortie de production statique. Cette commande ne publie rien et ne vaut pas approbation de la politique.
- `npm run check:publication` exige en plus la validation de la politique (`privacyReviewed`, avec `reviewedOn`) et l'accord explicite de publication (`publicationApproved`). **Ces validations ont été confirmées par le propriétaire le 20 novembre 2026.**
- Tant que l'accord n'est pas donné, le site affiche un bandeau d'aperçu et `noindex,nofollow`. Ces indications ne sont pas un contrôle d'accès : conserver la sortie en local.
- Le workflow manuel exécute le contrôle de publication avant de compiler et de déployer. Aucun push ne déclenche de déploiement.

## Configuration GitHub Pages

Valeurs effectives par défaut, dans `site.config.mjs` :

```js
origin: 'https://yuri-allendes.github.io',
base: '/invasion-website/',
```

`astro.config.mjs`, les contrôles et les tests utilisent tous `src/deployment.mjs`. Les liens internes, médias, URL canoniques et métadonnées Open Graph utilisent ce préfixe. La sortie contient :

```text
dist/index.html
dist/privacy/index.html
dist/support/index.html
```

URL prévues pour les stores, après déploiement et vérification seulement :

```text
https://yuri-allendes.github.io/invasion-website/
https://yuri-allendes.github.io/invasion-website/privacy/
https://yuri-allendes.github.io/invasion-website/support/
```

Aucune variable d'environnement n'est nécessaire pour cette destination. Les anciens `SITE_URL` / `SITE_BASE` exportés dans votre terminal peuvent cependant remplacer les valeurs par défaut : utiliser `unset SITE_URL SITE_BASE` pour les retirer. Pour tester à la racine :

```sh
cd ~/Developer/INVASION/website
SITE_BASE=/ npm run build:release
SITE_BASE=/ npm test
```

Recompiler sans cette variable pour rétablir la sortie GitHub Pages. Si vous prévisualisez un build alternatif, passer les mêmes variables à `npm run preview`.

## Contenu et ressources

- `src/pages/` : neuf routes statiques (trois pages par langue). Le français reste à la racine, l’anglais sous `en/`, l’espagnol sous `es/`. Les gabarits partagés sont dans `src/components/`. La politique reste fondée sur les traitements constatés, sans durée de conservation ou garantie juridique inventée.
- `docs/PRIVACY_AUDIT.md` : sources de l'audit, détails internes et points non vérifiés. Ce document n'est pas servi par le site.
- `site.config.mjs` : Yuri Allendes, Suisse, `support.invasion@gmail.com`, date de rédaction et validations. Ne pas y placer de secret.
- `src/layouts/Shell.astro` et `src/styles/global.css` : navigation, pied de page, métadonnées, responsive, focus clavier et réduction des mouvements.
- `src/i18n/` : dictionnaires complets `fr.json`, `en.json`, `es.json` et métadonnées communes dans `index.ts`. Les clés françaises servent de référence ; chaque nouvelle chaîne doit avoir ses trois traductions. Une chaîne manquante bloque la compilation. Le sélecteur conserve le type de page et les balises `hreflang` relient ses traductions. Pour une langue supplémentaire, ajouter son dictionnaire, ses métadonnées et ses trois routes, puis étendre les tests.
- `public/media/` : illustration d'accueil et deux captures iOS optimisées, issues du projet, participants fictifs. Confirmation du propriétaire sur leur provenance consignée dans l'audit.

Le nom typographique INVASION reste utilisé. Un logo autonome peut être ajouté ultérieurement via `officialLogo` ; il est facultatif pour compiler et publier, et aucun nouveau logo n'est inventé. Les emplacements App Store et Google Play restent non cliquables tant que leurs liens publics ne sont pas confirmés.

## Préparer le dépôt public sans exposer Flutter

Le dépôt cible doit s'appeler **invasion-website**, dans le compte **yuri-allendes**. Son existence, ses droits et ses réglages distants ne sont pas vérifiés par cette préparation locale.

Conserver la structure `website/` avec le workflow à la racine `.github/workflows/website-pages.yml`. Pour exporter seulement ces sources après le commit local :

```sh
cd ~/Developer/INVASION
export INVASION_SITE_EXPORT="$(mktemp -d /tmp/invasion-website.XXXXXX)"
git archive HEAD website .github/workflows/website-pages.yml | tar -x -C "$INVASION_SITE_EXPORT"
open "$INVASION_SITE_EXPORT"
```

Ne pas rendre le dépôt Flutter public pour héberger ce site. Ne pas copier les clés, builds ou ressources mobiles supplémentaires. Les commandes d'export ne créent pas de dépôt distant et ne poussent rien.

## Déployer uniquement après confirmation

1. Faire valider par le propriétaire le texte de confidentialité et la publication. Renseigner alors seulement `privacyReviewed`, `reviewedOn` et `publicationApproved` dans `site.config.mjs`. La date `updatedOn` correspond à la rédaction, pas à cette approbation.
2. Reporter les sources validées et le workflow dans le dépôt `yuri-allendes/invasion-website`, sur sa branche par défaut. Les opérations distantes nécessitent la confirmation du propriétaire.
3. Dans **Settings → Pages**, sélectionner **GitHub Actions** comme source. Vérifier les permissions du dépôt, puis **Enforce HTTPS**. Le workflow fixe déjà l'origine et le sous-chemin corrects ; aucune clé ni variable de store n'est nécessaire.
4. Si disponible, protéger l'environnement **github-pages** avec une approbation et une restriction de branche.
5. Dans **Actions → Site INVASION — publication manuelle → Run workflow**, sélectionner la version approuvée et saisir `PUBLIER`.
6. Le workflow contrôle l'autorisation, compile, teste et déploie uniquement le site statique. Attendre son succès puis vérifier les trois URL, les images et le contact sur ordinateur et mobile avant de les renseigner dans les stores.

Aucune publication GitHub n'a été exécutée ici. La compilation locale ne prouve ni l'existence du dépôt distant ni le succès d'un déploiement Pages.

## Points restant à valider

- Validation du texte et de la publication donnée par le propriétaire le 20 novembre 2026. Les contrôles continuent à interdire une publication si l’une de ces validations est retirée.
- Côté GitHub : dépôt cible, accès, configuration Pages/Actions, HTTPS et disponibilité réelle des URL, à vérifier lors du déploiement autorisé.
- Hors constat du code : réglages de diagnostics des consoles, portée réelle des sauvegardes/transferts système, gestion des e-mails d'assistance et éventuelles mentions légales selon le public visé. Aucune durée ou conformité juridique n'est déduite de cet audit technique. Ces points restent documentés dans l'audit ; le site ne leur attribue pas de garantie non vérifiée.

## Nouvelle version et dépannage

Après une modification : `npm run build:release`, `npm test`, revue visuelle, commit ciblé, puis contrôle et déploiement manuel seulement après accord. Relire la politique si les traitements de l'application changent.

- 404 de pages ou médias : vérifier l'utilisation de `/invasion-website/`, la casse, et les éventuelles variables d'environnement héritées.
- Build bloqué : vérifier Node, les coordonnées et la configuration signalées. Un logo fourni mais absent ou avec un chemin invalide bloque aussi la compilation.
- Publication bloquée : lire les validations manquantes ; ne pas publier directement `dist/` pour contourner l'accord demandé.
- Workflow absent : il doit rester à la racine Git, pas dans `website/.github/`.

Les tests vérifient les trois pages, les liens/ancres/médias, les métadonnées, le préfixe GitHub Pages, les textes de confidentialité essentiels, l'absence de collecte ajoutée, les stores inactifs, le contraste des boutons et le contrôle d'autorisation. Ils ne certifient pas la conformité juridique ou WCAG complète.

## Version multilingue — 20 novembre 2026

Nouvelle accroche : « Un jeu de bluff, de suspicion et de trahison entre amis ». Les neuf routes sont compilées et couvertes par les tests : liens internes, médias partagés, texte alternatif, métadonnées, navigation et sélecteur conservant la page. Aucun JavaScript côté navigateur ni redirection automatique selon la langue. Les captures iOS restent les illustrations authentiques de l’application, dans leur langue d’origine.

La destination française reste `https://yuri-allendes.github.io/invasion-website/`, l’anglais est sous `en/` et l’espagnol sous `es/`. Les URL de confidentialité et d’assistance restent disponibles en français pour les stores ; leurs traductions existent aussi dans chaque sous-dossier.
