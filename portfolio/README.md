# Yannik Stamm — Systems of Play

Local, bilingual Technical Game Design portfolio built with Astro, TypeScript and CSS. No backend or external services are needed to browse it. All three font families are bundled locally.

## Start

From this directory in PowerShell:

```powershell
npm.cmd ci
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd run dev
```

Open http://127.0.0.1:4321/de/ for German or http://127.0.0.1:4321/en/ for English. The root redirects to English. The designboard is at `/de/design/` or `/en/design/`.

```powershell
npm.cmd run check
npm.cmd run build
npm.cmd test
npm.cmd run preview
```

The complete static website is emitted into `dist/`. Publish the contents of that folder on a static host supporting directory index files. This task creates a local preview; it does not publish the portfolio.

## Content and assets

- `src/data/portfolio.ts` is the shared source for bilingual project descriptions, skill levels, evidence links, image descriptions and console hotspots.
- `src/styles/global.css` contains the design tokens and responsive styles. Each language uses the same components and assets.
- `public/media/` contains responsive 640px/1280px WebP images derived from the supplied material. Originals remain untouched. `public/Yannik-Stamm-Portfolio.pdf` is a copy of the supplied portfolio.
- `tools/prepare_assets.py` regenerates the images using Pillow and pypdf. Run it with a Python interpreter providing those packages. The original PDF and WUEHANS folders are expected in the parent workspace.
- The console explorer supports pointer, touch and standard keyboard activation. The language switch preserves the current route and hash. Videos only connect to YouTube after explicit activation.

## Editorial status

Skill levels are provisional and marked accordingly in both languages. The portfolio supplies the project facts and personal contributions; the “Design lens” paragraphs are editorial interpretation, not reported playtest results. Age, availability and current enrolment are intentionally omitted because they require a current confirmation.

Tony Blob’s Windows build was launched and the opening scene visually inspected. The bounce loop was not reliably playtested. Its page explicitly distinguishes the documented mechanics from a full gameplay review.

Before a public release, confirm the skill assessments and any updated profile information with Yannik. Review whether the existing PDF is suitable for public download, including its dated profile information. No visitor analytics, contact-form storage or automatic external video embeds are included.

## Validation

`npm test` runs against the production build and checks bilingual route coverage, local files and fragment links, accessible target IDs, image descriptions, deferred third-party media and WCAG AA contrast for the core text palette. Browser QA covers the 390px, 768px and 1440px layouts and console/language interactions.
