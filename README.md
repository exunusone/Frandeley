# Frandeley — site de prélancement

Site Next.js pour les artistes indépendants, dans la direction visuelle « Session live ». La photographie illustre le concept ; le studio musical lui-même n'est pas disponible sur ce site.

## Lancer

```bash
npm install
cp .env.example .env.local
npm run dev
```

Renseigner `SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY` dans `.env.local` et dans l'environnement de l'hébergement. N'utiliser qu'une clé **publishable** (jamais une clé secrète ou `service_role`). Les formulaires appellent les routes Next.js `/api/inscription` et `/api/contact`. Sans configuration, elles renvoient 503 et l'interface affiche une erreur explicite.

Le projet Supabase de prélancement est **frandeley-app** (`vhxglopbukdjxpnwgxir`, région `eu-west-1`). La migration `supabase/migrations/202610230001_prelaunch_forms.sql` y est appliquée : `pilot_signups` et `contact_messages` acceptent les écritures validées sans exposer les réponses en lecture publique. Ne réappliquez pas cette migration au même projet. Pour une autre base vierge, inspectez les tables avant de l'appliquer.

## Vérifications

```bash
npm run typecheck
npm run build
```

Les deux routes ont renvoyé 201 lors d'essais réels. Les écritures ont été constatées dans Supabase, puis les deux lignes de test supprimées. La lecture anonyme des deux tables renvoie 401. Aucun compte utilisateur ou produit musical n'est inclus : il s'agit seulement du site de prélancement.

## Points à finaliser pendant le prélancement

- Les formulaires écrivent dans Supabase, mais aucun tableau de bord privé ni notification par e-mail n'est configuré. Prévoir un moyen sûr de lire, traiter et supprimer les demandes.
- Définir puis appliquer une durée maximale de conservation pour la liste pilote et les messages de contact.
- Compléter le statut, l'adresse postale et les coordonnées de l'éditeur dans les mentions légales. La fiche Vercel contient son adresse postale et son contact de confidentialité ; ses coordonnées exactes doivent être revérifiées avant publication des mentions.
- `NEXT_PUBLIC_SITE_URL` vaut `https://frandeley-ten.vercel.app` par défaut. Définir cette variable dans Vercel si un domaine personnalisé remplace cette adresse. `robots.ts` autorise l'indexation en production et bloque les déploiements de prévisualisation.
- Les fonctions `/api/inscription` et `/api/contact` sont configurées dans la région Vercel Paris (`cdg1`) pour être proches des personnes visées et du stockage Supabase en Europe.
- Prévoir une limitation de débit anti-abus côté hébergement. Le champ piège et la validation actuels ne remplacent pas cette mesure.

Les médias générés sont rangés dans `public/images` et le monogramme utilise l'image de marque fournie.
