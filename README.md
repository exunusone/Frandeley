# Frandeley — site de prélancement

Site Next.js pour les artistes indépendants, dans la direction visuelle « Session live ». La photographie illustre le concept ; le studio musical lui-même n'est pas disponible sur ce site.

## Lancer

```bash
npm install
cp .env.example .env.local
npm run dev
```

Renseigner `SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY` dans `.env.local`. N'utiliser qu'une clé **publishable** (jamais une clé secrète ou `service_role`). Appliquer la migration `supabase/migrations/202610230001_prelaunch_forms.sql` au projet Supabase choisi, après inspection des tables et politiques déjà présentes. Les formulaires appellent les routes Next.js `/api/inscription` et `/api/contact`. Sans configuration, elles renvoient 503 et l'interface affiche une erreur explicite.

## Vérifications

```bash
npm run typecheck
npm run build
```

## Avant une ouverture publique

- Vérifier le fonctionnement réel de l'enregistrement dans Supabase et les politiques RLS.
- Ajouter un moyen de consulter et traiter les demandes reçues, ainsi qu'une procédure d'effacement et une durée maximale de conservation.
- Compléter les coordonnées administratives de l'éditeur et de l'hébergeur dans les mentions légales et la politique de confidentialité.
- Configurer `NEXT_PUBLIC_SITE_URL` avec l'URL définitive. `robots.ts` bloque volontairement l'indexation pendant la préparation.
- Prévoir une protection anti-abus à l'échelle de l'hébergement avant d'ouvrir largement les formulaires. Le champ piège et la validation actuels ne remplacent pas cette mesure.

Les médias générés sont rangés dans `public/images` et le monogramme utilise l'image de marque fournie.
