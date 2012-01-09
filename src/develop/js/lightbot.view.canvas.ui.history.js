/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

window.onpopstate = function(event) {
  if (event.state === null) {
    lightBot.ui.showWelcomeScreen(true);
  } else {
    switch (event.state.page) {
      case 'welcomeScreen':
        lightBot.ui.showWelcomeScreen(true);
        break;
      case 'helpScreen':
        lightBot.ui.showHelpScreen(true);
        break;
      case 'achievementsScreen':
        lightBot.ui.showHelpScreen(true);
        break;
      case 'levelSelectScreen':
        lightBot.ui.showLevelSelectScreen(true);
        break;
      case 'gameScreen':
        lightBot.ui.showGameScreen(event.state.level, true);
        break;
      default:
        console.error('Unknown history page: ' + event.state.page)
    }
  }
};