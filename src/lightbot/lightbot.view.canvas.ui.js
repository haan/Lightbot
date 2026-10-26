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
    media.pauseVideo();
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
    _executionBlocked: false,
    _programFinished: false,

    _setGameStatus: function (key) {
      var status = document.getElementById("gameRunStatus");
      if (!status) return;
      status.hidden = key === "ready";
      if (status.hidden) {
        status.textContent = "";
        status.removeAttribute("data-i18n");
        status.removeAttribute("data-i18n-title");
        status.removeAttribute("title");
        return;
      }
      if (status.getAttribute("data-i18n") === "gameScreen.status." + key && status.textContent) return;
      status.setAttribute("data-i18n", "gameScreen.status." + key);
      status.setAttribute("data-i18n-title", "gameScreen." + key);
      status.setAttribute("title", i18next.t("gameScreen." + key));
      status.textContent = i18next.t("gameScreen.status." + key);
    },

    onInstruction: function (instruction, blocked) {
      editor.highlightInstruction(instruction, blocked);
      if (blocked) ui._executionBlocked = true;
      ui._setGameStatus(blocked ? "blocked" : "running");
    },

    onProgramFinished: function () {
      if (ui._programFinished) return;
      ui._programFinished = true;
      ui._setGameStatus(ui._executionBlocked ? "blocked" : "finished");
      ui._updateExecutionButton();
    },

    _setRenderLoopState: function (isRunning) {
      var loop = ui.renderLoop;
      if (!loop) return;
      if (isRunning && typeof loop.start === "function") loop.start();
      if (!isRunning && typeof loop.stop === "function") loop.stop();
    },

    _updateExecutionButton: function () {
      var btn = document.getElementById("runButton");
      if (!btn) return;
      var started = bot.isInExecutionMode();
      var canPause = started && !ui._programFinished && !bot.isPaused();
      var key = "gameScreen." + (ui._programFinished ? "runAgain" : bot.isPaused() ? "resume" : started ? "pause" : "run");
      btn.setAttribute("data-i18n-title", key);
      btn.setAttribute("title", i18next.t(key));
      var label = btn.querySelector(".lb-run-label");
      if (label) {
        label.setAttribute("data-i18n", key);
        label.textContent = i18next.t(key);
      }
      var runIcon = btn.querySelector(".lb-run-icon");
      if (runIcon) runIcon.classList.toggle("hidden", canPause);
      var pauseIcon = btn.querySelector(".lb-pause-icon");
      if (pauseIcon) pauseIcon.classList.toggle("hidden", !canPause);
      var reset = document.getElementById("resetButton");
      if (reset) reset.disabled = !started;
    },

    _setRunButtonState: function (isRunning) {
      var screen = document.getElementById("gameScreen");
      if (screen) screen.classList.toggle("is-executing", isRunning);
      var clear = document.getElementById("clearButton");
      if (clear) clear.disabled = isRunning;
      editor.setExecuting(isRunning);
      ui._executionBlocked = false;
      ui._programFinished = false;
      ui._setGameStatus(isRunning ? "running" : "ready");
      ui._updateExecutionButton();
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
      var levelTitle = document.getElementById("gameLevelTitle");
      if (levelTitle) levelTitle.textContent = i18next.t("levelSelectScreen.level", { number: level });

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
          if (bot.isInExecutionMode() && !ui._programFinished) {
            if (bot.isPaused()) {
              bot.resume();
              ui._setGameStatus("running");
            } else {
              bot.pause();
              ui._setGameStatus("paused");
            }
            ui._updateExecutionButton();
          } else {
            // Reruns always start with a fresh puzzle and freshly compiled repeat counters.
            if (ui._programFinished) {
              map.reset();
              editor.setExecuting(false);
            }
            // queue current program and start execution.
            var program = editor.getProgramInstructions();
            if (!program.length) return;
            bot.queueInstructions(program);
            bot.execute();
            ui._setRunButtonState(true);
          }
        });
      }

      var resetButton = document.getElementById("resetButton");
      if (resetButton) {
        resetButton.addEventListener("click", function () {
          if (!bot.isInExecutionMode()) return;
          map.reset();
          ui._setRunButtonState(false);
        });
      }

      var clearButton = document.getElementById("clearButton");
      if (clearButton) {
        clearButton.addEventListener("click", function () {
          if (bot.isInExecutionMode()) return;
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
