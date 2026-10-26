import test from 'node:test';
import assert from 'node:assert/strict';
import i18next from 'i18next';
import { createBox } from '../src/lightbot/lightbot.model.box.js';
import { createLightBox } from '../src/lightbot/lightbot.model.lightbox.js';
import { createDirections } from '../src/lightbot/lightbot.model.directions.js';
import { createBotInstructions } from '../src/lightbot/lightbot.model.bot.instructions.js';
import { createBot } from '../src/lightbot/lightbot.model.bot.js';
import { createMap } from '../src/lightbot/lightbot.model.map.js';
import { createEditor } from '../src/lightbot/lightbot.view.canvas.ui.editor.js';
import { createUi } from '../src/lightbot/lightbot.view.canvas.ui.js';
import { Projection, getMapFrame } from '../src/lightbot/lightbot.view.canvas.projection.js';
import { extendBoxView } from '../src/lightbot/lightbot.view.canvas.box.js';
import { extendBotView } from '../src/lightbot/lightbot.view.canvas.bot.js';
import { createBotAnimations } from '../src/lightbot/lightbot.view.canvas.bot.animations.js';
import { LIGHTBOT_TRANSLATIONS_EN as en } from '../src/locales/translations.en.js';
import { LIGHTBOT_TRANSLATIONS_DE as de } from '../src/locales/translations.de.js';
import { LIGHTBOT_TRANSLATIONS_FR as fr } from '../src/locales/translations.fr.js';

function model() {
  const Box = createBox();
  const LightBox = createLightBox({ Box });
  const instructions = createBotInstructions();
  let map;
  const bot = createBot({ directions: createDirections(), getMap: () => map, instructions, LightBox });
  map = createMap({ bot, Box, LightBox });
  map.loadMap(0);
  return { bot, map, instructions, Box, LightBox };
}

function element(classes = []) {
  const names = new Set(classes);
  return {
    attrs: {}, children: [], handlers: {}, textContent: '', scrollTop: 0,
    classList: {
      contains: name => names.has(name),
      add: (...items) => items.forEach(name => names.add(name)),
      remove: (...items) => items.forEach(name => names.delete(name)),
      toggle(name, on) { if (on) names.add(name); else names.delete(name); },
    },
    setAttribute(key, value) { this.attrs[key] = value; },
    getAttribute(key) { return this.attrs[key]; },
    removeAttribute(key) { delete this.attrs[key]; },
    addEventListener(name, callback) { this.handlers[name] = callback; },
    querySelector() { return null; },
    getBoundingClientRect() { return { top: 0, bottom: 100 }; },
  };
}

function command(type, count = 2, body = []) {
  const row = element([type, 'lb-instruction-row']);
  const li = element();
  li.tagName = 'LI';
  li.row = row;
  li.querySelector = selector => selector === 'p' ? row : selector === 'input[type="number"]' ? { value: String(count) } : selector === '.lb-repeat-body ul' ? { children: body } : null;
  return li;
}

function documentFor(elements, program, rows = []) {
  globalThis.document = {
    title: '',
    getElementById: id => elements[id] || null,
    querySelector(selector) {
      if (selector === '#programContainer ul') return program;
      if (selector === '#runButton .lb-run-label') return elements.runLabel;
      return null;
    },
    querySelectorAll(selector) {
      if (selector.includes('#programContainer')) return rows;
      return [];
    },
  };
}

test('nested repeats retain the source row through execution and never serialize DOM references', () => {
  const m = model();
  const turn = command('turnLeft');
  const nested = command('repeat', 2, [command('repeat', 2, [turn])]);
  const walk = command('walk');
  const light = command('light');
  const list = { children: [nested, walk, walk, light] };
  const container = element();
  container.querySelector = () => list;
  documentFor({ programContainer: container }, list, [turn.row, nested.row, walk.row, light.row]);
  let saved;
  const storage = { setItem(key, value) { saved = JSON.parse(value); }, removeItem() {} };
  const editor = createEditor({ ...m, storage });
  m.bot.queueInstructions(editor.getProgramInstructions());
  m.bot.execute();
  const sources = [];
  while (m.bot.hasNextInstruction()) sources.push(m.bot.executeNextInstruction().sourceElement);
  const innerRow = nested.querySelector('.lb-repeat-body ul').children[0].row;
  assert.deepEqual(sources, [nested.row, innerRow, turn.row, innerRow, turn.row, nested.row, innerRow, turn.row, innerRow, turn.row, walk.row, walk.row, light.row]);
  assert.equal(m.map.getMapRef()[4][3].lightOn, true);
  editor.saveProgram();
  assert.deepEqual(saved.program[0], { type: 'repeat', count: 2, body: [{ type: 'repeat', count: 2, body: [{ type: 'turnLeft' }] }] });
  assert.equal(JSON.stringify(saved).includes('sourceElement'), false);
});

test('all 16 levels fit the canvas with space for the robot above every tile', () => {
  const m = model();
  extendBoxView({ ...m, app: {} });
  const projection = new Projection(620, 310, 100);
  for (let level = 0; level < m.map.getNbrOfLevels(); level++) {
    m.map.loadMap(level);
    const frame = getMapFrame(m.map, projection, 620, 620);
    assert.ok(frame.scale > 0 && frame.scale <= 1);
    for (const column of m.map.getMapRef()) for (const tile of column) {
      for (const x of [tile.x, tile.x + 1]) for (const y of [tile.y, tile.y + 1]) {
        for (const z of [0, tile.getHeight() * tile.getEdgeLength()]) {
          const p = projection.project(x * tile.getEdgeLength(), z, y * tile.getEdgeLength());
          const px = p.x * frame.scale + frame.x;
          const top = (p.y - 70) * frame.scale + frame.y;
          const bottom = p.y * frame.scale + frame.y;
          assert.ok(px >= 23.99 && px <= 596.01 && top >= 23.99 && bottom <= 596.01, `Level ${level} clips a tile or robot`);
        }
      }
    }
  }
});

test('Run, Pause, Resume, Run again and Reset stay in sync in every language', async () => {
  await i18next.init({ lng: 'en', resources: { en: { translation: en }, de: { translation: de }, fr: { translation: fr } } });
  for (const language of ['en', 'de', 'fr']) {
    await i18next.changeLanguage(language);
    const m = model();
    const elements = Object.fromEntries(['runButton', 'resetButton', 'runLabel', 'clearButton', 'gameScreen', 'gameRunStatus'].map(id => [id, element()]));
    elements.runButton.querySelector = selector => selector === '.lb-run-label' ? elements.runLabel : null;
    const list = { textContent: 'program' };
    documentFor(elements, list);
    const editor = {
      executing: false,
      setExecuting(value) { this.executing = value; },
      getProgramInstructions() { return [new m.instructions.WalkInstruction(), new m.instructions.WalkInstruction(), new m.instructions.LightInstruction()]; },
      highlightInstruction() {}, saveProgram() { throw new Error('Cannot clear while executing'); },
    };
    const ui = createUi({ ...m, editor, storage: {}, medals: {}, achievements: {}, media: {}, dialogs: {}, speed: { get: () => 2, set() {} } });
    ui.initButtons();
    ui._setRunButtonState(false);
    assert.equal(elements.resetButton.disabled, true);
    elements.runButton.handlers.click();
    assert.equal(editor.executing, true);
    assert.equal(elements.clearButton.disabled, true);
    assert.equal(elements.runLabel.textContent, i18next.t('gameScreen.pause'));
    assert.equal(elements.resetButton.disabled, false);
    const queue = m.bot.executionQueue.slice();
    elements.runButton.handlers.click();
    assert.equal(m.bot.isPaused(), true);
    assert.equal(editor.executing, true);
    assert.equal(elements.runLabel.textContent, i18next.t('gameScreen.resume'));
    assert.equal(elements.gameRunStatus.textContent, i18next.t('gameScreen.status.paused'));
    assert.equal(elements.gameRunStatus.hidden, false);
    assert.equal(m.bot.executeNextInstruction(), null);
    assert.deepEqual(m.bot.executionQueue, queue);
    elements.runButton.handlers.click();
    assert.equal(m.bot.isPaused(), false);
    assert.equal(elements.runLabel.textContent, i18next.t('gameScreen.pause'));
    elements.clearButton.handlers.click();
    assert.equal(list.textContent, 'program');
    while (m.bot.hasNextInstruction()) ui.onInstruction(m.bot.executeNextInstruction(), false);
    assert.equal(m.map.getMapRef()[4][3].lightOn, true);
    ui.onProgramFinished();
    assert.equal(elements.runLabel.textContent, i18next.t('gameScreen.runAgain'));
    assert.equal(elements.gameRunStatus.textContent, i18next.t('gameScreen.status.finished'));
    elements.runButton.handlers.click();
    assert.equal(m.bot.executionQueue.length, 3);
    assert.equal(m.map.getMapRef()[4][3].lightOn, false);
    assert.equal(elements.runLabel.textContent, i18next.t('gameScreen.pause'));
    elements.runButton.handlers.click();
    elements.resetButton.handlers.click();
    assert.equal(editor.executing, false);
    assert.equal(elements.clearButton.disabled, false);
    assert.equal(m.bot.isInExecutionMode(), false);
    assert.equal(m.bot.isPaused(), false);
    assert.equal(elements.resetButton.disabled, true);
    assert.equal(m.map.getMapRef()[4][3].lightOn, false);
    assert.equal(elements.gameRunStatus.textContent, '');
    assert.equal(elements.gameRunStatus.hidden, true);
    ui.onInstruction({}, true);
    ui.onProgramFinished();
    assert.equal(elements.gameRunStatus.textContent, i18next.t('gameScreen.status.blocked'));
  }
});

test('execution locks the palette and program, and reset removes active and blocked markers', () => {
  const m = model();
  const row = element();
  const list = element();
  const container = element();
  container.querySelector = () => list;
  const palette = element();
  documentFor({ programContainer: container, instructionsContainer: palette }, list, [row]);
  const editor = createEditor({ ...m, storage: {} });
  editor.setExecuting(true);
  editor.highlightInstruction({ sourceElement: row }, true);
  assert.equal(list.inert, true);
  assert.equal(palette.inert, true);
  assert.equal(row.classList.contains('is-active'), true);
  assert.equal(row.classList.contains('is-blocked'), true);
  assert.equal(row.attrs['aria-current'], 'step');
  editor.setExecuting(false);
  assert.equal(list.inert, false);
  assert.equal(palette.inert, false);
  assert.equal(row.classList.contains('is-active'), false);
  assert.equal(row.classList.contains('is-blocked'), false);
  assert.equal(row.attrs['aria-current'], undefined);
});

test('palette clicks and Enter/Space append commands, while inputs and execution cannot add them', () => {
  const m = model();
  const list = {
    children: [], parentElement: { scrollTop: 0, scrollHeight: 300 },
    appendChild(item) { this.children.push(item); },
  };
  const container = element();
  container.querySelector = () => list;
  const palette = element();
  palette.contains = () => true;
  documentFor({ programContainer: container, instructionsContainer: palette }, list);
  let writes = 0;
  const editor = createEditor({ ...m, storage: { setItem() { writes++; } } });
  // Sortable's native drag setup requires a browser; exercise the independent add interaction here.
  editor.makeDroppable = () => {};
  editor.initEditor();
  const row = element();
  row.closest = () => ({ cloneNode: () => command('walk') });
  const target = { closest: selector => selector === 'input, button' ? null : row };
  const event = (type, key) => ({ type, key, target, preventDefault() {} });
  palette.handlers.click(event('click'));
  palette.handlers.keydown(event('keydown', 'Enter'));
  palette.handlers.keydown(event('keydown', ' '));
  assert.equal(list.children.length, 3);
  assert.equal(writes, 3);
  palette.handlers.keydown(event('keydown', 'ArrowRight'));
  palette.handlers.click({ type: 'click', target: { closest: () => ({}) } });
  editor._suppressClickUntil = Date.now() + 1000;
  palette.handlers.click(event('click'));
  editor._suppressClickUntil = 0;
  editor.setExecuting(true);
  palette.handlers.click(event('click'));
  assert.equal(list.children.length, 3);
  assert.equal(writes, 3);
});

test('repeat expansion and its body execute separately with exactly one active row', () => {
  const m = model();
  const walk = command('walk');
  const inner = command('repeat', 1, [walk]);
  const outer = command('repeat', 1, [inner]);
  const rows = [outer.row, inner.row, walk.row];
  documentFor({}, null, rows);
  const editor = createEditor({ ...m, storage: {} });
  editor.setExecuting(true);
  m.bot.queueInstructions(editor.getInstructions([outer]));
  m.bot.execute();
  const start = { ...m.bot.currentPos };
  for (const expected of rows) {
    const instruction = m.bot.executeNextInstruction();
    assert.equal(instruction.sourceElement, expected);
    editor.highlightInstruction(instruction, false);
    assert.deepEqual(rows.filter(row => row.classList.contains('is-active')), [expected]);
    if (instruction.name === 'repeat') assert.deepEqual(m.bot.currentPos, start);
  }
  assert.notDeepEqual(m.bot.currentPos, start);
  assert.equal(m.bot.hasNextInstruction(), false);
  editor.setExecuting(false);
  assert.equal(rows.some(row => row.classList.contains('is-active')), false);
});

test('repeat expansion has a brief speed-dependent hold before the next instruction', t => {
  const previousImage = globalThis.Image;
  globalThis.Image = class {};
  t.after(() => { if (previousImage) globalThis.Image = previousImage; else delete globalThis.Image; });
  const durations = [];
  for (const speedMultiplier of [0.5, 2, 3]) {
    const m = model();
    extendBotView({ ...m, app: { speedMultiplier }, animations: createBotAnimations() });
    m.bot.queueInstructions([new m.instructions.RepeatInstruction(1, [new m.instructions.WalkInstruction()])]);
    m.bot.execute();
    const start = { ...m.bot.currentPos };
    const repeat = m.bot.executeNextInstruction();
    assert.equal(repeat.name, 'repeat');
    m.bot.animate(repeat, start, m.bot.currentPos);
    assert.equal(m.bot.isReadyForNextInstruction(), false);
    let ticks = 0;
    while (!m.bot.isReadyForNextInstruction() && ticks < 100) { m.bot.step(); ticks++; }
    assert.ok(ticks > 1 && ticks < 100);
    assert.deepEqual(m.bot.currentPos, start);
    assert.equal(m.bot.executionQueue[0].name, 'walk');
    durations.push(ticks);
  }
  assert.ok(durations[0] > durations[1] && durations[1] > durations[2]);
});

test('empty repeats each consume a separate step and finish without executing a nonexistent body', () => {
  const m = model();
  m.bot.queueInstructions([new m.instructions.RepeatInstruction(2, [])]);
  m.bot.execute();
  assert.equal(m.bot.executeNextInstruction().name, 'repeat');
  assert.equal(m.bot.hasNextInstruction(), true);
  assert.equal(m.bot.executeNextInstruction().name, 'repeat');
  assert.equal(m.bot.hasNextInstruction(), false);
});

test('repeat stepper saves bounded counts and cannot change a running program', () => {
  const container = element();
  container.contains = () => true;
  documentFor({ programContainer: container }, null);
  const editor = createEditor({ ...model(), storage: {} });
  editor.makeDroppable = () => {};
  let saves = 0;
  editor.saveProgram = () => { saves++; };
  editor.initEditor();
  const input = { value: '2', tagName: 'INPUT', type: 'number' };
  function click(delta) {
    const button = { getAttribute: () => String(delta), closest: () => ({ querySelector: () => input }) };
    container.handlers.click({ target: { closest: () => button } });
  }
  click(1);
  assert.equal(input.value, '3');
  click(-1);
  assert.equal(input.value, '2');
  input.value = '1';
  click(-1);
  assert.equal(input.value, '1');
  input.value = '99';
  click(1);
  assert.equal(input.value, '99');
  input.value = '';
  container.handlers.change({ target: input });
  assert.equal(input.value, '2');
  assert.equal(saves, 5);
  editor._executing = true;
  click(1);
  assert.equal(input.value, '2');
  assert.equal(saves, 5);
});

test('pausing mid-animation freezes the frame and queue; resuming continues and reset clears pause', t => {
  const previousImage = globalThis.Image;
  globalThis.Image = class {};
  t.after(() => { if (previousImage) globalThis.Image = previousImage; else delete globalThis.Image; });
  const m = model();
  extendBoxView({ ...m, app: {} });
  extendBotView({ ...m, app: { speedMultiplier: 2 }, animations: createBotAnimations() });
  m.bot.queueInstructions([new m.instructions.WalkInstruction(), new m.instructions.LightInstruction()]);
  m.bot.execute();
  const start = { ...m.bot.currentPos };
  const walk = m.bot.executeNextInstruction();
  m.bot.animate(walk, start, m.bot.currentPos);
  m.bot.step();
  const frame = m.bot.getCurrentStep();
  const position = { ...m.bot.currentPos };
  m.bot.pause();
  for (let i = 0; i < 60; i++) m.bot.step();
  assert.equal(m.bot.getCurrentStep(), frame);
  assert.equal(m.bot.isReadyForNextInstruction(), false);
  assert.equal(m.bot.executeNextInstruction(), null);
  assert.equal(m.bot.executionQueue.length, 1);
  assert.deepEqual(m.bot.currentPos, position);
  m.bot.resume();
  m.bot.step();
  assert.equal(m.bot.getCurrentStep(), frame + 2);
  m.bot.pause();
  m.map.reset();
  assert.equal(m.bot.isPaused(), false);
  assert.equal(m.bot.isInExecutionMode(), false);
  assert.equal(m.bot.executionQueue.length, 0);
  assert.deepEqual(m.bot.currentPos, start);
});

test('speed changes preserve drawn position and sprite frame across pause/resume and during movement', t => {
  const previousImage = globalThis.Image;
  globalThis.Image = class {};
  t.after(() => { if (previousImage) globalThis.Image = previousImage; else delete globalThis.Image; });
  for (const movement of ['walk', 'jumpUp', 'jumpDown']) {
    const m = model();
    let drawn;
    const app = {
      speedMultiplier: 1,
      projection: { project: (x, y, z) => ({ x: x - z, y: -y - z }) },
      ctx: { drawImage(...args) { drawn = args.slice(1); } },
    };
    extendBoxView({ ...m, app });
    extendBotView({ ...m, app, animations: createBotAnimations() });
    const start = { ...m.bot.currentPos };
    const tiles = m.map.getMapRef();
    if (movement === 'jumpUp') tiles[start.x][start.y - 1].height = tiles[start.x][start.y].height + 1;
    if (movement === 'jumpDown') tiles[start.x][start.y].height = tiles[start.x][start.y - 1].height + 2;
    const command = movement === 'walk' ? new m.instructions.WalkInstruction() : new m.instructions.JumpInstruction();
    m.bot.queueInstructions([command, new m.instructions.LightInstruction()]);
    m.bot.execute();
    m.bot.animate(m.bot.executeNextInstruction(), start, m.bot.currentPos);
    assert.equal(m.bot.getAnimation().name, movement);
    for (let tick = 0; tick < 10; tick++) m.bot.step();
    m.bot.draw();
    const beforePause = drawn;
    m.bot.pause();
    app.speedMultiplier = 0.5;
    for (let tick = 0; tick < 10; tick++) m.bot.step();
    m.bot.draw();
    assert.deepEqual(drawn, beforePause, `${movement}: speed change while paused changed the image`);
    m.bot.resume();
    m.bot.draw();
    assert.deepEqual(drawn, beforePause, `${movement}: resume changed the image before time advanced`);
    m.bot.step();
    assert.equal(m.bot.getCurrentStep(), 10.5);
    m.bot.draw();
    const beforeSpeedUp = drawn;
    app.speedMultiplier = 3;
    m.bot.draw();
    assert.deepEqual(drawn, beforeSpeedUp, `${movement}: speed change during execution changed the image`);
    m.bot.step();
    assert.equal(m.bot.getCurrentStep(), 13.5);
    const duration = m.bot.getAnimation().duration;
    while (m.bot.getCurrentStep() < duration) m.bot.step();
    assert.equal(m.bot.getCurrentStep(), duration, `${movement}: progress overshot the destination`);
    m.bot.draw();
    const destination = drawn.slice(4, 6);
    m.bot.step();
    assert.equal(m.bot.isReadyForNextInstruction(), true);
    m.bot.draw();
    assert.deepEqual(drawn.slice(4, 6), destination, `${movement}: completion moved the sprite`);
    assert.equal(m.bot.executionQueue.length, 1);
  }
});
