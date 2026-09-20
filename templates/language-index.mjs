import { site } from "../data/projects.mjs";
import { locales, publishedLocales } from "../i18n/config.mjs";
import {
  absolutePageUrl,
  absoluteRootUrl,
  escapeHtml,
  favicon,
  pageHref,
} from "./helpers.mjs";

export function renderLanguageIndex(i18n) {
  const languageItems = locales
    .map((locale) => {
      if (locale.status === "published") {
        return `<li><a lang="${locale.code}" hreflang="${locale.code}" href="${pageHref("", locale.code, { type: "home" })}"><span class="language-option-name"><img class="language-flag" src="${escapeHtml(locale.flagAsset)}" alt="" aria-hidden="true" /><span>${escapeHtml(locale.nativeName)}</span></span><small>${escapeHtml(i18n.t("languageIndex.available"))}</small></a></li>`;
      }
      return `<li><span class="language-unavailable" lang="${locale.code}" aria-disabled="true"><span class="language-option-name"><img class="language-flag" src="${escapeHtml(locale.flagAsset)}" alt="" aria-hidden="true" /><span>${escapeHtml(locale.nativeName)}</span></span><small>${escapeHtml(i18n.t("languageIndex.unavailable"))}</small></span></li>`;
    })
    .join("");
  const alternates = publishedLocales
    .map(
      (locale) =>
        `<link rel="alternate" hreflang="${locale.code}" href="${absolutePageUrl(locale.code, { type: "home" })}" />`,
    )
    .join("\n    ");

  return `<!doctype html>
<html lang="${i18n.locale.code}" dir="${i18n.locale.direction}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${escapeHtml(i18n.t("languageIndex.description"))}" />
    <title>${escapeHtml(i18n.t("languageIndex.title"))} – ${escapeHtml(site.owner)}</title>
    <link rel="canonical" href="${absoluteRootUrl()}" />
    ${alternates}
    <link rel="alternate" hreflang="x-default" href="${absoluteRootUrl()}" />
    <link rel="icon" type="image/png" sizes="48x48" href="${favicon()}" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body class="language-index-page">
    <main id="inhalt" class="language-index">
      <a class="brand" href="index.html" aria-label="${escapeHtml(site.owner)}"><img class="brand-logo" src="assets/site-logo.png" alt="" width="1080" height="1080" /></a>
      <p class="eyebrow">Portfolio</p>
      <h1>${escapeHtml(i18n.t("languageIndex.title"))}</h1>
      <p class="intro">${escapeHtml(i18n.t("languageIndex.description"))}</p>
      <ul class="language-options">${languageItems}</ul>
    </main>
  </body>
</html>
`;
}
