# Frandeley — site de prélancement

Site Next.js pour les artistes indépendants, dans la direction visuelle « Session live ». La photographie illustre le concept ; le studio musical lui-même n'est pas disponible sur ce site.

## Lancer

```bash
npm install
cp .env.example .env.local
npm run dev
```

Renseigner `SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY` dans `.env.local` et dans l'environnement de l'hébergement. N'utiliser qu'une clé **publishable** pour les écritures publiques (jamais une clé secrète ou `service_role`). Les formulaires appellent les routes Next.js `/api/inscription` et `/api/contact`. Sans configuration, elles renvoient 503 et l'interface affiche une erreur explicite.

### Brevo — actualités et alertes du pilote

La case d’actualités est facultative et distincte de la demande au pilote. Seules les personnes qui la cochent sont inscrites au processus de confirmation des actualités dans Brevo. Le site lance le double opt-in : l’adresse n’est ajoutée à la liste d’actualités qu’après le clic sur le lien de confirmation.

Le modèle actif **FRANDELEY — Confirmation actualités DOI** a été créé dans le compte Brevo (ID du template : `4`). Brevo le reconnaît comme modèle DOI (`doiTemplate: true`) et il utilise le lien `{{ params.DOIurl }}` requis par l’endpoint DOI. Le premier essai (ID `3`) reste actif dans le compte mais n’est pas reconnu comme DOI ; il n’est pas utilisé par le site.

Pour activer les actualités :

1. Créer une liste de contacts dédiée aux nouvelles FRANDELEY et récupérer son identifiant.
2. Utiliser un expéditeur vérifié sur un domaine détenu par Frandeley. Configurer l’authentification du domaine avant tout envoi public.
3. Ajouter `BREVO_API_KEY`, `BREVO_LIST_ID` et `BREVO_DOI_TEMPLATE_ID=4` dans l’environnement **Production** de Vercel. La clé reste côté serveur et ne doit jamais commencer par `NEXT_PUBLIC_` ni être ajoutée au dépôt.
4. Vérifier que `NEXT_PUBLIC_SITE_URL` correspond à l’adresse publique actuelle, afin que le clic de confirmation ramène à `/pilote?newsletter=confirmed`.
5. Redéployer le projet. La case d’actualités apparaît uniquement quand les trois variables serveur sont configurées.

En plus de ce processus, une notification transactionnelle séparée peut être activée avec `BREVO_API_KEY`, `BREVO_SENDER_EMAIL` (expéditeur vérifié), `BREVO_NOTIFICATION_EMAIL` (boîte qui reçoit les alertes) et, si besoin, `BREVO_SENDER_NAME`. Elle est envoyée après l’enregistrement d’une nouvelle demande pilote et contient uniquement le nom d’artiste et l’adresse e-mail. Une erreur de notification ne supprime pas la demande. Les messages de contact ne déclenchent pas cette alerte.

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
- Brevo n'est pas encore relié à l'environnement Vercel. Créer la liste dédiée, ajouter la clé API et l'identifiant de liste, puis configurer l'expéditeur vérifié et les variables de notification.
- Les alertes internes du pilote restent inactives tant que l'adresse de notification et l'expéditeur vérifié ne sont pas configurés dans Vercel.
- Compléter le statut, l'adresse postale et les coordonnées de l'éditeur dans les mentions légales. La fiche Vercel contient son adresse postale et son contact de confidentialité ; ses coordonnées exactes doivent être revérifiées avant publication des mentions.
- `NEXT_PUBLIC_SITE_URL` vaut `https://frandeley-ten.vercel.app` par défaut. Définir cette variable dans Vercel si un domaine personnalisé remplace cette adresse. `robots.ts` autorise l'indexation en production et bloque les déploiements de prévisualisation.
- Les fonctions `/api/inscription` et `/api/contact` sont configurées dans la région Vercel Paris (`cdg1`) pour être proches des personnes visées et du stockage Supabase en Europe.
- Prévoir une limitation de débit anti-abus côté hébergement. Le champ piège et la validation actuels ne remplacent pas cette mesure.

Les médias générés sont rangés dans `public/images` et le monogramme utilise l'image de marque fournie.
