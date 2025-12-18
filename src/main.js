import "./styles/main.css";

import "./bootstrap.js";

document.documentElement.style.setProperty("--lb-achievement-bg", 'url("img/achievement.png")');
document.documentElement.style.setProperty("--lb-medals-bg", 'url("img/medals.png")');
document.documentElement.style.setProperty("--lb-video-play-button-bg", 'url("img/video_play_button.png")');

import { themeChange } from "theme-change";
themeChange();

import Sortable from "sortablejs";
globalThis.Sortable = Sortable;

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
import "./lightbot/lightbot.view.canvas.js";
import "./lightbot/lightbot.view.canvas.ui.js";
import "./lightbot/lightbot.view.canvas.ui.media.js";
import "./lightbot/lightbot.view.canvas.ui.translate.js";
import "./lightbot/lightbot.view.canvas.ui.dialogs.js";
import "./lightbot/lightbot.view.canvas.ui.editor.js";
import "./lightbot/lightbot.view.canvas.ui.history.js";
import "./lightbot/lightbot.view.canvas.game.js";
import "./lightbot/lightbot.view.canvas.map.js";
import "./lightbot/lightbot.view.canvas.box.js";
import "./lightbot/lightbot.view.canvas.bot.animations.js";
import "./lightbot/lightbot.view.canvas.bot.js";
import "./lightbot/lightbot.view.canvas.projection.js";
import "./lightbot/lightbot.view.canvas.medals.js";
import "./lightbot/lightbot.view.canvas.achievements.js";
