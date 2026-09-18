(function initializePortfolio(root) {
  function normalizePortfolioValue(value) {
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

  function resolvePortfolioContext(rawValue, config) {
    const normalized = normalizePortfolioValue(rawValue);
    const target = config.portfolioTargets.find(
      (candidate) =>
        candidate.id === normalized ||
        normalizePortfolioValue(candidate.label) === normalized,
    );

    if (!target || !config.projectTagIds.includes(target.id)) return null;
    return target;
  }

  function getBackLinkTarget(rawValue, config) {
    return resolvePortfolioContext(rawValue, config) ?? config.fallback;
  }

  function addPortfolioContext(href, portfolioId) {
    if (!portfolioId) return href;
    const separator = href.includes("?") ? "&" : "?";
    return `${href}${separator}portfolio=${encodeURIComponent(portfolioId)}`;
  }

  const api = {
    addPortfolioContext,
    getBackLinkTarget,
    normalizePortfolioValue,
    resolvePortfolioContext,
  };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.PortfolioContext = api;

  if (typeof document === "undefined") return;

  const languageMenus = [...document.querySelectorAll("[data-language-menu]")];
  function setLanguageMenuOpen(menu, isOpen, returnFocus = false) {
    menu.open = isOpen;
    const trigger = menu.querySelector(".language-trigger");
    trigger?.setAttribute("aria-expanded", String(isOpen));
    if (returnFocus) trigger?.focus();
  }

  for (const menu of languageMenus) {
    const syncExpandedState = () => {
      menu
        .querySelector(".language-trigger")
        ?.setAttribute("aria-expanded", String(menu.open));
    };
    syncExpandedState();
    menu.addEventListener("toggle", syncExpandedState);
    menu.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !menu.open) return;
      event.preventDefault();
      event.stopPropagation();
      setLanguageMenuOpen(menu, false, true);
    });
    menu.addEventListener("click", (event) => {
      if (event.target.closest("[data-language-link]")) {
        setLanguageMenuOpen(menu, false);
      }
    });
  }

  document.addEventListener("click", (event) => {
    for (const menu of languageMenus) {
      if (menu.open && !menu.contains(event.target)) {
        setLanguageMenuOpen(menu, false);
      }
    }
  });

  const link = document.querySelector("[data-context-back]");
  const contextData = document.querySelector("#portfolio-context");
  if (link && contextData) {
    try {
      const config = JSON.parse(contextData.textContent);
      const params = new URLSearchParams(window.location.search);
      const context = resolvePortfolioContext(params.get("portfolio"), config);
      const target = context ?? config.fallback;
      link.href = target.href;
      link.querySelector("[data-back-label]").textContent = target.label;

      if (context) {
        for (const languageLink of document.querySelectorAll(
          "[data-language-link]",
        )) {
          languageLink.href = addPortfolioContext(
            languageLink.getAttribute("href"),
            context.id,
          );
        }
      }
    } catch {
      // Der bereits lokalisierte statische Fallback-Link bleibt erhalten.
    }
  }

  for (const image of document.querySelectorAll("img[data-preview]")) {
    const revealFallback = () => {
      image.hidden = true;
      const fallback = image.parentElement?.querySelector(
        "[data-image-fallback]",
      );
      if (fallback) fallback.hidden = false;
    };

    image.addEventListener("error", revealFallback, { once: true });
    if (image.complete && image.naturalWidth === 0) revealFallback();
  }
})(typeof globalThis === "object" ? globalThis : this);
