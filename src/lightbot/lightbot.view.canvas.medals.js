/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

import i18next from "i18next";

(function () {

  function display(medal) {
    var medalEl = document.querySelector('#levelCompleteDialog .medal');
    var hintEl = document.querySelector('#levelCompleteDialog .hint');
    var messageEl = document.querySelector('#levelCompleteDialog .message');

    if (medalEl && medalEl.classList) {
      medalEl.classList.remove('medal-gold', 'medal-silver', 'medal-bronze');
    }

    switch (medal) {
      case lightBot.medals.gold:
        if (medalEl && medalEl.classList) medalEl.classList.add('medal-gold');
        if (hintEl) hintEl.textContent = '';
        break;
      case lightBot.medals.silver:
        if (medalEl && medalEl.classList) medalEl.classList.add('medal-silver');
        if (hintEl) hintEl.textContent = i18next.t('dialogs.levelComplete.goldMedalHint', { count: lightBot.map.getMedals().gold });
        break;
      case lightBot.medals.bronze:
        if (medalEl && medalEl.classList) medalEl.classList.add('medal-bronze');
        if (hintEl) hintEl.textContent = i18next.t('dialogs.levelComplete.silverMedalHint', { count: lightBot.map.getMedals().silver });
        break;
      case lightBot.medals.noMedal:
        if (hintEl) hintEl.textContent = i18next.t('dialogs.levelComplete.bronzeMedalHint', { count: lightBot.map.getMedals().bronze });
        break;
      default:
        console.error('Unknown medal "' + medal + '"');
        break;
    }

    if (messageEl) messageEl.textContent = i18next.t('dialogs.levelComplete.message', { count: lightBot.bot.getNumberOfInstructions() });
    if (lightBot.ui.dialogs) lightBot.ui.dialogs.open('levelCompleteDialog');
  }

  lightBot.medals.display = display;
})();
