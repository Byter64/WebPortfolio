import {
  hasProjectTranslation,
  projects,
  projectsForPortfolio,
  site,
} from "../content.mjs";
import { renderBaseLayout } from "./base.mjs";
import { renderProjectGrid } from "./components.mjs";
import { escapeHtml } from "./helpers.mjs";

export function renderProjectOverviewPage(i18n) {
  const rootPrefix = "../../";
  const page = { type: "projects" };
  const body = `<main id="inhalt">
    <header class="page-intro"><p class="eyebrow">${escapeHtml(i18n.t("portfolio.overviewEyebrow"))}</p><h1>${escapeHtml(i18n.t("portfolio.allProjectsTitle"))}</h1><p class="intro">${escapeHtml(i18n.t("portfolio.allProjectsDescription"))}</p></header>
    <section class="section" aria-label="${escapeHtml(i18n.t("portfolio.allProjectsTitle"))}">${renderProjectGrid(projects.filter((project) => hasProjectTranslation(project, i18n.locale.code)), i18n, rootPrefix)}</section>
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

export function renderPortfolioPage(portfolio, i18n) {
  const rootPrefix = "../../../";
  const page = {
    type: "portfolio",
    portfolioId: portfolio.id,
    slug: portfolio.slug,
  };
  const matching = projectsForPortfolio(portfolio).filter((project) =>
    hasProjectTranslation(project, i18n.locale.code),
  );
  const title = i18n.t(`portfolios.${portfolio.id}.title`);
  const description = i18n.t(`portfolios.${portfolio.id}.description`);
  const countKey = matching.length === 1
    ? "portfolio.projectCountOne"
    : "portfolio.projectCountOther";
  const body = `<main id="inhalt">
    <header class="page-intro"><p class="eyebrow">${escapeHtml(i18n.t("portfolio.eyebrow"))}</p><h1>${escapeHtml(title)}</h1><p class="intro">${escapeHtml(description)}</p><p class="result-count">${escapeHtml(i18n.t(countKey, { count: i18n.formatNumber(matching.length) }))}</p></header>
    <section class="section" aria-label="${escapeHtml(i18n.t("portfolio.sectionLabel", { portfolio: title }))}">${renderProjectGrid(matching, i18n, rootPrefix, portfolio)}</section>
  </main>`;
  return renderBaseLayout({
    i18n,
    title: `${title} – ${site.owner}`,
    description,
    rootPrefix,
    page,
    activeId: portfolio.id,
    body,
  });
}
