# Frandeley — site de prélancement

Site Next.js pour les artistes indépendants, dans la direction visuelle « Session live ». La photographie illustre le concept ; le studio musical lui-même n'est pas disponible sur ce site.

## Lancer

```bash
npm install
cp .env.example .env.local
npm run dev
```

Renseigner `SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY` dans `.env.local` et dans l'environnement de l'hébergement. N'utiliser qu'une clé **publishable** pour les écritures publiques (jamais une clé secrète ou `service_role`). Les formulaires appellent les routes Next.js `/api/inscription` et `/api/contact`. Sans configuration, elles renvoient 503 et l'interface affiche une erreur explicite.

### Mailchimp

La liste d'actualités est facultative et indépendante de la demande au pilote. Seules les personnes qui cochent cette option sont envoyées à Mailchimp, avec le statut `pending` afin qu'elles confirment leur adresse avant abonnement. La clé API est utilisée uniquement côté serveur.

Pour activer l'option :

1. Créer ou choisir une audience Mailchimp et activer le **double opt-in** pour les inscriptions provenant de l'intégration.
2. Dans les paramètres de cette audience, activer les notifications d'abonnement et indiquer l'adresse qui doit les recevoir.
3. Ajouter `MAILCHIMP_API_KEY` et `MAILCHIMP_AUDIENCE_ID` dans les variables **Production** de Vercel. La clé API Mailchimp ne doit jamais commencer par `NEXT_PUBLIC_` ni être ajoutée au dépôt.
4. Redéployer le projet. La case facultative ne s'affiche que lorsque les deux variables sont configurées.

Mailchimp n'enverra une notification d'abonnement via l'intégration qu'après confirmation par la personne; cela ne signale pas les candidatures au pilote dont l'auteur n'a pas choisi les nouvelles par e-mail. Une notification distincte pour chaque candidature nécessite un canal transactionnel séparé.

Le projet Supabase de prélancement est **frandeley-app** (`vhxglopbukdjxpnwgxir`, région `eu-west-1`). La migration `supabase/migrations/202610230001_prelaunch_forms.sql` y est appliquée : `pilot_signups` et `contact_messages` acceptent les écritures validées sans exposer les réponses en lecture publique. Ne réappliquez pas cette migration au même projet. Pour une autre base vierge, inspectez les tables avant de l'appliquer.

## Vérifications

```bash
npm run typecheck
npm run build
```

Les deux routes ont renvoyé 201 lors d'essais réels. Les écritures ont été constatées dans Supabase, puis les deux lignes de test supprimées. La lecture anonyme des deux tables renvoie 401. Aucun compte utilisateur ou produit musical n'est inclus : il s'agit seulement du site de prélancement.

## Points à finaliser pendant le prélancement

- Les candidatures et messages sont supprimés de Supabase après 12 mois par un job `pg_cron` exécuté chaque jour à 03:15 UTC. Les personnes peuvent demander une suppression plus tôt.
- Mailchimp n'est pas encore connecté à l'environnement Vercel : la liste d'actualités reste masquée jusqu'à l'ajout de la clé API et de l'identifiant d'audience. Les paramètres de double opt-in et l'adresse de notification doivent être activés dans l'audience Mailchimp.
- Les inscriptions au pilote ne produisent pas de notification interne lorsque la case facultative Mailchimp n'est pas cochée. Un canal transactionnel séparé est nécessaire pour recevoir un e-mail pour chaque candidature.
- Compléter le statut, l'adresse postale et les coordonnées de l'éditeur dans les mentions légales. La fiche Vercel contient son adresse postale et son contact de confidentialité ; ses coordonnées exactes doivent être revérifiées avant publication des mentions.
- `NEXT_PUBLIC_SITE_URL` vaut `https://frandeley-ten.vercel.app` par défaut. Définir cette variable dans Vercel si un domaine personnalisé remplace cette adresse. `robots.ts` autorise l'indexation en production et bloque les déploiements de prévisualisation.
- Les fonctions `/api/inscription` et `/api/contact` sont configurées dans la région Vercel Paris (`cdg1`) pour être proches des personnes visées et du stockage Supabase en Europe.
- Prévoir une limitation de débit anti-abus côté hébergement. Le champ piège et la validation actuels ne remplacent pas cette mesure.

Les médias générés sont rangés dans `public/images` et le monogramme utilise l'image de marque fournie.
