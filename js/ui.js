function playMenuAudio() {
  if (audioPlayer.data('jPlayer').status.media.mp3 != media.audio.menu.mp3) {
    audioPlayer.jPlayer('setMedia', media.audio.menu).jPlayer('play');
  }
}

function playGameAudio() {
  if (audioPlayer.data('jPlayer').status.media.mp3 != media.audio.game.mp3) {
    audioPlayer.jPlayer('setMedia', media.audio.game);
    if (!$('#audioToggleButton').hasClass('ui-state-active')) {
      audioPlayer.jPlayer('play');
    }
  }
}

function showAchievementsScreen() {
  playMenuAudio();

  var enabled = false;
  $('#achievementsList li').remove();

  var achievements = getAchievementList();
  for (var i = 0; i < achievements.length; i++) {
    enabled = hasAchievement(achievements[i]) ? true : false;
    $('<li class="ui-widget ' + ((enabled) ? 'ui-state-default' : 'ui-state-disabled') + ' ui-corner-all"><img src="img/achievements/'+achievements[i]+'.png"><h3>'+getAchievementTitle(achievements[i])+'</h3><p>'+getAchievementMessage(achievements[i])+'</p></li>').appendTo('#achievementsList');
  }

  $('.ui-screen').hide();
  $('#achievementsScreen').show();
}

function showLevelSelectScreen() {
  playMenuAudio();

  $('#levelList li').remove();
  
  for (var i = 0; i < lightBot.getNbrOfLevels(); i++) {
    var cookie = $.cookie('lightbot_level_'+i);
    var medal = '';
    if (cookie) {
      switch (cookie) {
        case '4':
          medal = 'medal-gold';
          break;
        case '3':
          medal = 'medal-silver';
          break;
        case '2':
          medal = 'medal-bronze';
          break;
      }
      $('<li class="ui-state-default ui-state-highlight"><span class="medal '+medal+'" style="position: absolute; bottom: 2px; right: 0px"></span><span>'+i+'</span></li>').appendTo('#levelList');
    } else {
      $('<li class="ui-state-default">'+i+'</li>').appendTo('#levelList');
    }
  }
  $('.ui-screen').hide();
  $('#levelSelectScreen').show();
}

function showWelcomeScreen() {
  playMenuAudio();

  $('.ui-screen').hide();
  $('#welcomeScreen').show();
}

function showHelpScreen() {
  playMenuAudio();

  $('.ui-screen').hide();
  $('#helpScreen').show();
}

function showGameScreen(level) {
  playGameAudio();

  lightBot.reset();

  // load the map
  lightBot.loadMap(level);
  
  $('.ui-screen').hide();

  //clear all instructions in main program
  $('#programContainer li').remove();

  //append placeholder instruction 
  $('#programContainer ul').append('<li class="ui-state-default placeholder"><p class="placeholder">Drop your instructions here</p></li>');

  // reset the run button
  $('#runButton').removeClass('ui-state-active').children('span.ui-button-text').text('Run');

  // show the game screen
  $('#gameScreen').show();
}