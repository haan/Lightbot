/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function () {

  var ui = {
    _setRunButtonState: function (isRunning) {
      var btn = $('#runButton');
      if (!btn.length) return;

      btn.toggleClass('btn-primary', !isRunning);
      btn.toggleClass('btn-error', isRunning);
      btn.attr('title', isRunning ? i18next.t('stop') : i18next.t('gameScreen.run'));
      btn.find('.lb-run-icon').toggleClass('hidden', isRunning);
      btn.find('.lb-stop-icon').toggleClass('hidden', !isRunning);
    },
    showWelcomeScreen: function (hist) {
      lightBot.ui.media.playMenuAudio();

      // save in history if parameter hist is not set and then set the new page title
      if (hist == null && lightBot.ui.History) lightBot.ui.History.pushState({ page: 'welcomeScreen' });
      $('title').text('Lightbot - Welcome');

      $('.lb-screen').addClass('hidden');
      $('#welcomeScreen').removeClass('hidden');
    },
    showHelpScreen: function (hist) {
      lightBot.ui.media.playMenuAudio();

      // save in history if parameter hist is not set and then set the new page title
      if (hist == null && lightBot.ui.History) lightBot.ui.History.pushState({ page: 'helpScreen' });
      $('title').text('Lightbot - Help');

      $('.lb-screen').addClass('hidden');
      $('#helpScreen').removeClass('hidden');
    },
    showAchievementsScreen: function (hist) {
      lightBot.ui.media.playMenuAudio();

      var enabled = false;

      $('#achievementsList').empty();
      var achievements = lightBot.achievements.getAchievementsList();
      for (var i = 0; i < achievements.length; i++) {
        enabled = lightBot.achievements.hasAchievement(achievements[i].name) ? true : false;
        $(
          '<li class="list-row ' + ((enabled) ? '' : 'opacity-40') + ' py-3">' +
            '<div><img class="size-10 rounded-box" src="img/achievements/' + achievements[i].name + '.png" alt=""></div>' +
            '<div class="flex-1">' +
              '<div class="font-bold">' + achievements[i].title + '</div>' +
              '<div class="text-sm opacity-70">' + achievements[i].message + '</div>' +
            '</div>' +
          '</li>'
        ).appendTo('#achievementsList');
      }

      // save in history if parameter hist is not set and then set the new page title
      if (hist == null && lightBot.ui.History) lightBot.ui.History.pushState({ page: 'achievementsScreen' });
      $('title').text('Lightbot - Achievements');

      $('.lb-screen').addClass('hidden');
      $('#achievementsScreen').removeClass('hidden');
    },
    showLevelSelectScreen: function (hist) {
      lightBot.ui.media.playMenuAudio();

      $('#levelList').empty();
      for (var i = 0; i < lightBot.map.getNbrOfLevels(); i++) {
        var item = parseInt(localStorage.getItem('lightbot_level_' + i), 10);
        var medal = '';
        var tile = $('<div class="lb-level-tile relative select-none w-34 h-30 rounded-box bg-base-200 hover:bg-base-300 shadow cursor-pointer flex items-center justify-center text-4xl font-black"></div>');
        tile.attr('data-level', i).text(i);

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
          tile.addClass('bg-accent ring-2 ring-primary/30');
          tile.append('<span class="medal ' + medal + ' absolute bottom-1 right-1"></span>');
        }
        tile.appendTo('#levelList');
      }

      // save in history if parameter hist is not set and then set the new page title
      if (hist == null && lightBot.ui.History) lightBot.ui.History.pushState({ page: 'levelSelectScreen' });
      $('title').text('Lightbot - Level Select');

      $('.lb-screen').addClass('hidden');
      $('#levelSelectScreen').removeClass('hidden');
    },
    showGameScreen: function (level, hist) {
      lightBot.ui.media.playGameAudio();

      // load the map
      lightBot.map.loadMap(level);

      // save in history if parameter hist is not set and then set the new page title
      if (hist == null && lightBot.ui.History) lightBot.ui.History.pushState({ page: 'gameScreen', 'level': level });
      $('title').text('Lightbot - Level ' + level);

      $('.lb-screen').addClass('hidden');

      // clear all instructions in main program
      $('#programContainer ul').empty();

      if (localStorage.getItem('lightbot_program_level_' + level)) {
        lightBot.ui.editor.loadProgram();
      } else {
        // leave program empty (drop zone is handled by SortableJS + CSS min-height)
      }

      // reset the run button
      lightBot.ui._setRunButtonState(false);

      // show the game screen
      $('#gameScreen').removeClass('hidden');
    },
    initButtons: function () {
      // show help screen button
      $('.helpButton').click(function () {
        lightBot.ui.showHelpScreen();
      });

      // show welcome screen button
      $('.mainMenuButton').click(function () {
        lightBot.ui.showWelcomeScreen();
      });

      // show achievements screen button
      $('.achievementsButton').click(function () {
        lightBot.ui.showAchievementsScreen();
      });

      // show level select screen button
      $('.levelSelectButton').click(function () {
        lightBot.ui.showLevelSelectScreen();
      });

      // show game screen buttons
      $('#levelList').on('click', '.lb-level-tile', function () {
        lightBot.ui.showGameScreen(parseInt($(this).attr('data-level'), 10));
      });

      // audio toggle buttons
      $('.audioToggleButton').click(function () {
        lightBot.ui.media.toggleAudio();
      });

      // run program button
      $('#runButton').click(function () {
        if (lightBot.bot.isInExecutionMode()) {
          // reset the map (resets the bot as well)
          lightBot.map.reset();

          lightBot.ui._setRunButtonState(false);
        } else {
          var instructions = lightBot.ui.editor.getProgramInstructions();
          lightBot.bot.queueInstructions(instructions);
          lightBot.bot.execute();

          lightBot.ui._setRunButtonState(true);
        }
      });

      // clear program button
      $('#clearButton').click(function () {
        $('#programContainer ul').empty();
        lightBot.ui.editor.saveProgram();
      });

      // help screen accordion (play video on selection)
      $('#helpScreenAccordion').on('change', 'input[type="radio"]', function () {
        if (!this.checked) return;
        var idx = parseInt($(this).closest('[data-video]').attr('data-video'), 10);
        if (!isNaN(idx)) lightBot.ui.media.playVideo(idx);
      });
    },
    initSlider: function () {
      // speed slider
      $('#speedSlider')
        .val(lightBot.speedMultiplier)
        .on('input change', function () {
          lightBot.speedMultiplier = parseFloat($(this).val());
        });
    }
  };

  lightBot.ui = ui;
})();
