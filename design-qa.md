# Design QA — Frandeley Session live

- Source visual truth: `../generated_images/exec-9bb5e648-0705-4882-a348-669a6936176f.png` (793 × 1983 px, selected concept 2).
- Implementation: `http://terminal.local:4173/`, cloud browser tab capture in this build session. The browser did not expose a local screenshot path.
- Desktop viewport: 1363 × 936 CSS px, browser density not reported. Source is a tall 793 px wide concept; region comparison was qualitative after proportional scaling, not a pixel overlay.
- State: default landing page, FAQ expanded, pilot form before and after a test submission.

## Visual comparison

The first viewport follows the chosen composition: a dark studio photograph with musician on the right, large three-line white headline on the left, electric-blue CTA and a waveform rail. The phone-to-web section, three photographic steps, notebook scene and split pilot panel follow the same order and palette. The implementation uses standalone generated photos, including device imagery, instead of cropping the design board. The supplied Frandeley mark is used with a dark-header filter.

Typography: bold compact sans-serif, scale and line breaks match the concept's hierarchy. Spacing: generous black bands and three-column steps follow the board, though viewport proportions differ. Colors: near-black, white and electric blue are consistent. Images: all principal subjects and crops are present at desktop. Copy: the headline is preserved; supporting text was updated to describe a concept and pilot accurately. Focused checks of the header and signup panel showed legible controls and no observed clipping at desktop.

## Findings and comparison history

1. **P0, form without client hydration (initial capture).** A pilot submission navigated with the entered e-mail in the URL, exposing it in browser history. Fix: added native POST actions and server redirects; the payload is now sent in the request body. A production-server test of the native form returned 303 to `?status=envoye` with no e-mail in the URL; its test row was removed. **Post-fix browser confirmation is blocked** by the cloud browser URL policy, so the visual design gate remains blocked.
2. **P1, Supabase enrollment resolved.** A new free `frandeley-app` project was created in the selected organization because the older Frandeley project was inaccessible. The two-table schema is applied with RLS. Both routes returned 201 in a local production server test; the rows were confirmed in Supabase and removed. Anonymous table reads returned 401. The production hosting environment still needs the URL and publishable key.
3. **P2, mobile and post-fix form state not captured.** The browser rejected a subsequent navigation with a URL policy error. A native `<details>` mobile menu was implemented so navigation works without client hydration, but its mobile rendering was not observed.

## Checks

- Desktop landing screenshot and section screenshots: captured in cloud browser.
- Navigation: FAQ and pilot pages loaded.
- FAQ: first answer opened through its native disclosure control.
- Page identity and framework overlay: intended pages rendered; no visible framework error overlay in the captured views.
- TypeScript: passed.
- Next.js production build: passed for all eight content routes and both API routes.
- Supabase security advisor: no lint warnings after the final two-table schema.
- Console errors: unavailable in the selected browser surface.

## Remaining work

Set the URL and publishable key on the chosen hosting platform and verify the hosted forms. Capture mobile and post-fix form states once browser access is restored. Complete legal identity/hosting fields and retention procedure before public launch.

final result: backend verified; browser visual gate blocked
