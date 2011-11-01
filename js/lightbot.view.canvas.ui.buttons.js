/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

$(document).ready(function() {
  // hover effect for all buttons
  $('button').hover(function (){
    $(this).addClass('ui-state-hover');
  }, function() {
    $(this).removeClass('ui-state-hover');
  });

  // show help screen button
  $('.helpButton').click(function() {
    lightBot.ui.showHelpScreen();
  });

  // show welcome screen button
  $('.mainMenuButton').click(function() {
    lightBot.ui.showWelcomeScreen();
  });

  // show achievements screen button
  $('.achievementsButton').click(function() {
    lightBot.ui.showAchievementsScreen();
  });

  // show level select screen button
  $('.levelSelectButton').click(function() {
    lightBot.ui.showLevelSelectScreen();
  });

  // show game screen buttons
  $('#levelList li').live({
    'mouseover':  function() {$(this).addClass('ui-state-hover');},
    'mouseout': function() {$(this).removeClass('ui-state-hover');},
    'click': function () {lightBot.ui.showGameScreen($(this).text());}
  });

  // audio toggle buttons
  $('.audioToggleButton').click(function() {
    lightBot.ui.media.toggleAudio();
  });

  // run program button
  $('#runButton').click(function() {
    if (lightBot.bot.isInExecutionMode()) {
      // reset the map (resets the bot as well)
      lightBot.map.reset();

      $(this).children('span.ui-button-text').text('Run');
      $(this).removeClass('ui-state-active');
    } else {
      instructions = lightBot.ui.editor.getInstructions($('#programContainer > div > ul > li'));
      lightBot.bot.queueInstructions(instructions);
      lightBot.bot.execute();

      $(this).children('span.ui-button-text').text('Reset');
      $(this).addClass('ui-state-active');
    }
  });

  // help screen accordion (heaser buttons)
  $('#helpScreenAccordion').accordion({
    autoHeight: false,
    navigation: true,
    icons: false,
    change: function(event, ui) {
      lightBot.ui.media.playVideo($('#helpScreenAccordion h3').index(ui.newHeader));
    }
  });
});