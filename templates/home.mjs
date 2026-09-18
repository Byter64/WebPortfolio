import { projects, site } from "../data/projects.mjs";
import { renderBaseLayout } from "./base.mjs";
import { renderProjectGrid } from "./components.mjs";
import { escapeHtml, pageHref } from "./helpers.mjs";

export function renderHomePage(i18n) {
  const rootPrefix = "../";
  const page = { type: "home" };
  const body = `<main id="inhalt">
    <section class="hero" aria-labelledby="hero-title">
      <p class="eyebrow">${escapeHtml(i18n.t("home.eyebrow"))}</p>
      <h1 id="hero-title">${escapeHtml(i18n.t("home.title", { owner: site.owner }))}</h1>
      <p class="intro">${escapeHtml(i18n.t("home.intro"))}</p>
    </section>
    <section class="section" aria-labelledby="projects-title">
      <div class="section-heading"><div><p class="eyebrow">${escapeHtml(i18n.t("home.selectionEyebrow"))}</p><h2 id="projects-title">${escapeHtml(i18n.t("home.projectsTitle"))}</h2></div><a class="text-link" href="${pageHref(rootPrefix, i18n.locale.code, { type: "projects" })}">${escapeHtml(i18n.t("home.viewAll"))} <span aria-hidden="true">→</span></a></div>
      ${renderProjectGrid(projects, i18n, rootPrefix)}
    </section>
  </main>`;

  return renderBaseLayout({
    i18n,
    title: i18n.t("site.title"),
    description: i18n.t("site.description"),
    rootPrefix,
    page,
    activeId: "home",
    body,
  });
}
