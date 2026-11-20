# Audit des traitements — site INVASION

État examiné le 20 novembre 2026 : application 0.5.14 (30). Ce document est une trace technique, non un avis juridique. Il n'est pas copié dans les fichiers statiques du site.

## Sources et constats

Les chemins ci-dessous sont relatifs à la racine du dépôt Flutter.

| Sujet | Sources actuelles | Constat retenu pour le site |
| --- | --- | --- |
| Modèle commercial | `docs/INVASION_REFERENCE.md`, décision LICENCE-UNIQUE-25 ; `lib/licensing/host_license.dart` | Une licence MJ non consommable `invasion.host_license`, jusqu'à 25 joueurs, invités gratuits. Les règles historiques de double licence sont remplacées. |
| Parcours commercial réellement utilisé | `lib/app/invasion_app.dart`, `_loadCommercial` ; `lib/licensing/local_license_verifier.dart`, `OnDeviceLicenseVerifier` | Validation sur l'appareil, pas d'endpoint INVASION obligatoire. Les anciens fichiers serveur/`verified_license.dart` ne décrivent pas le parcours commercial actif. |
| Stores | `lib/licensing/store_adapter.dart`, `MobileLicenseStore` ; `ios/Runner/AppDelegate.swift`, canal `invasion/local_licenses` | Billing Google et vérification native StoreKit 2. Produits, identifiants et preuves de transaction ; disponibilité/catalogue, événements d'achat, restauration. Ne pas prétendre à une révocation immédiate hors ligne. |
| Cache des droits | `lib/licensing/license_vault.dart`, `CommercialVault` ; `local_license_verifier.dart` | Cache de preuves dans FlutterSecureStorage. Sur iOS : non synchronisable, accessible après premier déverrouillage sur cet appareil. Pas de numéro de carte traité par le jeu. |
| Données de partie et reconnexion | `lib/app/session_controller.dart`, `_client`/métadonnées, création et reprise de session ; `packages/invasion_network/lib/` | Pseudonyme, apparence, identifiants de membre/session, jeton de reconnexion ; données de jeu suivant les projections destinées au MJ et au joueur. Le MJ héberge la partie sur le LAN. Ne pas affirmer que toutes les données restent sur un appareil unique. |
| Persistance | `lib/storage/sqlite_game_store.dart`, `SqliteGameStore` ; `lib/storage/game_event_codec.dart` | SQLite : événements et métadonnées, intégrité, chiffrement des contenus sensibles dans le parcours de production. Il ne s'agit pas d'un chiffrement de tout le fichier SQLite ni d'une garantie d'effacement forensique. |
| Protection des clés | `lib/security/device_secrets.dart`, `DeviceSecrets` / `SystemSecretStorage` ; `record_cipher.dart` ; `apple_record_cipher.dart` ; `ios/Runner/AppleWebSocketTransport.swift` | Identité et clés persistées via le stockage protégé du système ; TLS pour le transport local et vérification liée à l'invitation. Les clés sont en mémoire lorsqu'elles sont utilisées. Ne pas revendiquer une protection absolue sur un appareil compromis. |
| Suppression | `lib/features/settings/local_saves_screen.dart`, `LocalSavesScreen` ; `SessionController.deleteLocalSave` | Suppression explicite hors partie : SQLite et journaux associés. Préserve les licences et clés. Pas de suppression à distance chez les autres participants. Pas de délai général d'expiration automatique identifié. |
| Préférences | `lib/app/localization/language_controller.dart`, `FileLanguageStore` | Préférence de langue dans un fichier local. |
| Caméra | `lib/features/join_session/scanner_screen.dart`, `ScannerScreen` ; `ios/Runner/Info.plist` ; manifeste Android | QR d'invitation uniquement dans le parcours examiné ; aucune écriture/upload d'image dans ce parcours. Autorisation caméra et saisie manuelle alternative. |
| Services tiers | `pubspec.yaml`, imports `lib/`, code natif Runner et transport | Pas de SDK publicitaire, Firebase, Sentry ou outil analytique trouvé. Lecteur vidéo alimenté par une ressource locale. Achats via les stores ; pas de service distant INVASION identifié dans le parcours commercial actif. Cela ne dispense pas de vérifier les options de diagnostic des consoles/OS. |
| Diagnostics | `DeviceSecrets.load` ; `lib/licensing/store_diagnostics.dart`, `StoreDiagnostic` ; `license_screen.dart` | Journal technique d'échec d'identité : étape, type et code d'erreur ; diagnostic de catalogue affiché : type, code filtré, produit manquant. Pas de collecte distante intégrée identifiée. Les logs peuvent être consultés lors d'un diagnostic local et les plateformes ont leurs propres outils. |
| Sauvegardes OS | `android/app/src/main/AndroidManifest.xml`, `allowBackup="false"` ; options Keychain non synchronisables | L'app désactive la sauvegarde Android par ce drapeau. Cela ne prouve pas à lui seul tous les comportements de transfert des fabricants. Aucune exclusion générale explicite des fichiers iOS de la sauvegarde système n'a été établie dans cette revue. Ne pas promettre « aucun cloud » ou « désinstaller efface tout ». |
| Hébergement web | GitHub Pages, prévu mais non activé | Aucune collecte applicative ajoutée au site ; GitHub déclare journaliser l'IP des visiteurs pour sa sécurité. Aucun formulaire, cookie de suivi, police ou média distant. |
| Contact | Coordonnées confirmées par le propriétaire dans ce chat | Yuri Allendes, à titre personnel, Suisse ; `support.invasion@gmail.com`. Les e-mails passent par Gmail. Rétention et procédure d'exercice des droits à définir. |

## Informations et décisions encore nécessaires

- Faire relire et approuver la politique finale, son champ territorial (Suisse/France/UE), les bases juridiques, droits et modalités d'exercice, ainsi que les coordonnées légales requises et l'autorité compétente. Ne pas inventer un représentant, une adresse postale ni une analyse de conformité.
- Déterminer le public/âge visé, les conditions pour les mineurs et les déclarations cohérentes dans les stores. Aucune date de naissance ou vérification d'âge n'a été identifiée dans le parcours examiné.
- Définir la durée de conservation des e-mails d'assistance, les accès à la boîte, le traitement des pièces jointes et des demandes de suppression.
- Vérifier les sauvegardes/transferts système sur iOS et Android et les réglages de diagnostics/statistiques dans TestFlight, App Store Connect et Play Console. Préciser leurs destinataires, leurs durées et les transferts internationaux selon les services effectivement activés.
- Destination confirmée : `https://yuri-allendes.github.io/invasion-website/`. Préparer uniquement les sources du site pour un dépôt distinct ; existence et configuration du dépôt distant non vérifiées.
- Le fichier du logo officiel autonome est facultatif ; le nom typographique existant peut être conservé. Le dépôt inspecté contient des cartes avec le nom INVASION et l'en-tête de l'app utilise un nom typographique ; aucun fichier de logo autonome n'a été trouvé. L'icône iOS 1024 contient encore le logo Flutter et n'a pas été réutilisée.

La page `/privacy/` a été raccourcie sur demande du propriétaire aux traitements effectivement identifiés, sans promesse de conservation ni déclaration juridique non vérifiée. Les questions internes ci-dessus restent dans cet audit et ne sont pas présentées comme des garanties publiques. La compilation de production fonctionne avant approbation ; `npm run check:publication` et le workflow manuel bloquent le déploiement si les validations du texte et de la publication ne sont pas présentes dans `site.config.mjs`. La date de rédaction est distincte de la date d’approbation. `noindex` est une consigne pour les moteurs de recherche, pas un contrôle d'accès : ne pas déposer le dossier `dist/` d'aperçu sur un hébergement public.

## Provenance des visuels

Le propriétaire a confirmé dans ce chat que les illustrations existantes avaient été générées pour le projet, sans copie déclarée. Cela est enregistré comme confirmation du propriétaire, sans constituer une garantie juridique indépendante.

| Copie optimisée du site | Original du projet |
| --- | --- |
| `public/media/corridor.jpg` | `assets/images/Affrontement dans le corridor futuriste.png` |
| `public/media/role-secret.jpg` | `app_store_assets/iphone_dynamic_island/02_role_secret.png` |
| `public/media/vote.jpg` | `app_store_assets/iphone_dynamic_island/03_vote.png` |

Les deux captures proviennent de l'application iOS, avec participants fictifs. Aucun QR de session n'est réutilisé. Les copies sont des JPEG optimisés proportionnellement, sans ajout de contenu visuel. Aucun nouveau logo n'a été dessiné. La mention textuelle INVASION sert de repère de navigation en attendant le logo autonome.

## Sources externes consultées

- [Astro et GitHub Pages](https://docs.astro.build/en/guides/deploy/github/) — configuration de l'origine, du sous-chemin et des Actions.
- [GitHub Pages : collecte des données et disponibilité selon le forfait](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
- [Politique Apple](https://www.apple.com/legal/privacy/fr-ww/).
- [Politique Google](https://policies.google.com/privacy?hl=fr).

Les liens documentent les services concernés, sans déduire automatiquement la conformité juridique d'INVASION.

## Validation et traductions

Le propriétaire a validé la politique et la publication le 20 novembre 2026, puis demandé les versions anglaise et espagnole et la nouvelle accroche. Les traductions reprennent les mêmes traitements et limitations, sans nouvel engagement juridique. Les validations sont enregistrées dans `site.config.mjs`.
