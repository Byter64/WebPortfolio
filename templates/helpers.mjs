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

export function favicon() {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23111827'/%3E%3Cpath d='M17 18l15 29 15-29h-9l-6 13-6-13z' fill='%237dd3fc'/%3E%3C/svg%3E";
}
