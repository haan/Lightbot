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
      $("#achievementDialog .message").html(achievement.message);
      $("#achievementDialog").dialog("open");
    } else {
      queue = null;
    }
  }

  lightBot.achievements.display = display;
})();