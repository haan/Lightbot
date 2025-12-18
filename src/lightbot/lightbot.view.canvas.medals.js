// Medal dialog wiring: turns a medal enum into dialog UI (and translated hints).
import i18next from "i18next";

export function extendMedalsView(params) {
  if (!params) throw new Error("extendMedalsView: missing params");
  var medals = params.medals;
  var map = params.map;
  var bot = params.bot;
  var dialogs = params.dialogs;
  if (!medals) throw new Error("extendMedalsView: missing medals");
  if (!map) throw new Error("extendMedalsView: missing map");
  if (!bot) throw new Error("extendMedalsView: missing bot");
  if (!dialogs) throw new Error("extendMedalsView: missing dialogs");

  function display(medal) {
    var medalEl = document.querySelector('#levelCompleteDialog .medal');
    var hintEl = document.querySelector('#levelCompleteDialog .hint');
    var messageEl = document.querySelector('#levelCompleteDialog .message');

    if (medalEl && medalEl.classList) {
      medalEl.classList.remove('medal-gold', 'medal-silver', 'medal-bronze');
    }

    switch (medal) {
      case medals.gold:
        if (medalEl && medalEl.classList) medalEl.classList.add('medal-gold');
        if (hintEl) hintEl.textContent = '';
        break;
      case medals.silver:
        if (medalEl && medalEl.classList) medalEl.classList.add('medal-silver');
        if (hintEl) hintEl.textContent = i18next.t('dialogs.levelComplete.goldMedalHint', { count: map.getMedals().gold });
        break;
      case medals.bronze:
        if (medalEl && medalEl.classList) medalEl.classList.add('medal-bronze');
        if (hintEl) hintEl.textContent = i18next.t('dialogs.levelComplete.silverMedalHint', { count: map.getMedals().silver });
        break;
      case medals.noMedal:
        if (hintEl) hintEl.textContent = i18next.t('dialogs.levelComplete.bronzeMedalHint', { count: map.getMedals().bronze });
        break;
      default:
        console.error('Unknown medal "' + medal + '"');
        break;
    }

    if (messageEl) messageEl.textContent = i18next.t('dialogs.levelComplete.message', { count: bot.getNumberOfInstructions() });
    dialogs.open('levelCompleteDialog');
  }

  medals.display = display;
  return medals;
}
