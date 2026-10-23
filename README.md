# Frandeley — site de prélancement

Site Next.js pour les artistes indépendants, dans la direction visuelle « Session live ». La photographie illustre le concept ; le studio musical lui-même n'est pas disponible sur ce site.

## Lancer

```bash
npm install
cp .env.example .env.local
npm run dev
```

Renseigner `SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY` dans `.env.local` et dans l'environnement de l'hébergement. N'utiliser qu'une clé **publishable** pour les écritures publiques (jamais une clé secrète ou `service_role`). Les formulaires appellent les routes Next.js `/api/inscription` et `/api/contact`. Sans configuration, elles renvoient 503 et l'interface affiche une erreur explicite.

### Brevo

La liste des nouvelles est facultative et indépendante de la demande au pilote. Seules les personnes qui cochent cette option reçoivent un e-mail de double confirmation Brevo. Une notification transactionnelle distincte est envoyée à l'équipe pour chaque nouvelle demande au pilote ; elle ne dépend pas de la case newsletter et n'inscrit pas l'artiste à la liste.

Configuration préparée dans le compte Brevo relié : liste de contacts `2` (« Votre première liste ») et modèle DOI actif `2` (« Frandeley — confirmation des nouvelles (DOI) », tag `optin`). Le modèle contient le lien Brevo `{{ params.DOIurl }}` et redirige vers `/pilote?newsletter=confirmed` après confirmation.

Variables serveur à renseigner dans **Vercel > Project Settings > Environment Variables** :

- `BREVO_API_KEY` : clé API Brevo, type secret/encrypted, Production uniquement. Elle ne doit jamais commencer par `NEXT_PUBLIC_`, être stockée uniquement dans Supabase, ni être ajoutée au dépôt ; les routes du site tournent sur Vercel.
- `BREVO_LIST_ID=2`
- `BREVO_DOI_TEMPLATE_ID=2`
- `BREVO_SENDER_EMAIL` : adresse de l'expéditeur vérifié dans Brevo.
- `BREVO_SENDER_NAME=Frandeley`
- `BREVO_NOTIFICATION_EMAIL` : boîte de réception des alertes de nouvelles demandes au pilote.
- `NEXT_PUBLIC_SITE_URL=https://frandeley-ten.vercel.app` (si le domaine du site change, afin de générer le bon lien de confirmation).

La case des nouvelles n'apparaît qu'une fois la clé, la liste et le modèle configurés. Les notifications d'inscription au pilote ne bloquent jamais l'enregistrement Supabase si l'envoi Brevo échoue.

### Film de prélancement HyperFrames

La page d'accueil comprend un film muet de 20 secondes, encodé en H.264 720p. Le projet source réutilisable se trouve dans `hyperframes/frandeley-film` : il contient cinq scènes, les transitions GSAP, les textes et les images locales. Pour vérifier et rendre le film, exécuter `npm run check` puis `npm run render` depuis ce dossier. Le clip servi par le site est `public/videos/frandeley-prelaunch-film.mp4`. Le film et la photo de collaboration illustrent un concept en validation, pas une interface déjà disponible.

Le projet Supabase de prélancement est **frandeley-app** (`vhxglopbukdjxpnwgxir`, région `eu-west-1`). La migration `supabase/migrations/202610230001_prelaunch_forms.sql` y est appliquée : `pilot_signups` et `contact_messages` acceptent les écritures validées sans exposer les réponses en lecture publique. Ne réappliquez pas cette migration au même projet. Pour une autre base vierge, inspectez les tables avant de l'appliquer.

## Vérifications

```bash
npm run typecheck
npm run build
```

Les deux routes ont renvoyé 201 lors d'essais réels. Les écritures ont été constatées dans Supabase, puis les deux lignes de test supprimées. La lecture anonyme des deux tables renvoie 401. Aucun compte utilisateur ou produit musical n'est inclus : il s'agit seulement du site de prélancement.

## Points à finaliser pendant le prélancement

- Les candidatures et messages sont supprimés de Supabase après 12 mois par un job `pg_cron` exécuté chaque jour à 03:15 UTC. Les personnes peuvent demander une suppression plus tôt.
- Vérifier que `BREVO_API_KEY` est bien renseignée dans Vercel. Une clé configurée uniquement dans Supabase n'est pas automatiquement accessible aux routes Next.js hébergées par Vercel ; ajouter la variable serveur dans Vercel, puis redéployer.
- Pour activer les alertes de candidatures, renseigner aussi `BREVO_NOTIFICATION_EMAIL` et l'adresse expéditeur vérifiée `BREVO_SENDER_EMAIL` dans Vercel.
- Compléter le statut, l'adresse postale et les coordonnées de l'éditeur dans les mentions légales. La fiche Vercel contient son adresse postale et son contact de confidentialité ; ses coordonnées exactes doivent être revérifiées avant publication des mentions.
- `NEXT_PUBLIC_SITE_URL` vaut `https://frandeley-ten.vercel.app` par défaut. Définir cette variable dans Vercel si un domaine personnalisé remplace cette adresse. `robots.ts` autorise l'indexation en production et bloque les déploiements de prévisualisation.
- Les fonctions `/api/inscription` et `/api/contact` sont configurées dans la région Vercel Paris (`cdg1`) pour être proches des personnes visées et du stockage Supabase en Europe.
- Prévoir une limitation de débit anti-abus côté hébergement. Le champ piège et la validation actuels ne remplacent pas cette mesure.

Les médias générés sont rangés dans `public/images` et le monogramme utilise l'image de marque fournie.
