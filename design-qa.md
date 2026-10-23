# Design QA — Frandeley Session live

- Source visual truth: `../generated_images/exec-9bb5e648-0705-4882-a348-669a6936176f.png` (793 × 1983 px, selected concept 2).
- Implementation: `http://terminal.local:4173/`, cloud browser tab capture in this build session. The browser did not expose a local screenshot path.
- Desktop viewport: 1363 × 936 CSS px, browser density not reported. Source is a tall 793 px wide concept; region comparison was qualitative after proportional scaling, not a pixel overlay.
- State: default landing page, FAQ expanded, pilot form before and after a test submission.

## Visual comparison

The first viewport follows the chosen composition: a dark studio photograph with musician on the right, large three-line white headline on the left, electric-blue CTA and a waveform rail. The phone-to-web section, three photographic steps, notebook scene and split pilot panel follow the same order and palette. The implementation uses standalone generated photos, including device imagery, instead of cropping the design board. The supplied Frandeley mark is used with a dark-header filter.

Typography: bold compact sans-serif, scale and line breaks match the concept's hierarchy. Spacing: generous black bands and three-column steps follow the board, though viewport proportions differ. Colors: near-black, white and electric blue are consistent. Images: all principal subjects and crops are present at desktop. Copy: the headline is preserved; supporting text was updated to describe a concept and pilot accurately. Focused checks of the header and signup panel showed legible controls and no observed clipping at desktop.

## Findings and comparison history

1. **P0, form without client hydration (initial capture).** A pilot submission navigated with the entered e-mail in the URL, exposing it in browser history. Fix: added native POST actions and server redirects; the payload is now sent in the request body. The server route accepts both HTML form data and JSON. This fix passed type checking and production compilation. **Post-fix browser confirmation is blocked** by the cloud browser URL policy, so the design gate remains blocked.
2. **P1, Supabase enrollment not verified.** The Frandeley project is listed, but all project-scoped Supabase calls return `You do not have permission to perform this action`. The migration has not been applied and the publishable key has not been configured. The forms display an unavailable state until then.
3. **P2, mobile and post-fix form state not captured.** The browser rejected a subsequent navigation with a URL policy error. A native `<details>` mobile menu was implemented so navigation works without client hydration, but its mobile rendering was not observed.

## Checks

- Desktop landing screenshot and section screenshots: captured in cloud browser.
- Navigation: FAQ and pilot pages loaded.
- FAQ: first answer opened through its native disclosure control.
- Page identity and framework overlay: intended pages rendered; no visible framework error overlay in the captured views.
- TypeScript: passed.
- Next.js production build: passed for all eight content routes and both API routes.
- Console errors: unavailable in the selected browser surface.

## Remaining work

Restore authorized Supabase project access, inspect existing schema, apply and review the migration, configure the publishable URL/key, and test an end-to-end signup and contact message. Capture mobile and post-fix form states once browser access is restored. Complete legal identity/hosting fields and retention procedure before public launch.

final result: blocked
