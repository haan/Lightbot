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

      // default the accordion to the first topic and load its video.
      var firstRadio = document.querySelector('#helpScreenAccordion [data-video="0"] input[type="radio"]');
      if (firstRadio) firstRadio.checked = true;
      if (typeof media.playVideo === "function") media.playVideo(0);
    },

    showAchievementsScreen: function (hist) {
      media.playMenuAudio();
      ui._setRenderLoopState(false);

      var list = document.getElementById("achievementsList");
      if (list) list.textContent = "";

      var listItems = achievements.getAchievementsList();
      // rebuild the achievements list in the current language.
      for (var i = 0; i < listItems.length; i++) {
        var enabled = !!achievements.hasAchievement(listItems[i].name);
        if (!list) continue;

        var li = document.createElement("li");
        li.className = "list-row " + (enabled ? "" : "opacity-40") + " py-3";

        var imgWrap = document.createElement("div");
        var img = document.createElement("img");
        img.className = "size-10 rounded-box";
        img.src = "img/achievements/" + listItems[i].name + ".png";
        img.alt = "";
        imgWrap.appendChild(img);

        var content = document.createElement("div");
        content.className = "flex-1";

        var title = document.createElement("div");
        title.className = "font-bold";
        var titleKey = listItems[i].i18nKey ? listItems[i].i18nKey + ".title" : "";
        title.textContent = titleKey ? i18next.t(titleKey) : listItems[i].title || listItems[i].name;

        var message = document.createElement("div");
        message.className = "text-sm opacity-70";
        var messageKey = listItems[i].i18nKey ? listItems[i].i18nKey + ".message" : "";
        message.textContent = messageKey ? i18next.t(messageKey) : listItems[i].message || "";

        content.appendChild(title);
        content.appendChild(message);

        li.appendChild(imgWrap);
        li.appendChild(content);
        list.appendChild(li);
      }

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

      // build the level tiles with medal state from storage.
      for (var i = 0; i < map.getNbrOfLevels(); i++) {
        var item = parseInt(storage.getItem("lightbot_level_" + i), 10);
        var medal = "";

        if (!levelList) continue;
        var tile = document.createElement("div");
        tile.className =
          "lb-level-tile relative select-none w-34 h-30 rounded-box bg-base-200 hover:bg-base-300 shadow cursor-pointer flex items-center justify-center text-4xl font-black";
        if (item) tile.classList.add("lb-level-tile--completed");
        tile.dataset.level = String(i);
        tile.textContent = String(i);

        if (item) {
          switch (item) {
            case medals.gold:
              medal = "medal-gold";
              break;
            case medals.silver:
              medal = "medal-silver";
              break;
            case medals.bronze:
              medal = "medal-bronze";
              break;
            case medals.noMedal:
              break;
            default:
              console.error('Unknown medal "' + item + '"');
              break;
          }
        }

        if (medal) {
          var medalEl = document.createElement("span");
          medalEl.className = "medal " + medal;
          tile.appendChild(medalEl);
        }
        levelList.appendChild(tile);
      }

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

      // Help accordion: swap the demo video when selecting a help topic.
      var accordion = document.getElementById("helpScreenAccordion");
      if (accordion) {
        accordion.addEventListener("change", function (e) {
          var target = e.target;
          if (!target || target.tagName !== "INPUT") return;
          if (target.type !== "radio" || !target.checked) return;
          var holder = target.closest ? target.closest("[data-video]") : null;
          if (!holder) return;
          var idx = parseInt(holder.getAttribute("data-video"), 10);
          if (!isNaN(idx)) media.playVideo(idx);
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
