// Achievements: check completion criteria and persist unlocked achievements in localStorage.

export function createAchievements(params) {
  if (!params) throw new Error("createAchievements: missing params");
  var bot = params.bot;
  var map = params.map;
  var medals = params.medals;
  var storage = params.storage || localStorage;
  if (!bot) throw new Error("createAchievements: missing bot");
  if (!map) throw new Error("createAchievements: missing map");
  if (!medals) throw new Error("createAchievements: missing medals");

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
          if (bot.getNumberOfInstructions() <= map.getMedals().gold) {
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
          return getMedalCount(medals.bronze) === map.getNbrOfLevels();
        }
      },
      {
        name: 'lightbot_achievement_complete_levels_silver',
        title: 'Elite',
        message: 'Earn silver medals on all levels.',
        check: function() {
          return getMedalCount(medals.silver) === map.getNbrOfLevels();
        }
      },
      {
        name: 'lightbot_achievement_complete_levels_gold',
        title: 'H4X0R',
        message: 'Earn gold medals on all levels.',
        check: function() {
          return getMedalCount(medals.gold) === map.getNbrOfLevels();
        }
      }
    ],
    hasAchievement: function(n) {
      return storage.getItem(n);
    },
    awardAchievements: function() {
      var achievementsAwarded = [];
      for (var i = 0; i < this.achievementsList.length; i++) {
        if (!this.hasAchievement(this.achievementsList[i].name) && this.achievementsList[i].check()) {
          storage.setItem(this.achievementsList[i].name, true);
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
    for (var i = 0; i < map.getNbrOfLevels(); i++) {
      if (storage.getItem('lightbot_level_' + i)) {
        count++;
      }
    }
    return count;
  }

  function getMedalCount(quality) {
    var count = 0;
    for (var i = 0; i < map.getNbrOfLevels(); i++) {
      if (storage.getItem('lightbot_level_' + i) && parseInt(storage.getItem('lightbot_level_' + i), 10) >= quality) {
        count++;
      }
    }
    return count;
  }

  return achievements;
}
