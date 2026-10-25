// Screen-level UI controller (welcome/help/levels/game), plus event handlers for buttons and tiles.
import i18next from "i18next";

export function createUi(params) {
  if (!params) throw new Error("createUi: missing params");
  var bot = params.bot;
  var map = params.map;
  var medals = params.medals;
  var achievements = params.achievements;
  var media = params.media;
  var editor = params.editor;
  var dialogs = params.dialogs;
  var storage = params.storage || localStorage;
  var speed = params.speed;

  if (!bot) throw new Error("createUi: missing bot");
  if (!map) throw new Error("createUi: missing map");
  if (!medals) throw new Error("createUi: missing medals");
  if (!achievements) throw new Error("createUi: missing achievements");
  if (!media) throw new Error("createUi: missing media");
  if (!editor) throw new Error("createUi: missing editor");
  if (!dialogs) throw new Error("createUi: missing dialogs");
  if (!speed || typeof speed.get !== "function" || typeof speed.set !== "function") {
    throw new Error("createUi: missing speed.get/speed.set");
  }

  function hideAllScreens() {
    // hide all screens before showing the next one.
    var screens = document.querySelectorAll(".lb-screen");
    for (var i = 0; i < screens.length; i++) screens[i].classList.add("hidden");
  }

  function showScreen(id) {
    // show a single screen by id.
    var el = document.getElementById(id);
    if (el) el.classList.remove("hidden");
  }

  function selectHelpTopic(radio) {
    var topic = radio.closest("[data-help-topic]");
    if (!topic) return;
    var key = "helpScreen." + topic.getAttribute("data-help-topic");
    var title = document.getElementById("helpDetailTitle");
    var content = document.getElementById("helpDetailContent");
    // Keep translation keys in sync so a language change also updates this lesson.
    title.setAttribute("data-i18n", key + ".title");
    title.textContent = i18next.t(key + ".title");
    content.setAttribute("data-i18n", key + ".content");
    content.textContent = i18next.t(key + ".content");
    document.getElementById("helpDetail").scrollTop = 0;
    media.playVideo(Number(topic.getAttribute("data-video")));
  }

  var ui = {
    History: null,
    renderLoop: null,
    dialogs: dialogs,
    media: media,
    editor: editor,

    _setRenderLoopState: function (isRunning) {
      var loop = ui.renderLoop;
      if (!loop) return;
      if (isRunning && typeof loop.start === "function") loop.start();
      if (!isRunning && typeof loop.stop === "function") loop.stop();
    },

    _setRunButtonState: function (isRunning) {
      var btn = document.getElementById("runButton");
      if (!btn) return;

      // switch button style, tooltip, and icons based on run state.
      btn.classList.toggle("btn-primary", !isRunning);
      btn.classList.toggle("btn-error", isRunning);
      btn.setAttribute("title", isRunning ? i18next.t("controls.stop") : i18next.t("gameScreen.run"));

      var runIcon = btn.querySelector(".lb-run-icon");
      if (runIcon && runIcon.classList) runIcon.classList.toggle("hidden", isRunning);
      var stopIcon = btn.querySelector(".lb-stop-icon");
      if (stopIcon && stopIcon.classList) stopIcon.classList.toggle("hidden", !isRunning);
    },

    showWelcomeScreen: function (hist) {
      media.playMenuAudio();
      ui._setRenderLoopState(false);

      if (hist == null && ui.History) ui.History.pushState({ page: "welcomeScreen" });
      document.title = "Lightbot - Welcome";

      hideAllScreens();
      showScreen("welcomeScreen");
    },

    showHelpScreen: function (hist) {
      media.playMenuAudio();
      ui._setRenderLoopState(false);

      if (hist == null && ui.History) ui.History.pushState({ page: "helpScreen" });
      document.title = "Lightbot - Help";

      hideAllScreens();
      showScreen("helpScreen");

      // Open the first lesson with its matching explanation and demonstration.
      var firstRadio = document.querySelector('#helpTopics [data-video="0"] input[type="radio"]');
      if (firstRadio) {
        firstRadio.checked = true;
        selectHelpTopic(firstRadio);
        document.getElementById("helpTopics").scrollTop = 0;
      }
    },

    showAchievementsScreen: function (hist) {
      media.playMenuAudio();
      ui._setRenderLoopState(false);

      var list = document.getElementById("achievementsList");
      if (list) list.textContent = "";

      var listItems = achievements.getAchievementsList();
      var unlockedCount = 0;
      // rebuild the achievements list in the current language.
      for (var i = 0; i < listItems.length; i++) {
        var enabled = !!achievements.hasAchievement(listItems[i].name);
        if (enabled) unlockedCount++;
        if (!list) continue;

        var li = document.createElement("li");
        li.className = "achievement-row" + (enabled ? " achievement-row--unlocked" : "");

        var img = document.createElement("img");
        img.className = "achievement-icon";
        img.src = "img/achievements/" + listItems[i].name + ".png";
        img.alt = "";
        img.width = 40;
        img.height = 40;

        var content = document.createElement("div");
        content.className = "achievement-copy";

        var title = document.createElement("h2");
        var titleKey = listItems[i].i18nKey ? listItems[i].i18nKey + ".title" : "";
        title.textContent = titleKey ? i18next.t(titleKey) : listItems[i].title || listItems[i].name;
        if (titleKey) title.setAttribute("data-i18n", titleKey);

        var message = document.createElement("p");
        var messageKey = listItems[i].i18nKey ? listItems[i].i18nKey + ".message" : "";
        message.textContent = messageKey ? i18next.t(messageKey) : listItems[i].message || "";
        if (messageKey) message.setAttribute("data-i18n", messageKey);

        var status = document.createElement("span");
        status.className = "achievement-status";
        var statusKey = "achievementsScreen." + (enabled ? "unlocked" : "locked");
        status.setAttribute("data-i18n", statusKey);
        status.textContent = i18next.t(statusKey);

        content.appendChild(title);
        content.appendChild(message);

        li.appendChild(img);
        li.appendChild(content);
        li.appendChild(status);
        list.appendChild(li);
      }

      var count = document.getElementById("achievementCount");
      if (count) count.textContent = unlockedCount + " / " + listItems.length;
      var progress = document.getElementById("achievementProgress");
      if (progress) {
        progress.max = Math.max(1, listItems.length);
        progress.value = unlockedCount;
      }
      if (list) list.scrollTop = 0;

      if (hist == null && ui.History) ui.History.pushState({ page: "achievementsScreen" });
      document.title = "Lightbot - Achievements";

      hideAllScreens();
      showScreen("achievementsScreen");
    },

    showLevelSelectScreen: function (hist) {
      media.playMenuAudio();
      ui._setRenderLoopState(false);

      var levelList = document.getElementById("levelList");
      if (levelList) levelList.textContent = "";
      var totalLevels = map.getNbrOfLevels();
      var completedLevels = 0;

      // build the level tiles with medal state from storage.
      for (var i = 0; i < totalLevels; i++) {
        var item = parseInt(storage.getItem("lightbot_level_" + i), 10);
        var medal = "";
        var statusKey = "levelSelectScreen.incomplete";

        if (item) {
          switch (item) {
            case medals.gold:
              medal = "medal-gold";
              statusKey = "levelSelectScreen.gold";
              break;
            case medals.silver:
              medal = "medal-silver";
              statusKey = "levelSelectScreen.silver";
              break;
            case medals.bronze:
              medal = "medal-bronze";
              statusKey = "levelSelectScreen.bronze";
              break;
            case medals.noMedal:
              statusKey = "levelSelectScreen.completed";
              break;
            default:
              console.error('Unknown medal "' + item + '"');
              break;
          }
        }

        var completed = statusKey !== "levelSelectScreen.incomplete";
        if (completed) completedLevels++;
        if (!levelList) continue;

        var tile = document.createElement("button");
        tile.type = "button";
        tile.className = "lb-level-tile" + (completed ? " lb-level-tile--completed" : "");
        tile.dataset.level = String(i);
        tile.setAttribute("aria-label", i18next.t("levelSelectScreen.level", { number: i }) + ", " + i18next.t(statusKey));

        var number = document.createElement("span");
        number.className = "level-number";
        number.textContent = String(i);
        tile.appendChild(number);

        var footer = document.createElement("span");
        footer.className = "level-tile-footer";
        footer.setAttribute("aria-hidden", "true");
        var status = document.createElement("span");
        status.className = "sr-only";
        status.setAttribute("data-i18n", statusKey);
        status.textContent = i18next.t(statusKey);
        footer.appendChild(status);

        if (medal) {
          var medalEl = document.createElement("span");
          medalEl.className = "medal " + medal;
          medalEl.setAttribute("aria-hidden", "true");
          footer.appendChild(medalEl);
        }
        tile.appendChild(footer);
        levelList.appendChild(tile);
      }

      var completedCount = document.getElementById("levelCompletedCount");
      if (completedCount) completedCount.textContent = i18next.t("levelSelectScreen.progress", {
        completed: completedLevels,
        total: totalLevels,
      });
      if (levelList) levelList.scrollTop = 0;

      if (hist == null && ui.History) ui.History.pushState({ page: "levelSelectScreen" });
      document.title = "Lightbot - Level Select";

      hideAllScreens();
      showScreen("levelSelectScreen");
    },

    showGameScreen: function (level, hist) {
      media.playGameAudio();
      // Load level data and reset model state for gameplay.
      map.loadMap(level);

      if (hist == null && ui.History) ui.History.pushState({ page: "gameScreen", level: level });
      document.title = "Lightbot - Level " + level;

      hideAllScreens();

      // clear program list before loading saved instructions.
      var programList = document.querySelector("#programContainer ul");
      if (programList) programList.textContent = "";

      // Restore the player's saved program for this level (if present).
      if (storage.getItem("lightbot_program_level_" + level)) {
        editor.loadProgram();
      }

      ui._setRunButtonState(false);
      showScreen("gameScreen");
      ui._setRenderLoopState(true);
    },

    initButtons: function () {
      // Screen navigation buttons.
      document.querySelectorAll(".helpButton").forEach(function (el) {
        el.addEventListener("click", function () {
          ui.showHelpScreen();
        });
      });

      document.querySelectorAll(".mainMenuButton").forEach(function (el) {
        el.addEventListener("click", function () {
          ui.showWelcomeScreen();
        });
      });

      document.querySelectorAll(".achievementsButton").forEach(function (el) {
        el.addEventListener("click", function () {
          ui.showAchievementsScreen();
        });
      });

      document.querySelectorAll(".levelSelectButton").forEach(function (el) {
        el.addEventListener("click", function () {
          ui.showLevelSelectScreen();
        });
      });

      var levelList = document.getElementById("levelList");
      if (levelList) {
        levelList.addEventListener("click", function (e) {
          var tile = e.target && e.target.closest ? e.target.closest(".lb-level-tile") : null;
          if (!tile) return;
          // open the selected level.
          ui.showGameScreen(parseInt(tile.getAttribute("data-level"), 10));
        });
      }

      document.querySelectorAll(".audioToggleButton").forEach(function (el) {
        el.addEventListener("click", function () {
          media.toggleAudio();
        });
      });

      // Gameplay controls.
      var runButton = document.getElementById("runButton");
      if (runButton) {
        runButton.addEventListener("click", function () {
          if (bot.isInExecutionMode()) {
            // stop execution and reset the map.
            map.reset();
            ui._setRunButtonState(false);
          } else {
            // queue current program and start execution.
            var program = editor.getProgramInstructions();
            bot.queueInstructions(program);
            bot.execute();
            ui._setRunButtonState(true);
          }
        });
      }

      var clearButton = document.getElementById("clearButton");
      if (clearButton) {
        clearButton.addEventListener("click", function () {
          // wipe the program and persist the empty state.
          var list = document.querySelector("#programContainer ul");
          if (list) list.textContent = "";
          editor.saveProgram();
        });
      }

      // Native radio controls support both clicking and arrow-key topic selection.
      var helpTopics = document.getElementById("helpTopics");
      if (helpTopics) {
        helpTopics.addEventListener("change", function (e) {
          var target = e.target;
          if (!target || target.tagName !== "INPUT") return;
          if (target.type !== "radio" || !target.checked) return;
          selectHelpTopic(target);
        });
      }
    },

    initSlider: function () {
      var slider = document.getElementById("speedSlider");
      if (!slider) return;

      // keep the slider in sync with the current speed setting.
      slider.value = String(speed.get());
      slider.addEventListener("input", function () {
        speed.set(parseFloat(slider.value));
      });
      slider.addEventListener("change", function () {
        speed.set(parseFloat(slider.value));
      });
    },
  };

  return ui;
}
