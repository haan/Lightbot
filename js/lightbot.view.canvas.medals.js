/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function() {

  function display(medal) {
    // prepare the level completed dialog
    $('#levelCompleteDialog .medal').removeClass('medal-gold medal-silver medal-bronze');

    switch (medal) {
      case lightBot.medals.gold:
        $('#levelCompleteDialog .medal').addClass('medal-gold');
        $('#levelCompleteDialog .message').html('');
        break;
      case lightBot.medals.silver:
        break;
      case lightBot.medals.bronze:
        break;
      case lightBot.medals.noMedal:
        break;
      default:
        console.error('Unknown medal "' + medal + '"');
        break;
    }

    $("#levelCompleteDialog .nbrOfInstructions").html(lightBot.bot.getNumberOfInstructions());
    $("#levelCompleteDialog").dialog("open");
  }

  lightBot.medals.display = display;
})();