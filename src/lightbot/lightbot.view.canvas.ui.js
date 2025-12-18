/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

import i18next from "i18next";

(function () {

  function hideAllScreens() {
    var screens = document.querySelectorAll(".lb-screen");
    for (var i = 0; i < screens.length; i++) screens[i].classList.add("hidden");
  }

  function showScreen(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove("hidden");
  }

  var ui = {
    _setRunButtonState: function (isRunning) {
      var btn = document.getElementById("runButton");
      if (!btn) return;

      btn.classList.toggle("btn-primary", !isRunning);
      btn.classList.toggle("btn-error", isRunning);
      btn.setAttribute("title", isRunning ? i18next.t("stop") : i18next.t("gameScreen.run"));

      var runIcon = btn.querySelector(".lb-run-icon");
      if (runIcon && runIcon.classList) runIcon.classList.toggle("hidden", isRunning);
      var stopIcon = btn.querySelector(".lb-stop-icon");
      if (stopIcon && stopIcon.classList) stopIcon.classList.toggle("hidden", !isRunning);
    },
    showWelcomeScreen: function (hist) {
      lightBot.ui.media.playMenuAudio();

      // save in history if parameter hist is not set and then set the new page title
      if (hist == null && lightBot.ui.History) lightBot.ui.History.pushState({ page: 'welcomeScreen' });
      document.title = "Lightbot - Welcome";

      hideAllScreens();
      showScreen("welcomeScreen");
    },
    showHelpScreen: function (hist) {
      lightBot.ui.media.playMenuAudio();

      // save in history if parameter hist is not set and then set the new page title
      if (hist == null && lightBot.ui.History) lightBot.ui.History.pushState({ page: 'helpScreen' });
      document.title = "Lightbot - Help";

      hideAllScreens();
      showScreen("helpScreen");

      var firstRadio = document.querySelector('#helpScreenAccordion [data-video="0"] input[type="radio"]');
      if (firstRadio) firstRadio.checked = true;
      if (lightBot.ui && lightBot.ui.media && typeof lightBot.ui.media.playVideo === "function") {
        lightBot.ui.media.playVideo(0);
      }
    },
    showAchievementsScreen: function (hist) {
      lightBot.ui.media.playMenuAudio();

      var list = document.getElementById("achievementsList");
      if (list) list.textContent = "";

      var achievements = lightBot.achievements.getAchievementsList();
      for (var i = 0; i < achievements.length; i++) {
        var enabled = !!lightBot.achievements.hasAchievement(achievements[i].name);
        if (!list) continue;

        var li = document.createElement("li");
        li.className = "list-row " + (enabled ? "" : "opacity-40") + " py-3";

        var imgWrap = document.createElement("div");
        var img = document.createElement("img");
        img.className = "size-10 rounded-box";
        img.src = "img/achievements/" + achievements[i].name + ".png";
        img.alt = "";
        imgWrap.appendChild(img);

        var content = document.createElement("div");
        content.className = "flex-1";

        var title = document.createElement("div");
        title.className = "font-bold";
        title.textContent = achievements[i].title;

        var message = document.createElement("div");
        message.className = "text-sm opacity-70";
        message.textContent = achievements[i].message;

        content.appendChild(title);
        content.appendChild(message);

        li.appendChild(imgWrap);
        li.appendChild(content);
        list.appendChild(li);
      }

      // save in history if parameter hist is not set and then set the new page title
      if (hist == null && lightBot.ui.History) lightBot.ui.History.pushState({ page: 'achievementsScreen' });
      document.title = "Lightbot - Achievements";

      hideAllScreens();
      showScreen("achievementsScreen");
    },
    showLevelSelectScreen: function (hist) {
      lightBot.ui.media.playMenuAudio();

      var levelList = document.getElementById("levelList");
      if (levelList) levelList.textContent = "";

      for (var i = 0; i < lightBot.map.getNbrOfLevels(); i++) {
        var item = parseInt(localStorage.getItem('lightbot_level_' + i), 10);
        var medal = "";

        if (!levelList) continue;
        var tile = document.createElement("div");
        tile.className = "lb-level-tile relative select-none w-34 h-30 rounded-box bg-base-200 hover:bg-base-300 shadow cursor-pointer flex items-center justify-center text-4xl font-black";
        tile.dataset.level = String(i);
        tile.textContent = String(i);

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
          tile.classList.add("bg-accent", "ring-2", "ring-primary/30");
          var medalEl = document.createElement("span");
          medalEl.className = "medal " + medal + " absolute bottom-1 right-1";
          tile.appendChild(medalEl);
        }
        levelList.appendChild(tile);
      }

      // save in history if parameter hist is not set and then set the new page title
      if (hist == null && lightBot.ui.History) lightBot.ui.History.pushState({ page: 'levelSelectScreen' });
      document.title = "Lightbot - Level Select";

      hideAllScreens();
      showScreen("levelSelectScreen");
    },
    showGameScreen: function (level, hist) {
      lightBot.ui.media.playGameAudio();

      // load the map
      lightBot.map.loadMap(level);

      // save in history if parameter hist is not set and then set the new page title
      if (hist == null && lightBot.ui.History) lightBot.ui.History.pushState({ page: 'gameScreen', 'level': level });
      document.title = "Lightbot - Level " + level;

      hideAllScreens();

      // clear all instructions in main program
      var programList = document.querySelector("#programContainer ul");
      if (programList) programList.textContent = "";

      if (localStorage.getItem('lightbot_program_level_' + level)) {
        lightBot.ui.editor.loadProgram();
      } else {
        // leave program empty (drop zone is handled by SortableJS + CSS min-height)
      }

      // reset the run button
      lightBot.ui._setRunButtonState(false);

      // show the game screen
      showScreen("gameScreen");
    },
    initButtons: function () {
      // show help screen button
      document.querySelectorAll(".helpButton").forEach(function (el) {
        el.addEventListener("click", function () {
          lightBot.ui.showHelpScreen();
        });
      });

      // show welcome screen button
      document.querySelectorAll(".mainMenuButton").forEach(function (el) {
        el.addEventListener("click", function () {
          lightBot.ui.showWelcomeScreen();
        });
      });

      // show achievements screen button
      document.querySelectorAll(".achievementsButton").forEach(function (el) {
        el.addEventListener("click", function () {
          lightBot.ui.showAchievementsScreen();
        });
      });

      // show level select screen button
      document.querySelectorAll(".levelSelectButton").forEach(function (el) {
        el.addEventListener("click", function () {
          lightBot.ui.showLevelSelectScreen();
        });
      });

      // show game screen buttons
      var levelList = document.getElementById("levelList");
      if (levelList) {
        levelList.addEventListener("click", function (e) {
          var tile = e.target && e.target.closest ? e.target.closest(".lb-level-tile") : null;
          if (!tile) return;
          lightBot.ui.showGameScreen(parseInt(tile.getAttribute("data-level"), 10));
        });
      }

      // audio toggle buttons
      document.querySelectorAll(".audioToggleButton").forEach(function (el) {
        el.addEventListener("click", function () {
          lightBot.ui.media.toggleAudio();
        });
      });

      // run program button
      var runButton = document.getElementById("runButton");
      if (runButton) runButton.addEventListener("click", function () {
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
      var clearButton = document.getElementById("clearButton");
      if (clearButton) clearButton.addEventListener("click", function () {
        var list = document.querySelector("#programContainer ul");
        if (list) list.textContent = "";
        lightBot.ui.editor.saveProgram();
      });

      // help screen accordion (play video on selection)
      var accordion = document.getElementById("helpScreenAccordion");
      if (accordion) {
        accordion.addEventListener("change", function (e) {
          var target = e.target;
          if (!target || target.tagName !== "INPUT") return;
          if (target.type !== "radio" || !target.checked) return;
          var holder = target.closest ? target.closest("[data-video]") : null;
          if (!holder) return;
          var idx = parseInt(holder.getAttribute("data-video"), 10);
          if (!isNaN(idx)) lightBot.ui.media.playVideo(idx);
        });
      }
    },
    initSlider: function () {
      // speed slider
      var slider = document.getElementById("speedSlider");
      if (!slider) return;

      slider.value = String(lightBot.speedMultiplier);
      slider.addEventListener("input", function () {
        lightBot.speedMultiplier = parseFloat(slider.value);
      });
      slider.addEventListener("change", function () {
        lightBot.speedMultiplier = parseFloat(slider.value);
      });
    }
  };

  lightBot.ui = ui;
})();
