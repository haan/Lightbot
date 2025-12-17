/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function () {

  function display(medal) {
    // prepare the level completed dialog
    $('#levelCompleteDialog .medal').removeClass('medal-gold medal-silver medal-bronze');

    switch (medal) {
      case lightBot.medals.gold:
        $('#levelCompleteDialog .medal').addClass('medal-gold');
        $('#levelCompleteDialog .hint').html('');
        break;
      case lightBot.medals.silver:
        $('#levelCompleteDialog .medal').addClass('medal-silver');
        $("#levelCompleteDialog .hint").html(i18next.t('dialogs.levelComplete.goldMedalHint', { count: lightBot.map.getMedals().gold }));
        //$('#levelCompleteDialog .hint').html('Complete the level with ' + lightBot.map.getMedals().gold + ' instructions or less to receive a gold medal.');
        break;
      case lightBot.medals.bronze:
        $('#levelCompleteDialog .medal').addClass('medal-bronze');
        $("#levelCompleteDialog .hint").html(i18next.t('dialogs.levelComplete.silverMedalHint', { count: lightBot.map.getMedals().silver }));
        //$('#levelCompleteDialog .hint').html('Complete the level with ' + lightBot.map.getMedals().silver + ' instructions or less to receive a silver medal.');
        break;
      case lightBot.medals.noMedal:
        $("#levelCompleteDialog .hint").html(i18next.t('dialogs.levelComplete.bronzeMedalHint', { count: lightBot.map.getMedals().bronze }));
        //$('#levelCompleteDialog .hint').html('Complete the level with ' + lightBot.map.getMedals().bronze + ' instructions or less to receive a bronze medal.');
        break;
      default:
        console.error('Unknown medal "' + medal + '"');
        break;
    }

    $("#levelCompleteDialog .message").html(i18next.t('dialogs.levelComplete.message', { count: lightBot.bot.getNumberOfInstructions() }));
    if (lightBot.ui.dialogs) lightBot.ui.dialogs.open('levelCompleteDialog');
  }

  lightBot.medals.display = display;
})();
