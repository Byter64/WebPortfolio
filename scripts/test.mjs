import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import {
  activePortfolios,
  allProjects,
  defaultLocale,
  getProjectText,
  hasProjectTranslation,
  languages,
  portfolios,
  portfoliosForProject,
  projectMatchesPortfolio,
  projects,
  publishedLocales,
  site,
  sourceRoot,
  tags,
} from "../src/content.mjs";
import { createI18n, isKnownLocale } from "../src/i18n.mjs";
import { getLocalizedLanguageTarget } from "../src/templates/base.mjs";
import { collectContentErrors, currentModel } from "./validate-content.mjs";
import {
  addPortfolioContext,
  getBackLinkTarget,
  normalizePortfolioValue,
  resolvePortfolioContext,
} from "../src/client/site.js";

const repositoryRoot = resolve(import.meta.dirname, "..");
const distRoot = resolve(repositoryRoot, "dist");
const readDist = (path) => readFile(resolve(distRoot, path), "utf8");
const clone = (value) => structuredClone(value);
const pagesForLocale = (locale) => [
  `${locale}/index.html`,
  `${locale}/projekte/index.html`,
  ...activePortfolios.map(
    (portfolio) => `${locale}/portfolio/${portfolio.slug}/index.html`,
  ),
  ...projects
    .filter((project) => hasProjectTranslation(project, locale))
    .map((project) => `${locale}/projekte/${project.slug}/index.html`),
];

assert.deepEqual(
  publishedLocales.map((language) => language.code),
  ["de", "en", "es", "ja"],
);
for (const language of languages) {
  assert.equal(isKnownLocale(language.code), true);
  assert.doesNotThrow(() => createI18n(language.code));
  assert.match(language.locale, new RegExp(`^${language.code}(?:-|$)`, "i"));
  assert.match(language.flagAsset, /^assets\/flags\/[a-z]{2}\.svg$/);
}
assert.equal(isKnownLocale("xx"), false);
assert.throws(() => createI18n("xx"), /Unbekannte/);

const testProject = {
  id: "test-project",
  slug: "test-project",
  tags: ["programming", "hardware-design"],
  published: true,
  featured: false,
  order: 999,
  coverImage: "assets/previews/signal-runner.webp",
};
const anyPortfolio = {
  id: "technical-any",
  slug: "technical-any",
  requiredTags: ["programming", "hardware-design"],
  match: "any",
  order: 900,
  enabled: true,
};
const allPortfolio = { ...anyPortfolio, id: "technical-all", slug: "technical-all", match: "all" };
assert.equal(projectMatchesPortfolio(testProject, anyPortfolio), true);
assert.equal(projectMatchesPortfolio(testProject, allPortfolio), true);
assert.equal(
  projectMatchesPortfolio(
    { ...testProject, tags: ["programming"] },
    allPortfolio,
  ),
  false,
);
assert.equal(
  projectMatchesPortfolio(testProject, { ...anyPortfolio, enabled: false }),
  false,
);

const singleTagProject = projects.find((project) => project.tags.length === 1);
const multiTagProject = projects.find((project) => project.tags.length > 1);
assert.ok(singleTagProject);
assert.ok(multiTagProject);
assert.ok(portfoliosForProject(multiTagProject).length > 1);
assert.equal(allProjects.filter((project) => project.published).length, projects.length);
assert.ok(allProjects.every((project) => project.sourceFile.endsWith("project.json")));

function errorsFor(changes) {
  return collectContentErrors(
    { ...currentModel, ...changes },
    { verifyImages: false },
  ).join("\n");
}

assert.match(
  errorsFor({ projects: [{ ...testProject, published: false, tags: ["unknown-tag"] }] }),
  /unbekannter Tag "unknown-tag"/,
);
assert.match(
  errorsFor({ tags: [...tags, { ...tags[0] }] }),
  /doppelte Tag-ID/,
);
assert.match(
  errorsFor({ projects: [{ ...testProject, published: false }, { ...testProject, published: false }] }),
  /doppeltes Projektfeld id.*doppeltes Projektfeld slug/s,
);
assert.match(
  errorsFor({ portfolios: [...portfolios, { ...portfolios[0] }] }),
  /doppeltes Feld id.*doppeltes Feld slug/s,
);
assert.match(
  errorsFor({ portfolios: [{ ...anyPortfolio, match: "invalid" }] }),
  /Feld match muss "any" oder "all" sein/,
);
assert.match(
  errorsFor({ portfolios: [{ ...anyPortfolio, requiredTags: ["unknown-tag"] }] }),
  /unbekannten Tag "unknown-tag"/,
);
assert.match(
  errorsFor({ languages: [{ ...languages[0], code: "Deutsch" }] }),
  /Sprachcode "Deutsch" ist ungültig/,
);

const languageIndex = await readDist("index.html");
for (const language of publishedLocales) {
  assert.match(languageIndex, new RegExp(`href="${language.code}/index\\.html"`));
  assert.match(languageIndex, new RegExp(`${language.flagAsset}.*${language.nativeName}`, "s"));
}

for (const language of publishedLocales) {
  const generatedProjectEntries = await readdir(
    resolve(distRoot, language.code, "projekte"),
    { withFileTypes: true },
  );
  assert.deepEqual(
    generatedProjectEntries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort(),
    projects
      .filter((project) => hasProjectTranslation(project, language.code))
      .map((project) => project.slug)
      .sort(),
  );
  const generatedPortfolioEntries = await readdir(
    resolve(distRoot, language.code, "portfolio"),
    { withFileTypes: true },
  );
  assert.deepEqual(
    generatedPortfolioEntries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort(),
    activePortfolios.map((portfolio) => portfolio.slug).sort(),
  );
}

for (const language of publishedLocales) {
  const i18n = createI18n(language.code);
  for (const portfolio of activePortfolios) {
    const html = await readDist(
      `${language.code}/portfolio/${portfolio.slug}/index.html`,
    );
    const title = i18n.t(`portfolios.${portfolio.id}.title`);
    assert.match(html, new RegExp(`<h1>${title}</h1>`));
    for (const project of projects.filter(
      (candidate) =>
        hasProjectTranslation(candidate, language.code)
        && projectMatchesPortfolio(candidate, portfolio),
    )) {
      assert.match(
        html,
        new RegExp(
          `/${language.code}/projekte/${project.slug}/index\\.html\\?portfolio=${portfolio.id}`,
        ),
      );
    }
  }

  for (const project of projects.filter((entry) =>
    hasProjectTranslation(entry, language.code),
  )) {
    const html = await readDist(
      `${language.code}/projekte/${project.slug}/index.html`,
    );
    const text = getProjectText(project, language.code);
    assert.match(html, new RegExp(`<h1>${text.title}</h1>`));
    assert.equal((html.match(/class="back-link"/g) ?? []).length, 1);
    const contextMatch = html.match(
      /<script type="application\/json" id="portfolio-context">([^<]+)<\/script>/,
    );
    assert.ok(contextMatch);
    const config = JSON.parse(contextMatch[1]);
    const expectedPortfolios = portfoliosForProject(project);
    assert.deepEqual(
      config.projectPortfolioIds,
      expectedPortfolios.map((portfolio) => portfolio.id),
    );
    assert.ok(config.fallback.href.includes(`/${language.code}/projekte/`));
  }

  for (const page of pagesForLocale(language.code)) {
    const html = await readDist(page);
    assert.match(html, new RegExp(`<html lang="${language.code}" dir="${language.direction}">`));
    assert.equal((html.match(/class="site-header"/g) ?? []).length, 1);
    assert.equal((html.match(/<footer>/g) ?? []).length, 1);
    assert.equal((html.match(/data-language-menu/g) ?? []).length, 1);
    for (const alternate of publishedLocales) {
      assert.match(html, new RegExp(`rel="alternate" hreflang="${alternate.code}"`));
    }
    assert.doesNotMatch(html, /(?:navigation|portfolios|project|footer|home)\.[a-zA-Z]/);

    const pageUrl = new URL(page.replace(/index\.html$/, ""), "https://portfolio.test/");
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const reference = match[1];
      if (reference.startsWith("#") || reference.startsWith("data:")) continue;
      const url = new URL(reference, pageUrl);
      if (url.origin !== "https://portfolio.test") continue;
      assert.equal(url.pathname.endsWith("/"), false);
      await access(resolve(distRoot, decodeURIComponent(url.pathname).replace(/^\//, "")));
    }
  }
}

const renamedI18n = createI18n("de");
const originalTitle = renamedI18n.t("portfolios.game-design.title");
assert.equal(originalTitle, "Game Design");
assert.equal(activePortfolios.find((entry) => entry.id === "game-design").slug, "game-design");

assert.deepEqual(
  getLocalizedLanguageTarget("en", {
    type: "project",
    projectId: "nicht-uebersetzt",
  }),
  { type: "projects" },
);
assert.equal(getLocalizedLanguageTarget("xx", { type: "home" }), null);

const sitemap = await readDist("sitemap.xml");
for (const language of publishedLocales) {
  assert.match(sitemap, new RegExp(`${site.canonicalOrigin}${language.code}/index\\.html`));
}

assert.equal(normalizePortfolioValue(" Game Design "), "game-design");
assert.equal(normalizePortfolioValue("Ästhetik & Geräte"), "aesthetik-geraete");
const multiPortfolioConfig = {
  projectPortfolioIds: ["game-design", "programming"],
  portfolioTargets: [
    { id: "game-design", slug: "game-design", label: "Game Design", href: "game" },
    { id: "programming", slug: "programming", label: "Programming", href: "code" },
  ],
  fallback: { href: "all", label: "Alle Projekte" },
};
assert.equal(resolvePortfolioContext("Game Design", multiPortfolioConfig)?.id, "game-design");
assert.equal(resolvePortfolioContext("unbekannt", multiPortfolioConfig), null);
assert.equal(getBackLinkTarget("programming", multiPortfolioConfig).href, "code");
assert.equal(getBackLinkTarget("hardware-design", multiPortfolioConfig).href, "all");
assert.equal(
  addPortfolioContext("../../../en/projekte/signal-runner/index.html", "game-design"),
  "../../../en/projekte/signal-runner/index.html?portfolio=game-design",
);

for (const legacyPath of [
  "projekte/index.html",
  ...activePortfolios.map((portfolio) => `portfolio/${portfolio.slug}/index.html`),
  ...projects.map((project) => `projekte/${project.slug}/index.html`),
]) {
  const html = await readDist(legacyPath);
  assert.match(html, /http-equiv="refresh"/);
  assert.match(html, new RegExp(`${defaultLocale}/`));
}

await access(resolve(sourceRoot, "content", "projects"));
console.log("Alle Datenmodell-, Build-, URL-, SEO- und Kontexttests sind erfolgreich.");
