// Ambitious - complete 5 levels

// Dedicated - complete 10 levels

// Addicted - complete 15 levels

// Nerd - earn bronze medals on all levels

// Elite - earn silver medals on all levels

// H4X0R - earn gold medals on all levels

// Completionist - complete a level with 100 instructions (?)

function getAchievementList() {
  return ['lightbot_achievement_complete_level', 'lightbot_achievement_earn_gold_medal', 'lightbot_achievement_complete_levels_5', 'lightbot_achievement_complete_levels_10', 'lightbot_achievement_complete_levels_15', 'lightbot_achievement_complete_levels_bronze', 'lightbot_achievement_complete_levels_silver', 'lightbot_achievement_complete_levels_gold'];
}

function getCompletedLevelCount() {
  var count = 0;
  for (var i = 0; i < lightBot.getNbrOfLevels(); i++) {
    if ($.cookie('lightbot_level_'+i)) {
      count++;
    }
  }
  return count;
}

function getMedalCount(quality) {
  var count = 0;
  for (var i = 0; i < lightBot.getNbrOfLevels(); i++) {
    if ($.cookie('lightbot_level_'+i) && parseInt($.cookie('lightbot_level_' + i)) >= quality) {
      count++;
    }
  }
  return count;
}

function hasAchieved(achievementName) {
  switch (achievementName) {
    case 'lightbot_achievement_complete_level':
      return true; // this code is only executed if he has completed a level
    case 'lightbot_achievement_earn_gold_medal':
      return lightBot.getBot().getNumberOfInstructions() <= lightBot.getMap().getMedals().gold;
    case 'lightbot_achievement_complete_levels_5':
      return getCompletedLevelCount() >= 5;
    case 'lightbot_achievement_complete_levels_10':
      return getCompletedLevelCount() >= 10;
    case 'lightbot_achievement_complete_levels_15':
      return getCompletedLevelCount() >= 15;
    case 'lightbot_achievement_complete_levels_bronze':
      return getMedalCount(2) == lightBot.getNbrOfLevels();
    case 'lightbot_achievement_complete_levels_silver':
      return getMedalCount(3) == lightBot.getNbrOfLevels();
    case 'lightbot_achievement_complete_levels_gold':
      return getMedalCount(4) == lightBot.getNbrOfLevels();
  } 
}

function hasAchievement(achievementName) {
  return $.cookie(achievementName);
}

function setAchievement(achievementName) {
  $.cookie(achievementName, true, { expires: 365 });
}

function getAchievementTitle(achievementName) {
  switch (achievementName) {
    case 'lightbot_achievement_complete_level':
      return 'Finish Him';
    case 'lightbot_achievement_earn_gold_medal':
      return 'Momma\'s Boy';
    case 'lightbot_achievement_complete_levels_5':
      return 'Ambitious';
    case 'lightbot_achievement_complete_levels_10':
      return 'Dedicated';
    case 'lightbot_achievement_complete_levels_15':
      return 'Addicted';
    case 'lightbot_achievement_complete_levels_bronze':
      return 'Nerd';
    case 'lightbot_achievement_complete_levels_silver':
      return 'Elite';
    case 'lightbot_achievement_complete_levels_gold':
      return 'H4X0R';
  }  
}

function getAchievementMessage(achievementName) {
  switch (achievementName) {
    case 'lightbot_achievement_complete_level':
      return 'Complete your first level.';
    case 'lightbot_achievement_earn_gold_medal':
      return 'Earn a gold medal.';
    case 'lightbot_achievement_complete_levels_5':
      return 'Complete 5 levels.';
    case 'lightbot_achievement_complete_levels_10':
      return 'Complete 10 levels.';
    case 'lightbot_achievement_complete_levels_15':
      return 'Complete 15 levels.';
    case 'lightbot_achievement_complete_levels_bronze':
      return 'Earn bronze medals on all levels';
    case 'lightbot_achievement_complete_levels_silver':
      return 'Earn silver medals on all levels';
    case 'lightbot_achievement_complete_levels_gold':
      return 'Earn gold medals on all levels';
  }
}