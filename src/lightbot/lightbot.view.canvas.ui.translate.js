/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

import i18next from "i18next";

document.addEventListener("DOMContentLoaded", function () {
  i18next
    .init({
      lng: "en",
      resources: {
        en: {
          translation: globalThis.LIGHTBOT_TRANSLATIONS,
        },
      },
    })
    .then(function () {
      updateContent();
    });

  function updateContent() {
    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      var key = element.getAttribute("data-i18n");
      element.innerText = i18next.t(key);
    });

    document.querySelectorAll("[data-i18n-title]").forEach(function (element) {
      var key = element.getAttribute("data-i18n-title");
      element.setAttribute("title", i18next.t(key));
    });

    lightBot.ui.editor.initEditor();
    lightBot.ui.initButtons();
    lightBot.ui.initSlider();
  }
});
