import "./styles/main.css";

import "@fontsource/pt-sans/400.css";
import "@fontsource/pt-sans/700.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/900.css";

document.documentElement.style.setProperty("--lb-achievement-bg", 'url("img/achievement.png")');
document.documentElement.style.setProperty("--lb-medals-bg", 'url("img/medals.png")');

import { themeChange } from "theme-change";

import "./locales/translations.js";

import "./lightbot/lightbot.model.game.js";
import "./lightbot/lightbot.model.directions.js";
import "./lightbot/lightbot.model.bot.js";
import "./lightbot/lightbot.model.bot.instructions.js";
import "./lightbot/lightbot.model.map.js";
import "./lightbot/lightbot.model.map.state.js";
import "./lightbot/lightbot.model.box.js";
import "./lightbot/lightbot.model.lightbox.js";
import "./lightbot/lightbot.model.medals.js";
import "./lightbot/lightbot.model.achievements.js";
import "./lightbot/lightbot.view.canvas.ui.js";
import "./lightbot/lightbot.view.canvas.ui.editor.js";
import "./lightbot/lightbot.view.canvas.map.js";
import "./lightbot/lightbot.view.canvas.box.js";
import "./lightbot/lightbot.view.canvas.bot.animations.js";
import "./lightbot/lightbot.view.canvas.bot.js";
import "./lightbot/lightbot.view.canvas.projection.js";
import "./lightbot/lightbot.view.canvas.medals.js";
import "./lightbot/lightbot.view.canvas.achievements.js";

import { initCanvasView } from "./lightbot/lightbot.view.canvas.js";
import { initMedia } from "./lightbot/lightbot.view.canvas.ui.media.js";
import { initI18n } from "./lightbot/lightbot.view.canvas.ui.translate.js";
import { initDialogs } from "./lightbot/lightbot.view.canvas.ui.dialogs.js";
import { initHistory } from "./lightbot/lightbot.view.canvas.ui.history.js";

function runWhenDomReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
}

async function boot() {
  themeChange();

  initMedia();
  initDialogs();

  await initI18n();

  lightBot.ui.editor.initEditor();
  lightBot.ui.initButtons();
  lightBot.ui.initSlider();

  initCanvasView();
  initHistory();
}

runWhenDomReady(function () {
  boot().catch(function (e) {
    console.error("Lightbot boot failed:", e);
  });
});
