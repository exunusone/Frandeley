# Frandeley — site de prélancement

Site Next.js pour les artistes indépendants, dans la direction visuelle « Session live ». La photographie illustre le concept ; le studio musical lui-même n'est pas disponible sur ce site.

## Lancer

```bash
npm install
cp .env.example .env.local
npm run dev
```

Renseigner `SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY` dans `.env.local` et dans l'environnement de l'hébergement. N'utiliser qu'une clé **publishable** pour les écritures publiques (jamais une clé secrète ou `service_role`). Les formulaires appellent les routes Next.js `/api/inscription` et `/api/contact`. Sans configuration, elles renvoient 503 et l'interface affiche une erreur explicite.

### Resend

La liste des nouvelles est facultative et indépendante de la demande au pilote. Seules les personnes qui cochent cette option reçoivent un e-mail de double confirmation ; leur adresse est ajoutée au sujet Resend des actualités après leur clic de confirmation. Une notification transactionnelle distincte est envoyée à l'équipe pour chaque nouvelle demande au pilote ; elle ne dépend pas de la case newsletter et n'inscrit pas l'artiste à la liste.

Le sujet `Actualités FRANDELEY` existe déjà dans le compte Resend relié et utilise `opt_out` par défaut. La confirmation est vérifiée par le serveur avec un jeton signé valable 24 heures ; l’ouverture du lien seule n’abonne pas automatiquement l’adresse.

Variables serveur à renseigner dans **Vercel > Project Settings > Environment Variables** :

- `RESEND_API_KEY` : clé API Resend serveur, nécessaire à l'envoi et à la gestion des contacts. Ne pas la préfixer par `NEXT_PUBLIC_` ni la committer.
- `RESEND_FROM_EMAIL` : adresse expéditrice sur un domaine vérifié dans Resend.
- `RESEND_FROM_NAME=Frandeley`
- `RESEND_NOTIFICATION_EMAIL` : boîte de réception des alertes de nouvelles demandes au pilote.
- `RESEND_NEWSLETTER_TOPIC_ID` : identifiant du sujet Resend des actualités.
- `NEXT_PUBLIC_SITE_URL=https://frandeley-ten.vercel.app` (si le domaine du site change, afin de générer le bon lien de confirmation).

La case des nouvelles n'apparaît qu'une fois les paramètres Resend configurés. Les notifications d'inscription au pilote ne bloquent jamais l'enregistrement Supabase si l'envoi échoue.

### Film de prélancement HyperFrames

La page d'accueil comprend un film muet de 20 secondes, encodé en H.264 720p. Le projet source réutilisable se trouve dans `hyperframes/frandeley-film` : il contient cinq scènes, les transitions GSAP, les textes et les images locales. Pour vérifier et rendre le film, exécuter `npm run check` puis `npm run render` depuis ce dossier. Le clip servi par le site est `public/videos/frandeley-prelaunch-film.mp4`. Le film et la photo de collaboration illustrent un concept en validation, pas une interface déjà disponible.

Le projet Supabase de prélancement est **frandeley-app** (`vhxglopbukdjxpnwgxir`, région `eu-west-1`). Les migrations de formulaires, de conservation et de double confirmation Resend y sont appliquées : `pilot_signups` et `contact_messages` acceptent les écritures validées sans exposer les réponses en lecture publique ; les jetons de confirmation restent privés au serveur. Ne réappliquez pas ces migrations au même projet.

## Vérifications

```bash
npm run typecheck
npm run build
```

Les deux routes ont renvoyé 201 lors d'essais réels. Les écritures ont été constatées dans Supabase, puis les deux lignes de test supprimées. La lecture anonyme des deux tables renvoie 401. Aucun compte utilisateur ou produit musical n'est inclus : il s'agit seulement du site de prélancement.

## Points à finaliser pendant le prélancement

- Les candidatures et messages sont supprimés de Supabase après 12 mois par un job `pg_cron` exécuté chaque jour à 03:15 UTC. Les personnes peuvent demander une suppression plus tôt.
- Ajouter et vérifier le domaine d'envoi dans Resend, puis renseigner `RESEND_API_KEY`, `RESEND_FROM_EMAIL` et `RESEND_NEWSLETTER_TOPIC_ID` dans Vercel avant de redéployer.
- Pour activer les alertes de candidatures, renseigner aussi `RESEND_NOTIFICATION_EMAIL` dans Vercel. L'adresse expéditrice doit appartenir à un domaine vérifié dans Resend.
- Compléter le statut, l'adresse postale et les coordonnées de l'éditeur dans les mentions légales. La fiche Vercel contient son adresse postale et son contact de confidentialité ; ses coordonnées exactes doivent être revérifiées avant publication des mentions.
- `NEXT_PUBLIC_SITE_URL` vaut `https://frandeley-ten.vercel.app` par défaut. Définir cette variable dans Vercel si un domaine personnalisé remplace cette adresse. `robots.ts` autorise l'indexation en production et bloque les déploiements de prévisualisation.
- Les fonctions `/api/inscription` et `/api/contact` sont configurées dans la région Vercel Paris (`cdg1`) pour être proches des personnes visées et du stockage Supabase en Europe.
- Prévoir une limitation de débit anti-abus côté hébergement. Le champ piège et la validation actuels ne remplacent pas cette mesure.

Les médias générés sont rangés dans `public/images` et le monogramme utilise l'image de marque fournie.
