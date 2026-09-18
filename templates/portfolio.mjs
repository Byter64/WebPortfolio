import { projects, site } from "../data/projects.mjs";
import { renderBaseLayout } from "./base.mjs";
import { renderProjectGrid } from "./components.mjs";
import { escapeHtml } from "./helpers.mjs";

export function renderProjectOverviewPage(i18n) {
  const rootPrefix = "../../";
  const page = { type: "projects" };
  const body = `<main id="inhalt">
    <header class="page-intro"><p class="eyebrow">${escapeHtml(i18n.t("portfolio.overviewEyebrow"))}</p><h1>${escapeHtml(i18n.t("portfolio.allProjectsTitle"))}</h1><p class="intro">${escapeHtml(i18n.t("portfolio.allProjectsDescription"))}</p></header>
    <section class="section" aria-label="${escapeHtml(i18n.t("portfolio.allProjectsTitle"))}">${renderProjectGrid(projects, i18n, rootPrefix)}</section>
  </main>`;

  return renderBaseLayout({
    i18n,
    title: `${i18n.t("portfolio.allProjectsTitle")} – ${site.owner}`,
    description: i18n.t("portfolio.allProjectsMetaDescription"),
    rootPrefix,
    page,
    activeId: "projects",
    body,
  });
}

export function renderTagPortfolioPage(tag, i18n) {
  const rootPrefix = "../../../";
  const page = { type: "portfolio", tagId: tag.id };
  const matching = projects.filter((project) => project.tags.includes(tag.id));
  const label = i18n.t(`portfolio.tags.${tag.id}.label`);
  const countKey = matching.length === 1
    ? "portfolio.projectCountOne"
    : "portfolio.projectCountOther";
  const body = `<main id="inhalt">
    <header class="page-intro"><p class="eyebrow">${escapeHtml(i18n.t("portfolio.eyebrow"))}</p><h1>${escapeHtml(label)}</h1><p class="intro">${escapeHtml(i18n.t(`portfolio.tags.${tag.id}.description`))}</p><p class="result-count">${escapeHtml(i18n.t(countKey, { count: i18n.formatNumber(matching.length) }))}</p></header>
    <section class="section" aria-label="${escapeHtml(i18n.t("portfolio.sectionLabel", { tag: label }))}">${renderProjectGrid(matching, i18n, rootPrefix, tag)}</section>
  </main>`;

  return renderBaseLayout({
    i18n,
    title: `${label} – ${site.owner}`,
    description: i18n.t(`portfolio.tags.${tag.id}.description`),
    rootPrefix,
    page,
    activeId: tag.id,
    body,
  });
}
