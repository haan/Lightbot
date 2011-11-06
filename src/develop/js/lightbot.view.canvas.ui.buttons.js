/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

$(document).ready(function() {

  // show help screen button
  $('.helpButton').button({
    icons: {
      primary: "ui-icon-help"
    }
  }).click(function() {
    lightBot.ui.showHelpScreen();
  });

  // show welcome screen button
  $('.mainMenuButton').button({
    icons: {
      primary: "ui-icon-home"
    }
  }).click(function() {
    lightBot.ui.showWelcomeScreen();
  });

  // show achievements screen button
  $('.achievementsButton').button({
    icons: {
      primary: "ui-icon-flag"
    }
  }).click(function() {
    lightBot.ui.showAchievementsScreen();
  });

  // show level select screen button
  $('.levelSelectButton').button({
    icons: {
      primary: "ui-icon-power"
    }
  }).click(function() {
    lightBot.ui.showLevelSelectScreen();
  });
  $('#gameScreen .levelSelectButton').button('option', {icons: {primary: 'ui-icon-home'}});

  // show game screen buttons
  $('#levelList li').live({
    'mouseover':  function() {$(this).addClass('ui-state-hover');},
    'mouseout': function() {$(this).removeClass('ui-state-hover');},
    'click': function () {lightBot.ui.showGameScreen($(this).text());}
  });

  // audio toggle buttons
  $('.audioToggleButton').button({
    icons: {
      primary: "ui-icon-volume-on"
    },
    text: false
  }).click(function() {
    lightBot.ui.media.toggleAudio();
  });

  // run program button
  $('#runButton').button({
    icons: {
      primary: "ui-icon-play"
    }
  }).click(function() {
    if (lightBot.bot.isInExecutionMode()) {
      // reset the map (resets the bot as well)
      lightBot.map.reset();

      $(this).button('option', {label: 'Run', icons: {primary: 'ui-icon-play'}}).removeClass('ui-state-highlight');
    } else {
      var instructions = lightBot.ui.editor.getInstructions($('#programContainer > div > ul > li'));
      lightBot.bot.queueInstructions(instructions);
      lightBot.bot.execute();

      $(this).button('option', {label: 'Stop', icons: {primary: 'ui-icon-stop'}}).addClass('ui-state-highlight');
    }
  });

  // help screen accordion (header buttons)
  $('#helpScreenAccordion').accordion({
    autoHeight: false,
    navigation: true,
    icons: false,
    change: function(event, ui) {
      lightBot.ui.media.playVideo($('#helpScreenAccordion h3').index(ui.newHeader));
    }
  });
});