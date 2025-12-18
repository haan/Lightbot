/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

import i18next from "i18next";

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
          translation: globalThis.LIGHTBOT_TRANSLATIONS,
        },
      },
    })
    .then(function () {
      applyTranslations();
    });
}
