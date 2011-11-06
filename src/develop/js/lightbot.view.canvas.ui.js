/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function() {

  var ui = {
    showWelcomeScreen: function() {
      lightBot.ui.media.playMenuAudio();

      $('.ui-screen').hide();
      $('#welcomeScreen').show();
    },
    showHelpScreen: function() {
      lightBot.ui.media.playMenuAudio();

      $('.ui-screen').hide();
      $('#helpScreen').show();
    },
    showAchievementsScreen: function() {
      lightBot.ui.media.playMenuAudio();

      var enabled = false;

      $('#achievementsList').empty();
      var achievements = lightBot.achievements.getAchievementsList();
      for (var i = 0; i < achievements.length; i++) {
        enabled = lightBot.achievements.hasAchievement(achievements[i].name) ? true : false;
        $('<li class="' + ((enabled) ? '' : 'ui-state-disabled') + '"><img src="img/achievements/'+achievements[i].name+'.png"><h3>'+achievements[i].title+'</h3><p>'+achievements[i].message+'</p></li>').appendTo('#achievementsList');
      }

      $('.ui-screen').hide();
      $('#achievementsScreen').show();
    },
    showLevelSelectScreen: function() {
      lightBot.ui.media.playMenuAudio();

      $('#levelList').empty();
      for (var i = 0; i < lightBot.map.getNbrOfLevels(); i++) {
        var item = parseInt(localStorage.getItem('lightbot_level_'+i), 10);
        var medal = '';
        if (item) {
          switch (item) {
            case lightBot.medals.gold:
              medal = 'medal-gold';
              break;
            case lightBot.medals.silver:
              medal = 'medal-silver';
              break;
            case lightBot.medals.bronze:
              medal = 'medal-bronze';
              break;
            case lightBot.medals.noMedal:
              break;
            default:
              console.error('Unknown medal "' + medal + '"');
              break;
          }
          $('<li class="ui-state-highlight"><span class="medal '+medal+'" style="position: absolute; bottom: 2px; right: 0px"></span><span>'+i+'</span></li>').appendTo('#levelList');
        } else {
          $('<li>'+i+'</li>').appendTo('#levelList');
        }
      }

      $('.ui-screen').hide();
      $('#levelSelectScreen').show();
    },
    showGameScreen: function(level) {
      lightBot.ui.media.playGameAudio();

      // load the map
      lightBot.map.loadMap(level);

      $('.ui-screen').hide();

      //clear all instructions in main program
      $('#programContainer li').remove();

      //append placeholder instruction
      $('#programContainer ul').append('<li class="ui-state-default placeholder"><p class="placeholder">Drop your instructions here</p></li>');

      // reset the run button
      $('#runButton').button('option', {label: 'Run', icons: {primary: 'ui-icon-play'}}).removeClass('ui-state-highlight');

      // show the game screen
      $('#gameScreen').show();
    }
  };

  lightBot.ui = ui;
})();