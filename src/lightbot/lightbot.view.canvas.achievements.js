/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function() {

  var queue = null;

  function display(achievements) {
    if (achievements) {
      queue = achievements;
    }

    if (queue.length > 0) {
      var achievement = queue.shift();
      var messageEl = document.querySelector("#achievementDialog .message");
      if (messageEl) messageEl.textContent = achievement.message;
      if (lightBot.ui.dialogs) lightBot.ui.dialogs.open('achievementDialog');
    } else {
      queue = null;
    }
  }

  lightBot.achievements.display = display;
})();
