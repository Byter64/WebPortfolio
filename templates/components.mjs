import { escapeHtml, pageHref } from "./helpers.mjs";

export function renderProjectImage(
  project,
  i18n,
  rootPrefix,
  className = "card-media",
) {
  const text = i18n.object(`projects.${project.id}`);
  const caption = text.imageCaption
    ? `<figcaption class="project-image-caption">${escapeHtml(text.imageCaption)}</figcaption>`
    : "";

  return `<figure class="${className}">
    <div class="preview-frame">
      <img data-preview src="${rootPrefix}${project.image}" alt="${escapeHtml(text.imageAlt)}" width="1200" height="800" />
      <span class="image-fallback" data-image-fallback role="img" aria-label="${escapeHtml(i18n.t("project.imageUnavailable", { project: text.title }))}" hidden>${escapeHtml(i18n.t("project.imageUnavailable", { project: text.title }))}</span>
    </div>
    ${caption}
  </figure>`;
}

function renderProjectCard(project, i18n, rootPrefix, contextTag = null) {
  const text = i18n.object(`projects.${project.id}`);
  const labels = project.tags
    .map((tagId) => i18n.t(`portfolio.tags.${tagId}.label`))
    .join(" · ");

  return `<article class="project-card">
    <a class="card-link" href="${pageHref(rootPrefix, i18n.locale.code, { type: "project", projectId: project.id, slug: project.slug, portfolioId: contextTag?.id })}">
      ${renderProjectImage(project, i18n, rootPrefix)}
      <div class="card-copy">
        <p class="tag-line">${escapeHtml(labels)}</p>
        <h3>${escapeHtml(text.title)}</h3>
        <p>${escapeHtml(text.description)}</p>
        <span class="card-action">${escapeHtml(i18n.t("project.view"))} <span aria-hidden="true">↗</span></span>
      </div>
    </a>
  </article>`;
}

export function renderProjectGrid(
  items,
  i18n,
  rootPrefix,
  contextTag = null,
) {
  if (!items.length) {
    return `<p class="empty-state">${escapeHtml(i18n.t("portfolio.empty"))}</p>`;
  }

  return `<div class="project-grid">${items
    .map((project) =>
      renderProjectCard(project, i18n, rootPrefix, contextTag),
    )
    .join("")}</div>`;
}
