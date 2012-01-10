/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

$(document).ready(function() {

    // Prepare
    var History = window.History; // Note: We are using a capital H instead of a lower h

    if ( !History.enabled ) {
         // History.js is disabled for this browser.
         // This is because we can optionally choose to support HTML4 browsers or not.
        return;
    }

    // Bind to StateChange Event
    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
        var State = History.getState(); // Note: We are using History.getState() instead of event.state

        if (State === null) {
          lightBot.ui.showWelcomeScreen(true);
        } else {
          switch (State.data.page) {
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
              lightBot.ui.showGameScreen(State.data.level, true);
              break;
            default:
              console.error('Unknown history page: ' + State.data.page);
              break;
          }
        }
    });

    lightBot.ui.History = History;
    lightBot.ui.showWelcomeScreen();
});