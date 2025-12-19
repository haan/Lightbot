// Vite entry point: create the app instance, initialize UI/i18n/history, then start the canvas render loop.
import "./styles/main.css";

var assetBaseUrl = import.meta.env.BASE_URL || "/";
document.documentElement.style.setProperty("--lb-achievement-bg", 'url("' + assetBaseUrl + 'img/achievement.png")');
document.documentElement.style.setProperty("--lb-medals-bg", 'url("' + assetBaseUrl + 'img/medals.png")');

import { themeChange } from "theme-change";

import { createApp } from "./lightbot/app.js";

import { initCanvasView } from "./lightbot/lightbot.view.canvas.js";
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
  // `createApp()` is the composition root: it wires together all models + UI + rendering extensions.
  var app = createApp();
  themeChange(false);

  // Hook up DOM elements and event handlers once the document is ready.
  if (app.ui && app.ui.media && typeof app.ui.media.init === "function") app.ui.media.init();
  initDialogs({ ui: app.ui, achievements: app.achievements });

  // Apply translations before we initialize UI controls that use i18next.t().
  await initI18n();

  app.ui.editor.initEditor();
  app.ui.initButtons();
  app.ui.initSlider();

  // Start the render/update loop and then apply the initial route.
  initCanvasView(app);
  initHistory(app);
}

runWhenDomReady(function () {
  boot().catch(function (e) {
    console.error("Lightbot boot failed:", e);
  });
});
