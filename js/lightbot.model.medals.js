/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function() {
  var medals = {
    gold: 4,
    silver: 3,
    bronze: 2,
    noMedal: 1,
    awardMedal: function() {
      var nbrInstructions = lightBot.bot.getNumberOfInstructions();
      var lvlMedals = lightBot.map.getMedals();
      var medal = this.noMedal;
      if (nbrInstructions <= lvlMedals.gold) {
        medal = this.gold;
      } else if (nbrInstructions <= lvlMedals.silver) {
        medal = this.silver;
      } else if (nbrInstructions <= lvlMedals.bronze) {
        medal = this.bronze;
      }
      if (!$.cookie('lightbot_level_' + lightBot.map.getLevelNumber()) || parseInt($.cookie('lightbot_level_' + lightBot.map.getLevelNumber()), 10) < medal) {
        $.cookie('lightbot_level_' + lightBot.map.getLevelNumber(), medal, { expires: 365 });
      }
      return medal;
    }
  };

  lightBot.medals = medals;
})();