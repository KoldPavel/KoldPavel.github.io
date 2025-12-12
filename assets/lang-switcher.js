(function () {
  function applyTranslations(translations, locale) {
    const fallback = translations.ru || {};
    const lang = translations[locale] ? locale : "ru";
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      const value = translations[lang]?.[key] ?? fallback[key];
      if (typeof value === "string") {
        node.innerHTML = value;
      }
    });

    document.querySelectorAll("[data-lang-visibility]").forEach((node) => {
      const allowed = node.dataset.langVisibility
        .split(",")
        .map((item) => item.trim());
      node.style.display = allowed.includes(lang) ? "" : "none";
    });

    document.querySelectorAll(".lang-switcher button").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.lang === lang);
    });

    localStorage.setItem("preferred-language", lang);
  }

  window.initLanguageSwitcher = function (translations) {
    const saved = localStorage.getItem("preferred-language");
    applyTranslations(translations, saved || "ru");

    document.querySelectorAll(".lang-switcher button").forEach((btn) => {
      btn.addEventListener("click", () => applyTranslations(translations, btn.dataset.lang));
    });
  };
})();
