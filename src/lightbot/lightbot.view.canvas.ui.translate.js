/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

$(document).ready(function () {
    i18next.init({
        lng: 'en',
        resources: {
            en: {
                translation: window.LIGHTBOT_TRANSLATIONS // uses the variable from locales/translations.js
            },
        }
    }).then(function (t) {
        updateContent();
    });

    function updateContent() {
        // set translated text for all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(function (element) {
            const key = element.getAttribute('data-i18n');
            element.innerText = i18next.t(key);
        });

        // update title attributes when provided
        document.querySelectorAll('[data-i18n-title]').forEach(function (element) {
            const key = element.getAttribute('data-i18n-title');
            element.setAttribute('title', i18next.t(key));
        });

        // initialize UI components after translations are set
        lightBot.ui.editor.initEditor();
        lightBot.ui.initButtons();
        lightBot.ui.initSlider();
    }
});
