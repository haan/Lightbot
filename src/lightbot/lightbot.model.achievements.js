/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function() {
  var achievements = {
    achievementsList: [
      {
        name: 'lightbot_achievement_complete_level',
        title: 'Finish Him',
        message: 'Complete a level.',
        check: function() {
          return true;
        }
      },
      {
        name: 'lightbot_achievement_earn_gold_medal',
        title: 'Momma\'s Boy',
        message: 'Earn a gold medal.',
        check: function() {
          if (lightBot.bot.getNumberOfInstructions() <= lightBot.map.getMedals().gold) {
            return true;
          }
          return false;
        }
      },
      {
        name: 'lightbot_achievement_complete_levels_5',
        title: 'Ambitious',
        message: 'Complete 5 levels.',
        check: function() {
          if (getCompletedLevelCount() >= 5) {
            return true;
          }
          return false;
        }
      },
      {
        name: 'lightbot_achievement_complete_levels_10',
        title: 'Dedicated',
        message: 'Complete 10 levels.',
        check: function() {
          if (getCompletedLevelCount() >= 10) {
            return true;
          }
          return false;
        }
      },
      {
        name: 'lightbot_achievement_complete_levels_15',
        title: 'Addicted',
        message: 'Complete 15 levels.',
        check: function() {
          if (getCompletedLevelCount() >= 15) {
            return true;
          }
          return false;
        }
      },
      {
        name: 'lightbot_achievement_complete_levels_bronze',
        title: 'Nerd',
        message: 'Earn bronze medals on all levels.',
        check: function() {
          return getMedalCount(lightBot.medals.bronze) === lightBot.map.getNbrOfLevels();
        }
      },
      {
        name: 'lightbot_achievement_complete_levels_silver',
        title: 'Elite',
        message: 'Earn silver medals on all levels.',
        check: function() {
          return getMedalCount(lightBot.medals.silver) === lightBot.map.getNbrOfLevels();
        }
      },
      {
        name: 'lightbot_achievement_complete_levels_gold',
        title: 'H4X0R',
        message: 'Earn gold medals on all levels.',
        check: function() {
          return getMedalCount(lightBot.medals.gold) === lightBot.map.getNbrOfLevels();
        }
      }
    ],
    hasAchievement: function(n) {
      return localStorage.getItem(n);
    },
    awardAchievements: function() {
      var achievementsAwarded = [];
      for (var i = 0; i < this.achievementsList.length; i++) {
        if (!this.hasAchievement(this.achievementsList[i].name) && this.achievementsList[i].check()) {
          localStorage.setItem(this.achievementsList[i].name, true);
          achievementsAwarded.push(this.achievementsList[i]);
        }
      }
      return achievementsAwarded;
    },
    getAchievementsList: function() {
      return this.achievementsList;
    }
  };

  function getCompletedLevelCount() {
    var count = 0;
    for (var i = 0; i < lightBot.map.getNbrOfLevels(); i++) {
      if (localStorage.getItem('lightbot_level_' + i)) {
        count++;
      }
    }
    return count;
  }

  function getMedalCount(quality) {
    var count = 0;
    for (var i = 0; i < lightBot.map.getNbrOfLevels(); i++) {
      if (localStorage.getItem('lightbot_level_' + i) && parseInt(localStorage.getItem('lightbot_level_' + i), 10) >= quality) {
        count++;
      }
    }
    return count;
  }

  lightBot.achievements = achievements;
})();