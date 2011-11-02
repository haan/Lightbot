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
        $('#levelCompleteDialog .medal').addClass('medal-silver');
        $('#levelCompleteDialog .message').html('Complete the level with ' + lightBot.map.getMedals().gold + ' instructions or less to receive a gold medal.');
        break;
      case lightBot.medals.bronze:
        $('#levelCompleteDialog .medal').addClass('medal-bronze');
        $('#levelCompleteDialog .message').html('Complete the level with ' + lightBot.map.getMedals().silver + ' instructions or less to receive a silver medal.');
        break;
      case lightBot.medals.noMedal:
        $('#levelCompleteDialog .message').html('Complete the level with ' + lightBot.map.getMedals().bronze + ' instructions or less to receive a bronze medal.');
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