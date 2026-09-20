import { site } from "../data/projects.mjs";

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function pagePath(locale, page) {
  switch (page.type) {
    case "home":
      return `${locale}/index.html`;
    case "projects":
      return `${locale}/projekte/index.html`;
    case "portfolio":
      return `${locale}/portfolio/${encodeURIComponent(page.tagId)}/index.html`;
    case "project": {
      const context = page.portfolioId
        ? `?portfolio=${encodeURIComponent(page.portfolioId)}`
        : "";
      return `${locale}/projekte/${encodeURIComponent(page.slug)}/index.html${context}`;
    }
    default:
      throw new Error(`Unbekannter Seitentyp: ${page.type}`);
  }
}

export function pageHref(rootPrefix, locale, page) {
  return `${rootPrefix}${pagePath(locale, page)}`;
}

export function absolutePageUrl(locale, page) {
  return new URL(pagePath(locale, page), site.canonicalOrigin).href;
}

export function absoluteRootUrl() {
  return new URL("index.html", site.canonicalOrigin).href;
}

export function favicon(rootPrefix = "") {
  return `${rootPrefix}assets/favicon-48.png`;
}
