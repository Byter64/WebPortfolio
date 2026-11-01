import {
  getProjectText,
  portfoliosForProject,
  projects,
  site,
} from "../content.mjs";
import { renderBaseLayout } from "./base.mjs";
import { renderProjectImage } from "./components.mjs";
import { escapeHtml, pageHref } from "./helpers.mjs";

export function renderProjectPage(project, i18n) {
  const rootPrefix = "../../../";
  const page = { type: "project", projectId: project.id, slug: project.slug };
  const text = getProjectText(project, i18n.locale.code);
  const matchingPortfolios = portfoliosForProject(project);
  const fallback = {
    href: pageHref(rootPrefix, i18n.locale.code, { type: "projects" }),
    label: i18n.t("project.backToAll"),
  };
  const portfolioTargets = matchingPortfolios.map((portfolio) => ({
    id: portfolio.id,
    slug: portfolio.slug,
    label: i18n.t(`portfolios.${portfolio.id}.title`),
    href: pageHref(rootPrefix, i18n.locale.code, {
      type: "portfolio",
      portfolioId: portfolio.id,
      slug: portfolio.slug,
    }),
  }));
  const context = JSON.stringify({
    locale: i18n.locale.code,
    projectPortfolioIds: portfolioTargets.map((target) => target.id),
    portfolioTargets,
    fallback,
  }).replaceAll("<", "\\u003c");
  const tagLinks = project.tags
    .map((tagId) => {
      const label = i18n.t(`tags.${tagId}.label`);
      const portfolio = matchingPortfolios.find((entry) =>
        entry.requiredTags.includes(tagId),
      );
      return portfolio
        ? `<a href="${pageHref(rootPrefix, i18n.locale.code, { type: "portfolio", portfolioId: portfolio.id, slug: portfolio.slug })}">${escapeHtml(label)}</a>`
        : `<span>${escapeHtml(label)}</span>`;
    })
    .join("");
  const sections = text.content
    .map(
      (section) =>
        `<section><h2>${escapeHtml(section.heading)}</h2>${section.paragraphs
          .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
          .join("")}</section>`,
    )
    .join("");
  const body = `<main id="inhalt">
    <div class="project-toolbar"><a class="back-link" data-context-back href="${fallback.href}"><span aria-hidden="true">←</span> <span data-back-label>${escapeHtml(fallback.label)}</span></a></div>
    <article class="project-detail">
      <header class="project-detail-header"><div><p class="eyebrow">${escapeHtml(i18n.t("project.eyebrow"))}</p><h1>${escapeHtml(text.title)}</h1><p class="intro">${escapeHtml(text.description)}</p><div class="tag-list" aria-label="${escapeHtml(i18n.t("project.categoriesLabel"))}">${tagLinks}</div></div>${renderProjectImage(project, text, i18n, rootPrefix, "project-visual")}</header>
      <dl class="project-meta"><div><dt>${escapeHtml(i18n.t("project.year"))}</dt><dd>${escapeHtml(i18n.formatNumber(project.year, { useGrouping: false }))}</dd></div><div><dt>${escapeHtml(i18n.t("project.role"))}</dt><dd>${escapeHtml(text.role)}</dd></div></dl>
      <div class="project-content">${sections}</div>
    </article>
    <script type="application/json" id="portfolio-context">${context}</script>
  </main>`;
  return renderBaseLayout({
    i18n,
    title: `${text.title} – ${site.owner}`,
    description: text.description,
    rootPrefix,
    page,
    body,
    bodyClass: "project-page",
  });
}

export function projectBySlug(slug) {
  return projects.find((project) => project.slug === slug) ?? null;
}
