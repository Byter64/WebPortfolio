import { escapeHtml, favicon } from "./helpers.mjs";

export function renderLegacyRedirect({ i18n, target, canonical, rootPrefix }) {
  return `<!doctype html>
<html lang="${i18n.locale.code}" dir="${i18n.locale.direction}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="0; url=${escapeHtml(target)}" />
    <meta name="robots" content="noindex" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <link rel="icon" type="image/png" sizes="48x48" href="${favicon(rootPrefix)}" />
    <title>${escapeHtml(i18n.t("redirect.title"))}</title>
  </head>
  <body>
    <main>
      <h1>${escapeHtml(i18n.t("redirect.title"))}</h1>
      <p>${escapeHtml(i18n.t("redirect.message"))}</p>
      <p><a href="${escapeHtml(target)}">${escapeHtml(i18n.t("redirect.link"))}</a></p>
    </main>
  </body>
</html>
`;
}
