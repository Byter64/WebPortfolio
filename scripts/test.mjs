import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { projects, site, tags } from "../data/projects.mjs";
import { defaultLocale, locales, publishedLocales } from "../i18n/config.mjs";
import { createI18n, isKnownLocale } from "../i18n/index.mjs";
import { getLocalizedLanguageTarget } from "../templates/base.mjs";
import contextApi from "../site.js";

const {
  addPortfolioContext,
  getBackLinkTarget,
  normalizePortfolioValue,
  resolvePortfolioContext,
} = contextApi;

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFile(resolve(root, path), "utf8");
const defaultI18n = createI18n(defaultLocale);
const pagesForLocale = (locale) => [
  `${locale}/index.html`,
  `${locale}/projekte/index.html`,
  ...tags.map((tag) => `${locale}/portfolio/${tag.id}/index.html`),
  ...projects.map((project) => `${locale}/projekte/${project.slug}/index.html`),
];

assert.deepEqual(
  publishedLocales.map((locale) => locale.code),
  ["de", "en", "es", "ja"],
);
for (const locale of locales) {
  assert.equal(isKnownLocale(locale.code), true);
  assert.doesNotThrow(() => createI18n(locale.code));
  assert.match(locale.locale, new RegExp(`^${locale.code}(?:-|$)`, "i"));
  assert.ok(locale.nativeName);
  assert.match(locale.flagAsset, /^assets\/flags\/[a-z]{2}\.svg$/);
}
assert.equal(isKnownLocale("xx"), false);
assert.throws(() => createI18n("xx"), /Unbekannte/);

const languageIndex = await read("index.html");
for (const locale of publishedLocales) {
  assert.match(languageIndex, new RegExp(`href="${locale.code}/index\\.html"`));
  assert.match(languageIndex, new RegExp(`${locale.flagAsset}.*${locale.nativeName}`, "s"));
  assert.doesNotMatch(
    languageIndex,
    new RegExp(`lang="${locale.code}" aria-disabled="true"`),
  );
}

const singleTagProject = projects.find((project) => project.tags.length === 1);
const multiTagProject = projects.find((project) => project.tags.length > 1);
assert.ok(singleTagProject, "Es fehlt ein Projekt mit genau einem Tag.");
assert.ok(multiTagProject, "Es fehlt ein Projekt mit mehreren Tags.");

for (const locale of publishedLocales) {
  const i18n = createI18n(locale.code);

  for (const tag of tags) {
    const html = await read(`${locale.code}/portfolio/${tag.id}/index.html`);
    assert.match(html, new RegExp(`<p class="eyebrow">${i18n.t("portfolio.eyebrow")}</p>`));
    for (const project of projects.filter((candidate) =>
      candidate.tags.includes(tag.id),
    )) {
      assert.match(
        html,
        new RegExp(
          `/${locale.code}/projekte/${project.slug}/index\\.html\\?portfolio=${tag.id}`,
        ),
      );
    }
  }

  for (const project of projects) {
    const html = await read(`${locale.code}/projekte/${project.slug}/index.html`);
    assert.equal((html.match(/class="back-link"/g) ?? []).length, 1);
    assert.match(
      html,
      new RegExp(
        `href="\.\.\/\.\.\/\.\.\/${locale.code}\/projekte\/index\\.html"`,
      ),
    );

    const contextMatch = html.match(
      /<script type="application\/json" id="portfolio-context">([^<]+)<\/script>/,
    );
    assert.ok(contextMatch);
    const config = JSON.parse(contextMatch[1]);
    assert.equal(config.locale, locale.code);
    assert.equal(config.fallback.href.includes(`/${locale.code}/`), true);
    assert.equal(
      config.portfolioTargets.every((target) =>
        target.href.includes(`/${locale.code}/portfolio/`),
      ),
      true,
    );
  }

  for (const page of pagesForLocale(locale.code)) {
    const html = await read(page);
    assert.match(html, new RegExp(`<html lang="${locale.code}" dir="${locale.direction}">`));
    assert.equal((html.match(/class="site-header"/g) ?? []).length, 1);
    assert.equal((html.match(/<footer>/g) ?? []).length, 1);
    assert.equal((html.match(/data-language-menu/g) ?? []).length, 1);
    assert.match(html, /<summary class="language-trigger"[^>]+aria-expanded="false"/);
    assert.match(html, /<nav class="language-menu"/);
    assert.match(
      html,
      new RegExp(
        `data-language-link lang="${locale.code}"[^>]+aria-current="page"`,
      ),
    );
    assert.match(
      html,
      new RegExp(
        `rel="canonical" href="https:\/\/byter64\\.github\\.io\/WebPortfolio\/${locale.code}\/`,
      ),
    );
    for (const alternate of publishedLocales) {
      assert.match(html, new RegExp(`rel="alternate" hreflang="${alternate.code}"`));
      assert.match(html, new RegExp(`data-language-link lang="${alternate.code}"`));
    }
    assert.match(html, /rel="alternate" hreflang="x-default"/);
    assert.doesNotMatch(
      html,
      /(?:navigation|portfolio|project|footer|home)\.[a-zA-Z]/,
    );

    const pageUrl = new URL(
      page.replace(/index\.html$/, ""),
      "https://portfolio.test/",
    );
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const reference = match[1];
      if (reference.startsWith("#") || reference.startsWith("data:")) continue;
      const url = new URL(reference, pageUrl);
      if (url.origin !== "https://portfolio.test") continue;
      assert.equal(url.pathname.endsWith("/"), false);
      const targetPath = decodeURIComponent(url.pathname).replace(/^\//, "");
      await access(resolve(root, targetPath));
    }
  }
}

assert.deepEqual(
  getLocalizedLanguageTarget("en", {
    type: "project",
    projectId: "nicht-uebersetzt",
  }),
  { type: "projects" },
);
assert.equal(
  getLocalizedLanguageTarget("xx", { type: "home" }),
  null,
);

const sitemap = await read("sitemap.xml");
for (const locale of publishedLocales) {
  assert.match(
    sitemap,
    new RegExp(`${site.canonicalOrigin}${locale.code}/index\\.html`),
  );
}

assert.equal(normalizePortfolioValue(" Game Design "), "game-design");
assert.equal(normalizePortfolioValue("Ästhetik & Geräte"), "aesthetik-geraete");

const multiTagConfig = {
  projectTagIds: multiTagProject.tags,
  portfolioTargets: multiTagProject.tags.map((id) => ({
    id,
    label: defaultI18n.t(`portfolio.tags.${id}.label`),
    href: `../../../de/portfolio/${id}/index.html`,
  })),
  fallback: {
    href: "../../../de/projekte/index.html",
    label: defaultI18n.t("project.backToAll"),
  },
};

assert.equal(
  resolvePortfolioContext("Game Design", multiTagConfig)?.id,
  "game-design",
);
assert.equal(resolvePortfolioContext("unbekannt", multiTagConfig), null);
assert.deepEqual(
  getBackLinkTarget("programming", multiTagConfig),
  multiTagConfig.portfolioTargets.find((target) => target.id === "programming"),
);
assert.deepEqual(
  getBackLinkTarget("hardware-design", multiTagConfig),
  multiTagConfig.fallback,
);
assert.equal(
  addPortfolioContext("../../../en/projekte/signal-runner/index.html", "game-design"),
  "../../../en/projekte/signal-runner/index.html?portfolio=game-design",
);

for (const legacyPath of [
  "projekte/index.html",
  ...tags.map((tag) => `portfolio/${tag.id}/index.html`),
  ...projects.map((project) => `projekte/${project.slug}/index.html`),
]) {
  const html = await read(legacyPath);
  assert.match(html, /http-equiv="refresh"/);
  assert.match(html, new RegExp(`${defaultLocale}/`));
}

console.log("Alle Lokalisierungs-, URL-, SEO- und Kontexttests sind erfolgreich.");
