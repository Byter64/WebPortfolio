import { access, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { projects, site, tags } from "../data/projects.mjs";
import { defaultLocale, publishedLocales } from "../i18n/config.mjs";
import { createI18n } from "../i18n/index.mjs";
import { absolutePageUrl } from "../templates/helpers.mjs";
import { renderHomePage } from "../templates/home.mjs";
import { renderLanguageIndex } from "../templates/language-index.mjs";
import {
  renderProjectOverviewPage,
  renderTagPortfolioPage,
} from "../templates/portfolio.mjs";
import { renderProjectPage } from "../templates/project.mjs";
import { renderLegacyRedirect } from "../templates/redirect.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function validateData() {
  const tagIds = new Set();
  const projectIds = new Set();
  const projectSlugs = new Set();

  for (const tag of tags) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag.id)) {
      throw new Error(`Ungültige Tag-ID: ${tag.id}`);
    }
    if (tagIds.has(tag.id)) throw new Error(`Doppelte Tag-ID: ${tag.id}`);
    tagIds.add(tag.id);
  }

  for (const project of projects) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id)) {
      throw new Error(`Ungültige Projekt-ID: ${project.id}`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) {
      throw new Error(`Ungültiger Projekt-Slug: ${project.slug}`);
    }
    if (projectIds.has(project.id)) {
      throw new Error(`Doppelte Projekt-ID: ${project.id}`);
    }
    if (projectSlugs.has(project.slug)) {
      throw new Error(`Doppelter Projekt-Slug: ${project.slug}`);
    }
    projectIds.add(project.id);
    projectSlugs.add(project.slug);
    if (!project.tags.length) {
      throw new Error(`${project.slug} benötigt mindestens einen Tag.`);
    }
    for (const tagId of project.tags) {
      if (!tagIds.has(tagId)) {
        throw new Error(`${project.slug} verwendet den unbekannten Tag ${tagId}.`);
      }
    }
  }
}

async function write(relativePath, content) {
  const target = resolve(root, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}

async function verifyImages() {
  await Promise.all(
    projects.map((project) => access(resolve(root, project.image))),
  );
}

function allPagesForLocale(localeCode) {
  return [
    { type: "home" },
    { type: "projects" },
    ...tags.map((tag) => ({ type: "portfolio", tagId: tag.id })),
    ...projects.map((project) => ({
      type: "project",
      projectId: project.id,
      slug: project.slug,
    })),
  ].map((page) => absolutePageUrl(localeCode, page));
}

function renderSitemap() {
  const urls = [
    new URL("index.html", site.canonicalOrigin).href,
    ...publishedLocales.flatMap((locale) => allPagesForLocale(locale.code)),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url.replaceAll("&", "&amp;")}</loc></url>`).join("\n")}
</urlset>
`;
}

async function writeLocalizedPages(localeCode) {
  const fallbackKeys = new Set();
  const i18n = createI18n(localeCode, ({ key }) => fallbackKeys.add(key));

  await write(`${localeCode}/index.html`, renderHomePage(i18n));
  await write(
    `${localeCode}/projekte/index.html`,
    renderProjectOverviewPage(i18n),
  );
  await Promise.all(
    tags.map((tag) =>
      write(
        `${localeCode}/portfolio/${tag.id}/index.html`,
        renderTagPortfolioPage(tag, i18n),
      ),
    ),
  );
  await Promise.all(
    projects.map((project) =>
      write(
        `${localeCode}/projekte/${project.slug}/index.html`,
        renderProjectPage(project, i18n),
      ),
    ),
  );

  if (fallbackKeys.size) {
    console.warn(
      `[i18n] ${localeCode}: deutscher Fallback für ${[...fallbackKeys].sort().join(", ")}`,
    );
  }
}

async function writeLegacyRedirects(i18n) {
  const redirects = [
    {
      path: "projekte/index.html",
      target: `../${defaultLocale}/projekte/index.html`,
      canonical: absolutePageUrl(defaultLocale, { type: "projects" }),
    },
    ...tags.map((tag) => ({
      path: `portfolio/${tag.id}/index.html`,
      target: `../../${defaultLocale}/portfolio/${tag.id}/index.html`,
      canonical: absolutePageUrl(defaultLocale, {
        type: "portfolio",
        tagId: tag.id,
      }),
    })),
    ...projects.map((project) => ({
      path: `projekte/${project.slug}/index.html`,
      target: `../../${defaultLocale}/projekte/${project.slug}/index.html`,
      canonical: absolutePageUrl(defaultLocale, {
        type: "project",
        projectId: project.id,
        slug: project.slug,
      }),
    })),
  ];

  await Promise.all(
    redirects.map((redirect) =>
      write(
        redirect.path,
        renderLegacyRedirect({
          i18n,
          target: redirect.target,
          canonical: redirect.canonical,
        }),
      ),
    ),
  );
}

validateData();
await verifyImages();

const defaultI18n = createI18n(defaultLocale);
await write("index.html", renderLanguageIndex(defaultI18n));
await Promise.all(
  publishedLocales.map((locale) => writeLocalizedPages(locale.code)),
);
await writeLegacyRedirects(defaultI18n);
await write("sitemap.xml", renderSitemap());

const localizedPageCount =
  publishedLocales.length * (2 + tags.length + projects.length);
console.log(
  `Build abgeschlossen: ${localizedPageCount} lokalisierte Seiten, Sprachauswahl, Sitemap und Legacy-Weiterleitungen.`,
);
