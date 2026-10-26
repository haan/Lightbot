import test from 'node:test';
import assert from 'node:assert/strict';
import { createDialogs, initDialogs } from '../src/lightbot/lightbot.view.canvas.ui.dialogs.js';
import { createMedia } from '../src/lightbot/lightbot.view.canvas.ui.media.js';
import { createUi } from '../src/lightbot/lightbot.view.canvas.ui.js';

test('dialogs follow game bounds after focus, scroll and resize, and retain close behavior', () => {
  let rect = { left: 80, top: 40, width: 980, height: 704 };
  const screen = { getBoundingClientRect: () => rect };
  const observers = [];
  globalThis.window = new EventTarget();
  globalThis.ResizeObserver = class {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(target) { assert.equal(target, screen); }
    disconnect() { this.disconnected = true; }
  };
  class Dialog extends EventTarget {
    style = {};
    open = false;
    showModal() { this.open = true; rect = { ...rect, top: 20 }; }
    close() { this.open = false; this.dispatchEvent(new Event('close')); }
  }
  const elements = { levelCompleteDialog: new Dialog(), achievementDialog: new Dialog() };
  globalThis.document = {
    getElementById: id => elements[id],
    querySelector: () => screen,
  };
  let levelSelectCalls = 0;
  let achievementCalls = 0;
  initDialogs({
    ui: { showLevelSelectScreen() { levelSelectCalls++; } },
    achievements: { display() { achievementCalls++; } },
  });
  const dialogs = createDialogs();
  for (const id of Object.keys(elements)) {
    const dialog = elements[id];
    dialogs.open(id);
    assert.equal(dialog.open, true);
    assert.deepEqual(dialog.style, { left: '80px', top: '20px', width: '980px', height: '704px' });
    const observer = observers.at(-1);
    dialogs.open(id);
    assert.equal(observers.at(-1), observer, 'Opening an open dialog must not add listeners');
    rect = { ...rect, top: -60 };
    window.dispatchEvent(new Event('scroll'));
    assert.equal(dialog.style.top, '-60px');
    rect = { ...rect, left: 120 };
    window.dispatchEvent(new Event('resize'));
    assert.equal(dialog.style.left, '120px');
    rect = { ...rect, height: 680 };
    observer.callback();
    assert.equal(dialog.style.height, '680px');
    dialogs.close(id);
    assert.equal(observer.disconnected, true);
    const closedStyle = { ...dialog.style };
    rect = { left: 80, top: 40, width: 980, height: 704 };
    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('scroll'));
    assert.deepEqual(dialog.style, closedStyle, 'Closed dialogs must detach their listeners');
  }
  assert.equal(levelSelectCalls, 1);
  assert.equal(achievementCalls, 1);
});

test('screen navigation pauses the Help video without changing its playback position', () => {
  const media = createMedia();
  const video = { paused: false, currentTime: 3, pause() { this.paused = true; } };
  media.videoEl = video;
  globalThis.document = {
    querySelectorAll: () => [],
    querySelector: () => null,
    getElementById: () => null,
  };
  const ui = createUi({
    bot: {}, map: { getNbrOfLevels: () => 0, loadMap() {} },
    medals: {}, achievements: { getAchievementsList: () => [] },
    editor: { setExecuting() {} }, media, dialogs: {},
    storage: { getItem: () => null }, speed: { get: () => 2, set() {} },
  });
  for (const navigate of [
    () => ui.showWelcomeScreen(true),
    () => ui.showLevelSelectScreen(true),
    () => ui.showAchievementsScreen(true),
    () => ui.showGameScreen(0, true),
  ]) {
    video.paused = false;
    navigate();
    assert.equal(video.paused, true);
    assert.equal(video.currentTime, 3);
  }
  media.videoEl = null;
  assert.doesNotThrow(() => media.pauseVideo());
});
