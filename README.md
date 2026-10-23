# Frandeley — site de prélancement

Site Next.js pour les artistes indépendants, dans la direction visuelle « Session live ». La photographie illustre le concept ; le studio musical lui-même n'est pas disponible sur ce site.

## Lancer

```bash
npm install
cp .env.example .env.local
npm run dev
```

Renseigner `SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY` dans `.env.local` et dans l'environnement de l'hébergement. N'utiliser qu'une clé **publishable** pour les écritures publiques (jamais une clé secrète ou `service_role`). Les formulaires appellent les routes Next.js `/api/inscription` et `/api/contact`. Sans configuration, elles renvoient 503 et l'interface affiche une erreur explicite.

### Resend — actualités et alertes du pilote

La rubrique « Actualités FRANDELEY » a été créée dans Resend avec l’abonnement désactivé par défaut. La case d’actualités reste facultative et distincte de la demande au pilote. Le site envoie un e-mail de confirmation uniquement si la personne coche cette case ; un clic supplémentaire sur une page du site confirme ensuite l’inscription. Le lien expire dans 24 à 48 heures, et l’adresse n’est ajoutée à la rubrique qu’après confirmation.

Pour activer les actualités en production :

1. Ajouter à Resend un domaine détenu par Frandeley et terminer sa vérification DNS avant tout envoi public. Utiliser une adresse d’expéditeur sur ce domaine.
2. Créer une clé API serveur dédiée avec accès complet (`full_access`) : le site envoie des e-mails et gère les contacts ainsi que leur abonnement à une rubrique. La garder dans une variable serveur Vercel ; ne jamais la placer dans une variable `NEXT_PUBLIC_*` ni dans le dépôt.
3. Ajouter `RESEND_API_KEY`, `RESEND_FROM_EMAIL` et l’identifiant de la rubrique `RESEND_NEWSLETTER_TOPIC_ID` dans l’environnement **Production** de Vercel. `RESEND_FROM_NAME` est facultatif.
4. Vérifier que `NEXT_PUBLIC_SITE_URL` correspond à l’adresse publique actuelle, afin que le lien de confirmation renvoie vers le bon site.
5. Redéployer. La case d’actualités n’apparaît que lorsque la clé, l’adresse d’expéditeur et l’identifiant de rubrique sont configurés.

Une notification transactionnelle séparée peut être activée avec `RESEND_API_KEY`, `RESEND_FROM_EMAIL` et `RESEND_NOTIFICATION_EMAIL`. Elle est envoyée après l’enregistrement d’une nouvelle demande pilote et contient le nom d’artiste et l’adresse e-mail. Une erreur de notification ne supprime pas la demande. Les messages de contact ne déclenchent pas cette alerte. Aucun e-mail d’essai ou de campagne n’est envoyé pendant la configuration.

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
- La rubrique Resend « Actualités FRANDELEY » est créée. L’envoi reste inactif jusqu’à la vérification d’un domaine d’expéditeur et à l’ajout de la clé API et de l’adresse d’expéditeur dans Vercel.
- Les alertes internes du pilote restent inactives tant que l'adresse de notification et l'expéditeur vérifié ne sont pas configurés dans Vercel.
- Compléter le statut, l'adresse postale et les coordonnées de l'éditeur dans les mentions légales. La fiche Vercel contient son adresse postale et son contact de confidentialité ; ses coordonnées exactes doivent être revérifiées avant publication des mentions.
- `NEXT_PUBLIC_SITE_URL` vaut `https://frandeley-ten.vercel.app` par défaut. Définir cette variable dans Vercel si un domaine personnalisé remplace cette adresse. `robots.ts` autorise l'indexation en production et bloque les déploiements de prévisualisation.
- Les fonctions `/api/inscription` et `/api/contact` sont configurées dans la région Vercel Paris (`cdg1`) pour être proches des personnes visées et du stockage Supabase en Europe.
- Prévoir une limitation de débit anti-abus côté hébergement. Le champ piège et la validation actuels ne remplacent pas cette mesure.

Les médias générés sont rangés dans `public/images` et le monogramme utilise l'image de marque fournie.
