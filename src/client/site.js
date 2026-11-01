export function normalizePortfolioValue(value) {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolvePortfolioContext(rawValue, config) {
  const normalized = normalizePortfolioValue(rawValue);
  const target = config.portfolioTargets.find(
    (candidate) =>
      candidate.id === normalized
      || candidate.slug === normalized
      || normalizePortfolioValue(candidate.label) === normalized,
  );
  if (!target || !config.projectPortfolioIds.includes(target.id)) return null;
  return target;
}

export function getBackLinkTarget(rawValue, config) {
  return resolvePortfolioContext(rawValue, config) ?? config.fallback;
}

export function addPortfolioContext(href, portfolioId) {
  if (!portfolioId) return href;
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}portfolio=${encodeURIComponent(portfolioId)}`;
}

function initializeLanguageMenus() {
  const languageMenus = [...document.querySelectorAll("[data-language-menu]")];
  function setOpen(menu, isOpen, returnFocus = false) {
    menu.open = isOpen;
    const trigger = menu.querySelector(".language-trigger");
    trigger?.setAttribute("aria-expanded", String(isOpen));
    if (returnFocus) trigger?.focus();
  }
  for (const menu of languageMenus) {
    const sync = () => menu
      .querySelector(".language-trigger")
      ?.setAttribute("aria-expanded", String(menu.open));
    sync();
    menu.addEventListener("toggle", sync);
    menu.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !menu.open) return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(menu, false, true);
    });
    menu.addEventListener("click", (event) => {
      if (event.target.closest("[data-language-link]")) setOpen(menu, false);
    });
  }
  document.addEventListener("click", (event) => {
    for (const menu of languageMenus) {
      if (menu.open && !menu.contains(event.target)) setOpen(menu, false);
    }
  });
}

function initializeProjectContext() {
  const link = document.querySelector("[data-context-back]");
  const contextData = document.querySelector("#portfolio-context");
  if (!link || !contextData) return;
  try {
    const config = JSON.parse(contextData.textContent);
    const params = new URLSearchParams(window.location.search);
    const context = resolvePortfolioContext(params.get("portfolio"), config);
    const target = context ?? config.fallback;
    link.href = target.href;
    link.querySelector("[data-back-label]").textContent = target.label;
    if (context) {
      for (const languageLink of document.querySelectorAll("[data-language-link]")) {
        languageLink.href = addPortfolioContext(
          languageLink.getAttribute("href"),
          context.id,
        );
      }
    }
  } catch {
    // Der lokalisierte statische Fallback-Link bleibt erhalten.
  }
}

function initializeImageFallbacks() {
  for (const image of document.querySelectorAll("img[data-preview]")) {
    const revealFallback = () => {
      image.hidden = true;
      const fallback = image.parentElement?.querySelector("[data-image-fallback]");
      if (fallback) fallback.hidden = false;
    };
    image.addEventListener("error", revealFallback, { once: true });
    if (image.complete && image.naturalWidth === 0) revealFallback();
  }
}

if (typeof document !== "undefined") {
  initializeLanguageMenus();
  initializeProjectContext();
  initializeImageFallbacks();
}
