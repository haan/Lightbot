// i18next setup and DOM translation pass for elements with `data-i18n*` attributes.
import i18next from "i18next";
import { LIGHTBOT_TRANSLATIONS } from "../locales/translations.js";

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    var key = element.getAttribute("data-i18n");
    element.textContent = i18next.t(key);
  });

  document.querySelectorAll("[data-i18n-title]").forEach(function (element) {
    var key = element.getAttribute("data-i18n-title");
    element.setAttribute("title", i18next.t(key));
  });
}

export function initI18n() {
  return i18next
    .init({
      lng: "en",
      resources: {
        en: {
          translation: LIGHTBOT_TRANSLATIONS,
        },
      },
    })
    .then(function () {
      applyTranslations();
    });
}
