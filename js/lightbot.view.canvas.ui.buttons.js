$(document).ready(function() {
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
    'mouseover':  function() {$(this).addClass('ui-state-hover')},
    'mouseout': function() {$(this).removeClass('ui-state-hover')},
    'click': function () {lightBot.ui.showGameScreen($(this).text())}
  });
});