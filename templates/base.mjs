import { site, tags } from "../data/projects.mjs";
import { locales, publishedLocales } from "../i18n/config.mjs";
import { createI18n } from "../i18n/index.mjs";
import {
  absolutePageUrl,
  absoluteRootUrl,
  escapeHtml,
  favicon,
  pageHref,
} from "./helpers.mjs";

function localizedPageExists(localeCode, page) {
  const locale = locales.find((entry) => entry.code === localeCode);
  if (!locale || locale.status !== "published") return false;

  const i18n = createI18n(localeCode);
  if (page.type === "project") {
    return i18n.hasOwnTranslation(`projects.${page.projectId}.title`);
  }
  if (page.type === "portfolio") {
    return i18n.hasOwnTranslation(`portfolio.tags.${page.tagId}.label`);
  }
  return true;
}

export function getLocalizedLanguageTarget(localeCode, page) {
  const locale = locales.find((entry) => entry.code === localeCode);
  if (!locale || locale.status !== "published") return null;
  if (localizedPageExists(localeCode, page)) return page;
  if (page.type === "project" || page.type === "portfolio") {
    return { type: "projects" };
  }
  return { type: "home" };
}

function renderNavigation({ i18n, rootPrefix, activeId }) {
  const tagLinks = tags
    .map((tag) => {
      const label = i18n.t(`portfolio.tags.${tag.id}.label`);
      return `<a${activeId === tag.id ? ' aria-current="page"' : ""} href="${pageHref(rootPrefix, i18n.locale.code, { type: "portfolio", tagId: tag.id })}">${escapeHtml(label)}</a>`;
    })
    .join("");

  return `<nav class="primary-navigation" aria-label="${escapeHtml(i18n.t("navigation.mainLabel"))}">
    <a${activeId === "home" ? ' aria-current="page"' : ""} href="${pageHref(rootPrefix, i18n.locale.code, { type: "home" })}">${escapeHtml(i18n.t("navigation.home"))}</a>
    <a${activeId === "projects" ? ' aria-current="page"' : ""} href="${pageHref(rootPrefix, i18n.locale.code, { type: "projects" })}">${escapeHtml(i18n.t("navigation.allProjects"))}</a>
    ${tagLinks}
  </nav>`;
}

function renderLanguageSwitcher({ i18n, rootPrefix, page }) {
  const currentLocale = i18n.locale;
  const menuId = `language-options-${currentLocale.code}`;
  const links = locales
    .map((locale) => {
      const targetPage = getLocalizedLanguageTarget(locale.code, page);
      if (targetPage) {
        const isCurrent = locale.code === currentLocale.code;
        return `<a data-language-link lang="${locale.code}" hreflang="${locale.code}"${isCurrent ? ' aria-current="page"' : ""} href="${pageHref(rootPrefix, locale.code, targetPage)}"><span class="language-option-name"><img class="language-flag" src="${rootPrefix}${escapeHtml(locale.flagAsset)}" alt="" aria-hidden="true" /><span>${escapeHtml(locale.nativeName)}</span></span><span class="language-check" aria-hidden="true">${isCurrent ? "✓" : ""}</span></a>`;
      }

      return `<span class="language-option-disabled" lang="${locale.code}" aria-disabled="true" title="${escapeHtml(i18n.t("navigation.languageUnavailable"))}"><span class="language-option-name"><img class="language-flag" src="${rootPrefix}${escapeHtml(locale.flagAsset)}" alt="" aria-hidden="true" /><span>${escapeHtml(locale.nativeName)}</span></span></span>`;
    })
    .join("");

  return `<details class="language-switcher" data-language-menu>
    <summary class="language-trigger" aria-label="${escapeHtml(i18n.t("navigation.languageLabel"))}: ${escapeHtml(currentLocale.nativeName)}" aria-controls="${menuId}" aria-expanded="false"><span class="language-option-name"><img class="language-flag" src="${rootPrefix}${escapeHtml(currentLocale.flagAsset)}" alt="" aria-hidden="true" /><span lang="${currentLocale.code}">${escapeHtml(currentLocale.nativeName)}</span></span><span class="language-chevron" aria-hidden="true">⌄</span></summary>
    <nav class="language-menu" id="${menuId}" aria-label="${escapeHtml(i18n.t("navigation.languageLabel"))}">${links}</nav>
  </details>`;
}

function renderAlternateLinks(page) {
  const alternates = publishedLocales
    .filter((locale) => localizedPageExists(locale.code, page))
    .map(
      (locale) =>
        `<link rel="alternate" hreflang="${locale.code}" href="${absolutePageUrl(locale.code, page)}" />`,
    )
    .join("\n    ");

  return `${alternates}\n    <link rel="alternate" hreflang="x-default" href="${absoluteRootUrl()}" />`;
}

export function renderBaseLayout({
  i18n,
  title,
  description,
  rootPrefix,
  page,
  activeId,
  body,
  bodyClass = "",
}) {
  const year = i18n.formatNumber(new Date().getUTCFullYear(), {
    useGrouping: false,
  });
  return `<!doctype html>
<html lang="${i18n.locale.code}" dir="${i18n.locale.direction}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${escapeHtml(description)}" />
    <title>${escapeHtml(title)}</title>
    <link rel="canonical" href="${absolutePageUrl(i18n.locale.code, page)}" />
    ${renderAlternateLinks(page)}
    <link rel="icon" type="image/png" sizes="48x48" href="${favicon(rootPrefix)}" />
    <link rel="stylesheet" href="${rootPrefix}styles.css" />
    <script src="${rootPrefix}site.js" defer></script>
  </head>
  <body${bodyClass ? ` class="${bodyClass}"` : ""}>
    <a class="skip-link" href="#inhalt">${escapeHtml(i18n.t("navigation.skipToContent"))}</a>
    <header class="site-header">
      <a class="brand" href="${pageHref(rootPrefix, i18n.locale.code, { type: "home" })}" aria-label="${escapeHtml(site.owner)} – ${escapeHtml(i18n.t("navigation.home"))}"><img class="brand-logo" src="${rootPrefix}assets/site-logo.png" alt="" width="1080" height="1080" /></a>
      <div class="header-navigation">
        ${renderNavigation({ i18n, rootPrefix, activeId })}
        ${renderLanguageSwitcher({ i18n, rootPrefix, page })}
      </div>
    </header>
    ${body}
    <footer><p>${escapeHtml(i18n.t("footer.copyright", { year, owner: site.owner }))}</p><a href="#inhalt">${escapeHtml(i18n.t("footer.backToTop"))}</a></footer>
  </body>
</html>
`;
}
